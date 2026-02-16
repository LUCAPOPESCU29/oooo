'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { FileText, Download, Calendar, DollarSign, Users, Star, Loader2 } from 'lucide-react';

export function ReportsExport() {
  const [loading, setLoading] = useState<string | null>(null);

  // Helper function to safely fetch and parse JSON
  const fetchData = async (url: string) => {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch data from ${url}`);
    }
    const text = await response.text();
    try {
      return JSON.parse(text);
    } catch (e) {
      console.error('Invalid JSON response:', text.substring(0, 100));
      throw new Error('Invalid response from server');
    }
  };

  const exportToCSV = async (reportType: string) => {
    setLoading(`${reportType}-csv`);

    try {
      let data: any[] = [];
      let filename = '';
      let headers: string[] = [];

      // Fetch data based on report type
      if (reportType === 'revenue') {
        const bookingsData = await fetchData('/api/bookings');
        const bookings = bookingsData.bookings || [];

        headers = ['Booking Reference', 'Cabin', 'Guest Name', 'Check In', 'Check Out', 'Nights', 'Base Price', 'Cleaning Fee', 'Service Fee', 'Total', 'Status', 'Date'];
        data = bookings
          .filter((b: any) => b.status !== 'cancelled')
          .map((b: any) => [
            b.bookingReference,
            b.cabinName,
            b.guestName,
            b.checkIn,
            b.checkOut,
            b.nights,
            `${b.basePrice} RON`,
            `${b.cleaningFee} RON`,
            `${b.serviceFee} RON`,
            `${b.total} RON`,
            b.status,
            new Date(b.createdAt).toLocaleDateString()
          ]);
        filename = `revenue-report-${new Date().toISOString().split('T')[0]}.csv`;
      } else if (reportType === 'booking') {
        const bookingsData = await fetchData('/api/bookings');
        const bookings = bookingsData.bookings || [];

        headers = ['Booking ID', 'Reference', 'Cabin', 'Guest Name', 'Email', 'Phone', 'Check In', 'Check Out', 'Guests', 'Nights', 'Total', 'Status', 'Payment Status', 'Created'];
        data = bookings.map((b: any) => [
          b.id,
          b.bookingReference,
          b.cabinName,
          b.guestName,
          b.guestEmail,
          b.guestPhone || 'N/A',
          b.checkIn,
          b.checkOut,
          b.guests,
          b.nights,
          `${b.total} RON`,
          b.status,
          b.paymentStatus,
          new Date(b.createdAt).toLocaleDateString()
        ]);
        filename = `bookings-report-${new Date().toISOString().split('T')[0]}.csv`;
      } else if (reportType === 'customer') {
        const customersData = await fetchData('/api/customers');
        const customers = customersData.customers || [];

        headers = ['Email', 'Name', 'Phone', 'Total Bookings', 'Total Spent', 'Average Rating', 'VIP Status', 'Last Booking'];
        data = customers.map((c: any) => [
          c.email,
          c.name,
          c.phone || 'N/A',
          c.totalBookings,
          `${c.totalSpent} RON`,
          c.averageRating || 'N/A',
          c.vipStatus ? 'Yes' : 'No',
          c.lastBooking || 'N/A'
        ]);
        filename = `customers-report-${new Date().toISOString().split('T')[0]}.csv`;
      } else if (reportType === 'reviews') {
        const reviewsData = await fetchData('/api/admin/reviews');
        const reviews = reviewsData.reviews || [];

        headers = ['ID', 'Name', 'Email', 'Cabin', 'Rating', 'Comment', 'Status', 'Date'];
        data = reviews.map((r: any) => [
          r.id,
          r.name,
          r.email,
          r.cabin,
          `${r.rating}/5`,
          r.comment,
          r.status,
          new Date(r.createdAt).toLocaleDateString()
        ]);
        filename = `reviews-report-${new Date().toISOString().split('T')[0]}.csv`;
      }

      // Create CSV content
      const csvContent = [
        headers.join(','),
        ...data.map(row => row.map((cell: any) => {
          // Escape commas and quotes in cell values
          const cellStr = String(cell);
          if (cellStr.includes(',') || cellStr.includes('"') || cellStr.includes('\n')) {
            return `"${cellStr.replace(/"/g, '""')}"`;
          }
          return cellStr;
        }).join(','))
      ].join('\n');

      // Download CSV
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = filename;
      link.click();
      URL.revokeObjectURL(link.href);
    } catch (error) {
      console.error('Export error:', error);
      alert('Failed to export report. Please try again.');
    } finally {
      setLoading(null);
    }
  };

  const exportToPDF = async (reportType: string) => {
    setLoading(`${reportType}-pdf`);

    try {
      let data: any[] = [];
      let title = '';
      let headers: string[] = [];

      // Fetch data based on report type
      if (reportType === 'revenue') {
        const bookingsData = await fetchData('/api/bookings');
        const bookings = bookingsData.bookings || [];

        title = 'Revenue Report';
        headers = ['Booking Ref', 'Cabin', 'Guest', 'Dates', 'Total', 'Status'];
        data = bookings
          .filter((b: any) => b.status !== 'cancelled')
          .map((b: any) => [
            b.bookingReference,
            b.cabinName,
            b.guestName,
            `${new Date(b.checkIn).toLocaleDateString()} - ${new Date(b.checkOut).toLocaleDateString()}`,
            `${b.total} RON`,
            b.status
          ]);
      } else if (reportType === 'booking') {
        const bookingsData = await fetchData('/api/bookings');
        const bookings = bookingsData.bookings || [];

        title = 'Booking Report';
        headers = ['Reference', 'Cabin', 'Guest', 'Email', 'Check In', 'Total', 'Status'];
        data = bookings.map((b: any) => [
          b.bookingReference,
          b.cabinName,
          b.guestName,
          b.guestEmail,
          new Date(b.checkIn).toLocaleDateString(),
          `${b.total} RON`,
          b.status
        ]);
      } else if (reportType === 'customer') {
        const customersData = await fetchData('/api/customers');
        const customers = customersData.customers || [];

        title = 'Customer Report';
        headers = ['Name', 'Email', 'Bookings', 'Total Spent', 'VIP'];
        data = customers.map((c: any) => [
          c.name,
          c.email,
          c.totalBookings,
          `${c.totalSpent} RON`,
          c.vipStatus ? 'Yes' : 'No'
        ]);
      } else if (reportType === 'reviews') {
        const reviewsData = await fetchData('/api/admin/reviews');
        const reviews = reviewsData.reviews || [];

        title = 'Reviews Report';
        headers = ['Name', 'Cabin', 'Rating', 'Comment', 'Date'];
        data = reviews.map((r: any) => [
          r.name,
          r.cabin,
          `${r.rating}/5`,
          r.comment.substring(0, 50) + (r.comment.length > 50 ? '...' : ''),
          new Date(r.createdAt).toLocaleDateString()
        ]);
      }

      // Create simple HTML for PDF
      const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>${title}</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      padding: 40px;
      background: white;
    }
    h1 {
      color: #2c5530;
      margin-bottom: 10px;
    }
    .meta {
      color: #666;
      margin-bottom: 30px;
      font-size: 14px;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 20px;
    }
    th {
      background: #2c5530;
      color: white;
      padding: 12px;
      text-align: left;
      font-weight: 600;
    }
    td {
      padding: 10px 12px;
      border-bottom: 1px solid #e5e7eb;
    }
    tr:nth-child(even) {
      background: #f9fafb;
    }
    .footer {
      margin-top: 40px;
      padding-top: 20px;
      border-top: 2px solid #e5e7eb;
      text-align: center;
      color: #666;
      font-size: 12px;
    }
    .summary {
      background: #f0f9f4;
      padding: 15px;
      border-radius: 8px;
      margin-bottom: 20px;
    }
  </style>
</head>
<body>
  <h1>${title}</h1>
  <div class="meta">
    Generated: ${new Date().toLocaleString()}<br>
    Total Records: ${data.length}
  </div>

  ${reportType === 'revenue' ? `
  <div class="summary">
    <strong>Total Revenue:</strong> ${data.reduce((sum, row) => {
      const amount = parseFloat(row[4].replace(' RON', ''));
      return sum + amount;
    }, 0).toFixed(2)} RON
  </div>
  ` : ''}

  <table>
    <thead>
      <tr>
        ${headers.map(h => `<th>${h}</th>`).join('')}
      </tr>
    </thead>
    <tbody>
      ${data.map(row => `
        <tr>
          ${row.map((cell: any) => `<td>${cell}</td>`).join('')}
        </tr>
      `).join('')}
    </tbody>
  </table>

  <div class="footer">
    A-Frame Cabins - Admin Report<br>
    Confidential - For Internal Use Only
  </div>
</body>
</html>
      `;

      // Create a blob and download as HTML (user can open and print as PDF)
      const blob = new Blob([htmlContent], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${reportType}-report-${new Date().toISOString().split('T')[0]}.html`;
      link.click();
      URL.revokeObjectURL(url);

      // Also try to open in new tab for immediate print
      try {
        const printWindow = window.open('', '_blank');
        if (printWindow) {
          printWindow.document.write(htmlContent);
          printWindow.document.close();

          setTimeout(() => {
            printWindow.print();
          }, 500);
        }
      } catch (e) {
        // If popup blocked, the HTML file will still download
        console.log('Popup blocked, HTML file downloaded instead');
      }
    } catch (error) {
      console.error('PDF export error:', error);
      alert('Failed to export PDF. Please try again.');
    } finally {
      setLoading(null);
    }
  };

  const reports = [
    {
      id: 'revenue',
      name: 'Revenue Report',
      description: 'Complete revenue breakdown by cabin and time period',
      icon: DollarSign,
      color: 'from-green-500 to-green-600',
    },
    {
      id: 'booking',
      name: 'Booking Report',
      description: 'All bookings with guest details and status',
      icon: Calendar,
      color: 'from-blue-500 to-blue-600',
    },
    {
      id: 'customer',
      name: 'Customer Report',
      description: 'Customer database with spending and activity',
      icon: Users,
      color: 'from-purple-500 to-purple-600',
    },
    {
      id: 'reviews',
      name: 'Reviews Report',
      description: 'All reviews and ratings analytics',
      icon: Star,
      color: 'from-yellow-500 to-yellow-600',
    },
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
        <FileText className="text-indigo-600" size={28} />
        Reports & Export
      </h2>

      <div className="grid md:grid-cols-2 gap-6">
        {reports.map((report, index) => {
          const Icon = report.icon;
          const isLoadingCSV = loading === `${report.id}-csv`;
          const isLoadingPDF = loading === `${report.id}-pdf`;

          return (
            <motion.div
              key={report.name}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all"
            >
              <div className={`w-16 h-16 rounded-lg bg-gradient-to-br ${report.color} flex items-center justify-center text-white mb-4`}>
                <Icon size={32} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">{report.name}</h3>
              <p className="text-gray-600 mb-4">{report.description}</p>
              <div className="flex gap-2">
                <button
                  onClick={() => exportToCSV(report.id)}
                  disabled={!!loading}
                  className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoadingCSV ? (
                    <Loader2 size={18} className="animate-spin" />
                  ) : (
                    <Download size={18} />
                  )}
                  Export CSV
                </button>
                <button
                  onClick={() => exportToPDF(report.id)}
                  disabled={!!loading}
                  className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  title="Download HTML report (can be printed to PDF)"
                >
                  {isLoadingPDF ? (
                    <Loader2 size={18} className="animate-spin" />
                  ) : (
                    <Download size={18} />
                  )}
                  Export PDF
                </button>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
