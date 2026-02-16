// Database adapter - switches between localStorage and Supabase
import { supabaseDb } from './supabase-database';

// Use Supabase for server-side operations
// Note: The interface names differ slightly between implementations
// Supabase uses snake_case (booking_reference) while localStorage uses camelCase (bookingReference)
// This adapter handles the conversion

export interface Booking {
  id: number;
  bookingReference: string;
  cabinId: string;
  cabinName: string;
  guestName: string;
  guestEmail: string;
  guestPhone?: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  nights: number;
  basePrice: number;
  cleaningFee: number;
  serviceFee: number;
  total: number;
  status: 'pending' | 'confirmed' | 'cancelled';
  paymentStatus: 'pending' | 'paid' | 'refunded';
  language: 'en' | 'ro';
  specialRequests?: string;
  ipAddress?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Review {
  id: number;
  name: string;
  email: string;
  cabin: string;
  rating: number;
  comment: string;
  status: 'approved' | 'pending' | 'rejected';
  createdAt: string;
  updatedAt: string;
}

export interface MaintenanceIssue {
  id: number;
  cabin: string;
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'pending' | 'in-progress' | 'completed';
  reportedBy: string;
  reportedByEmail: string;
  assignedTo?: string;
  dueDate?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PromoCode {
  id: number;
  code: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  maxUses?: number;
  currentUses: number;
  validFrom: string;
  validUntil?: string;
  isActive: boolean;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

// Convert between snake_case (Supabase) and camelCase (app)
function toSupabaseBooking(booking: Omit<Booking, 'id' | 'createdAt' | 'updatedAt'>) {
  return {
    booking_reference: booking.bookingReference,
    cabin_id: booking.cabinId,
    cabin_name: booking.cabinName,
    guest_name: booking.guestName,
    guest_email: booking.guestEmail,
    guest_phone: booking.guestPhone,
    check_in: booking.checkIn,
    check_out: booking.checkOut,
    guests: booking.guests,
    nights: booking.nights,
    base_price: booking.basePrice,
    cleaning_fee: booking.cleaningFee,
    service_fee: booking.serviceFee,
    total: booking.total,
    status: booking.status,
    payment_status: booking.paymentStatus,
    language: booking.language,
    special_requests: booking.specialRequests
  };
}

function fromSupabaseBooking(booking: any): Booking {
  return {
    id: booking.id,
    bookingReference: booking.booking_reference,
    cabinId: booking.cabin_id,
    cabinName: booking.cabin_name,
    guestName: booking.guest_name,
    guestEmail: booking.guest_email,
    guestPhone: booking.guest_phone,
    checkIn: booking.check_in,
    checkOut: booking.check_out,
    guests: booking.guests,
    nights: booking.nights,
    basePrice: Number(booking.base_price),
    cleaningFee: Number(booking.cleaning_fee),
    serviceFee: Number(booking.service_fee),
    total: Number(booking.total),
    status: booking.status,
    paymentStatus: booking.payment_status,
    language: booking.language,
    specialRequests: booking.special_requests,
    ipAddress: booking.ip_address,
    createdAt: booking.created_at,
    updatedAt: booking.updated_at
  };
}

function fromSupabaseReview(review: any): Review {
  return {
    id: review.id,
    name: review.name,
    email: review.email,
    cabin: review.cabin,
    rating: review.rating,
    comment: review.comment,
    status: review.status,
    createdAt: review.created_at,
    updatedAt: review.updated_at
  };
}

class DatabaseAdapter {
  // Bookings
  async getAllBookings(): Promise<Booking[]> {
    const bookings = await supabaseDb.getAllBookings();
    return bookings.map(fromSupabaseBooking);
  }

  async getBookingById(id: number): Promise<Booking | null> {
    const booking = await supabaseDb.getBookingById(id);
    return booking ? fromSupabaseBooking(booking) : null;
  }

  async getBookingByReference(reference: string): Promise<Booking | null> {
    const booking = await supabaseDb.getBookingByReference(reference);
    return booking ? fromSupabaseBooking(booking) : null;
  }

  async createBooking(booking: Omit<Booking, 'id' | 'createdAt' | 'updatedAt'>): Promise<Booking | null> {
    const supabaseBooking = toSupabaseBooking(booking);
    const result = await supabaseDb.createBooking(supabaseBooking as any);
    return result ? fromSupabaseBooking(result) : null;
  }

  async updateBooking(id: number, updates: Partial<Booking>): Promise<Booking | null> {
    // Convert camelCase to snake_case for updates
    const supabaseUpdates: any = {};
    if (updates.guestName) supabaseUpdates.guest_name = updates.guestName;
    if (updates.guestEmail) supabaseUpdates.guest_email = updates.guestEmail;
    if (updates.checkIn) supabaseUpdates.check_in = updates.checkIn;
    if (updates.checkOut) supabaseUpdates.check_out = updates.checkOut;
    if (updates.status) supabaseUpdates.status = updates.status;
    if (updates.paymentStatus) supabaseUpdates.payment_status = updates.paymentStatus;

    const result = await supabaseDb.updateBooking(id, supabaseUpdates);
    return result ? fromSupabaseBooking(result) : null;
  }

  async deleteBooking(id: number): Promise<boolean> {
    return await supabaseDb.deleteBooking(id);
  }

  async getUserBookings(email: string): Promise<Booking[]> {
    const bookings = await supabaseDb.getUserBookings(email);
    return bookings.map(fromSupabaseBooking);
  }

  // Reviews
  async getAllReviews(): Promise<Review[]> {
    const reviews = await supabaseDb.getAllReviews();
    return reviews.map(fromSupabaseReview);
  }

  async getReviewById(id: number): Promise<Review | null> {
    const review = await supabaseDb.getReviewById(id);
    return review ? fromSupabaseReview(review) : null;
  }

  async createReview(review: Omit<Review, 'id' | 'createdAt' | 'updatedAt'>): Promise<Review | null> {
    const result = await supabaseDb.createReview(review as any);
    return result ? fromSupabaseReview(result) : null;
  }

  async updateReview(id: number, updates: Partial<Review>): Promise<Review | null> {
    const result = await supabaseDb.updateReview(id, updates as any);
    return result ? fromSupabaseReview(result) : null;
  }

  async deleteReview(id: number): Promise<boolean> {
    return await supabaseDb.deleteReview(id);
  }

  // Statistics
  async getStatistics() {
    return await supabaseDb.getStatistics();
  }

  // Maintenance Issues
  async getAllMaintenanceIssues(): Promise<MaintenanceIssue[]> {
    const issues = await supabaseDb.getAllMaintenanceIssues();
    return issues.map((issue: any) => ({
      id: issue.id,
      cabin: issue.cabin,
      title: issue.title,
      description: issue.description,
      priority: issue.priority,
      status: issue.status,
      reportedBy: issue.reported_by,
      reportedByEmail: issue.reported_by_email,
      assignedTo: issue.assigned_to,
      dueDate: issue.due_date,
      createdAt: issue.created_at,
      updatedAt: issue.updated_at
    }));
  }

  async createMaintenanceIssue(issue: Omit<MaintenanceIssue, 'id' | 'createdAt' | 'updatedAt'>): Promise<MaintenanceIssue | null> {
    const supabaseIssue = {
      cabin: issue.cabin,
      title: issue.title,
      description: issue.description,
      priority: issue.priority,
      status: issue.status,
      reported_by: issue.reportedBy,
      reported_by_email: issue.reportedByEmail,
      assigned_to: issue.assignedTo,
      due_date: issue.dueDate
    };
    const result = await supabaseDb.createMaintenanceIssue(supabaseIssue as any);
    return result ? {
      id: result.id,
      cabin: result.cabin,
      title: result.title,
      description: result.description,
      priority: result.priority,
      status: result.status,
      reportedBy: result.reported_by,
      reportedByEmail: result.reported_by_email,
      assignedTo: result.assigned_to,
      dueDate: result.due_date,
      createdAt: result.created_at,
      updatedAt: result.updated_at
    } : null;
  }

  async updateMaintenanceIssue(id: number, updates: Partial<MaintenanceIssue>): Promise<MaintenanceIssue | null> {
    const supabaseUpdates: any = {};
    if (updates.status) supabaseUpdates.status = updates.status;
    if (updates.assignedTo) supabaseUpdates.assigned_to = updates.assignedTo;
    if (updates.dueDate) supabaseUpdates.due_date = updates.dueDate;
    if (updates.priority) supabaseUpdates.priority = updates.priority;

    const result = await supabaseDb.updateMaintenanceIssue(id, supabaseUpdates);
    return result ? {
      id: result.id,
      cabin: result.cabin,
      title: result.title,
      description: result.description,
      priority: result.priority,
      status: result.status,
      reportedBy: result.reported_by,
      reportedByEmail: result.reported_by_email,
      assignedTo: result.assigned_to,
      dueDate: result.due_date,
      createdAt: result.created_at,
      updatedAt: result.updated_at
    } : null;
  }

  // Promo Codes
  async getAllPromoCodes(): Promise<PromoCode[]> {
    const codes = await supabaseDb.getAllPromoCodes();
    return codes.map((code: any) => ({
      id: code.id,
      code: code.code,
      discountType: code.discount_type,
      discountValue: Number(code.discount_value),
      maxUses: code.max_uses,
      currentUses: code.current_uses,
      validFrom: code.valid_from,
      validUntil: code.valid_until,
      isActive: code.is_active,
      description: code.description,
      createdAt: code.created_at,
      updatedAt: code.updated_at
    }));
  }

  async getPromoCodeByCode(code: string): Promise<PromoCode | null> {
    const result = await supabaseDb.getPromoCodeByCode(code.toUpperCase());
    return result ? {
      id: result.id,
      code: result.code,
      discountType: result.discount_type,
      discountValue: Number(result.discount_value),
      maxUses: result.max_uses,
      currentUses: result.current_uses,
      validFrom: result.valid_from,
      validUntil: result.valid_until,
      isActive: result.is_active,
      description: result.description,
      createdAt: result.created_at,
      updatedAt: result.updated_at
    } : null;
  }

  async createPromoCode(promoCode: Omit<PromoCode, 'id' | 'createdAt' | 'updatedAt' | 'currentUses'>): Promise<PromoCode | null> {
    const supabasePromoCode = {
      code: promoCode.code.toUpperCase(),
      discount_type: promoCode.discountType,
      discount_value: promoCode.discountValue,
      max_uses: promoCode.maxUses,
      valid_from: promoCode.validFrom,
      valid_until: promoCode.validUntil,
      is_active: promoCode.isActive,
      description: promoCode.description
    };
    const result = await supabaseDb.createPromoCode(supabasePromoCode as any);
    return result ? {
      id: result.id,
      code: result.code,
      discountType: result.discount_type,
      discountValue: Number(result.discount_value),
      maxUses: result.max_uses,
      currentUses: result.current_uses,
      validFrom: result.valid_from,
      validUntil: result.valid_until,
      isActive: result.is_active,
      description: result.description,
      createdAt: result.created_at,
      updatedAt: result.updated_at
    } : null;
  }

  async updatePromoCode(id: number, updates: Partial<PromoCode>): Promise<PromoCode | null> {
    const supabaseUpdates: any = {};
    if (updates.isActive !== undefined) supabaseUpdates.is_active = updates.isActive;
    if (updates.currentUses !== undefined) supabaseUpdates.current_uses = updates.currentUses;
    if (updates.maxUses !== undefined) supabaseUpdates.max_uses = updates.maxUses;

    const result = await supabaseDb.updatePromoCode(id, supabaseUpdates);
    return result ? {
      id: result.id,
      code: result.code,
      discountType: result.discount_type,
      discountValue: Number(result.discount_value),
      maxUses: result.max_uses,
      currentUses: result.current_uses,
      validFrom: result.valid_from,
      validUntil: result.valid_until,
      isActive: result.is_active,
      description: result.description,
      createdAt: result.created_at,
      updatedAt: result.updated_at
    } : null;
  }

  async deletePromoCode(id: number): Promise<boolean> {
    return await supabaseDb.deletePromoCode(id);
  }
}

export const db = new DatabaseAdapter();
