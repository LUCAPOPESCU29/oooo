// Supabase database implementation
import { supabaseAdmin } from '@/lib/supabase/client';

export interface Booking {
  id: number;
  booking_reference: string;
  cabin_id: string;
  cabin_name: string;
  guest_name: string;
  guest_email: string;
  guest_phone?: string;
  check_in: string;
  check_out: string;
  guests: number;
  nights: number;
  base_price: number;
  cleaning_fee: number;
  service_fee: number;
  total: number;
  status: 'pending' | 'confirmed' | 'cancelled';
  payment_status: 'pending' | 'paid' | 'refunded';
  language: 'en' | 'ro';
  special_requests?: string;
  created_at: string;
  updated_at: string;
}

export interface Review {
  id: number;
  name: string;
  email: string;
  cabin: string;
  rating: number;
  comment: string;
  status: 'approved' | 'pending' | 'rejected';
  created_at: string;
  updated_at: string;
}

export interface MaintenanceIssue {
  id: number;
  cabin: string;
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'pending' | 'in-progress' | 'completed';
  reported_by: string;
  reported_by_email: string;
  assigned_to?: string;
  due_date?: string;
  created_at: string;
  updated_at: string;
}

class SupabaseDatabase {
  private static instance: SupabaseDatabase;

  private constructor() {}

  static getInstance(): SupabaseDatabase {
    if (!SupabaseDatabase.instance) {
      SupabaseDatabase.instance = new SupabaseDatabase();
    }
    return SupabaseDatabase.instance;
  }

  // Bookings
  async getAllBookings(): Promise<Booking[]> {
    const { data, error } = await supabaseAdmin
      .from('bookings')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching bookings:', error);
      return [];
    }

    return data || [];
  }

  async getBookingById(id: number): Promise<Booking | null> {
    const { data, error } = await supabaseAdmin
      .from('bookings')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching booking:', error);
      return null;
    }

    return data;
  }

  async getBookingByReference(reference: string): Promise<Booking | null> {
    const { data, error} = await supabaseAdmin
      .from('bookings')
      .select('*')
      .eq('booking_reference', reference)
      .single();

    if (error) {
      console.error('Error fetching booking by reference:', error);
      return null;
    }

    return data;
  }

  async getUserBookings(email: string): Promise<Booking[]> {
    const { data, error } = await supabaseAdmin
      .from('bookings')
      .select('*')
      .eq('guest_email', email.toLowerCase())
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching user bookings:', error);
      return [];
    }

    return data || [];
  }

  async createBooking(booking: Omit<Booking, 'id' | 'created_at' | 'updated_at'>): Promise<Booking | null> {
    const { data, error } = await supabaseAdmin
      .from('bookings')
      .insert([booking])
      .select()
      .single();

    if (error) {
      console.error('Error creating booking:', error);
      return null;
    }

    return data;
  }

  async updateBooking(id: number, updates: Partial<Booking>): Promise<Booking | null> {
    const { data, error } = await supabaseAdmin
      .from('bookings')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating booking:', error);
      return null;
    }

    return data;
  }

  async deleteBooking(id: number): Promise<boolean> {
    const { error } = await supabaseAdmin
      .from('bookings')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting booking:', error);
      return false;
    }

    return true;
  }

  // Reviews
  async getAllReviews(): Promise<Review[]> {
    const { data, error } = await supabaseAdmin
      .from('reviews')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching reviews:', error);
      return [];
    }

    return data || [];
  }

  async getReviewById(id: number): Promise<Review | null> {
    const { data, error } = await supabaseAdmin
      .from('reviews')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching review:', error);
      return null;
    }

    return data;
  }

  async createReview(review: Omit<Review, 'id' | 'created_at' | 'updated_at'>): Promise<Review | null> {
    const { data, error } = await supabaseAdmin
      .from('reviews')
      .insert([review])
      .select()
      .single();

    if (error) {
      console.error('Error creating review:', error);
      return null;
    }

    return data;
  }

  async updateReview(id: number, updates: Partial<Review>): Promise<Review | null> {
    const { data, error } = await supabaseAdmin
      .from('reviews')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating review:', error);
      return null;
    }

    return data;
  }

  async deleteReview(id: number): Promise<boolean> {
    const { error } = await supabaseAdmin
      .from('reviews')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting review:', error);
      return false;
    }

    return true;
  }

  // Statistics
  async getStatistics() {
    const bookings = await this.getAllBookings();
    const reviews = await this.getAllReviews();

    const totalBookings = bookings.length;
    const confirmedBookings = bookings.filter(b => b.status === 'confirmed').length;
    const pendingBookings = bookings.filter(b => b.status === 'pending').length;
    const cancelledBookings = bookings.filter(b => b.status === 'cancelled').length;

    const totalRevenue = bookings
      .filter(b => b.status !== 'cancelled')
      .reduce((sum, b) => sum + Number(b.total), 0);

    const averageRating = reviews.length > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      : 0;

    const cabinBookings = bookings.reduce((acc, b) => {
      acc[b.cabin_name] = (acc[b.cabin_name] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      totalBookings,
      confirmedBookings,
      pendingBookings,
      cancelledBookings,
      totalRevenue,
      totalReviews: reviews.length,
      averageRating: Math.round(averageRating * 10) / 10,
      cabinBookings
    };
  }

  // Maintenance Issues
  async getAllMaintenanceIssues(): Promise<MaintenanceIssue[]> {
    const { data, error } = await supabaseAdmin
      .from('maintenance_issues')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching maintenance issues:', error);
      return [];
    }

    return data || [];
  }

  async createMaintenanceIssue(issue: Omit<MaintenanceIssue, 'id' | 'created_at' | 'updated_at'>): Promise<MaintenanceIssue | null> {
    const { data, error } = await supabaseAdmin
      .from('maintenance_issues')
      .insert([issue])
      .select()
      .single();

    if (error) {
      console.error('Error creating maintenance issue:', error);
      return null;
    }

    return data;
  }

  async updateMaintenanceIssue(id: number, updates: Partial<MaintenanceIssue>): Promise<MaintenanceIssue | null> {
    const { data, error } = await supabaseAdmin
      .from('maintenance_issues')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating maintenance issue:', error);
      return null;
    }

    return data;
  }

  // Promo Codes
  async getAllPromoCodes(): Promise<any[]> {
    const { data, error } = await supabaseAdmin
      .from('promo_codes')
      .select('*')
      .order('created_at', { ascending: false});

    if (error) {
      console.error('Error fetching promo codes:', error);
      return [];
    }

    return data || [];
  }

  async getPromoCodeByCode(code: string): Promise<any | null> {
    const { data, error } = await supabaseAdmin
      .from('promo_codes')
      .select('*')
      .eq('code', code.toUpperCase())
      .single();

    if (error) {
      console.error('Error fetching promo code:', error);
      return null;
    }

    return data;
  }

  async createPromoCode(promoCode: any): Promise<any | null> {
    const { data, error } = await supabaseAdmin
      .from('promo_codes')
      .insert([promoCode])
      .select()
      .single();

    if (error) {
      console.error('Error creating promo code:', error);
      return null;
    }

    return data;
  }

  async updatePromoCode(id: number, updates: any): Promise<any | null> {
    const { data, error } = await supabaseAdmin
      .from('promo_codes')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating promo code:', error);
      return null;
    }

    return data;
  }

  async deletePromoCode(id: number): Promise<boolean> {
    const { error } = await supabaseAdmin
      .from('promo_codes')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting promo code:', error);
      return false;
    }

    return true;
  }
}

export const supabaseDb = SupabaseDatabase.getInstance();
