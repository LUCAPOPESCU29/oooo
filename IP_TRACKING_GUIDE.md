# 🔍 IP Address Tracking System

## Overview

The cabin booking website now tracks the IP address of every visitor that enters the site. This helps with analytics, security, and understanding user behavior.

---

## 📊 What Gets Tracked

### Visitor Information
- **IP Address** - IPv4 or IPv6 address
- **User Agent** - Browser and device information
- **Referrer** - Where the visitor came from
- **Page URL** - Current page being visited
- **Visit Count** - How many times this IP has visited
- **First Visit** - When they first visited
- **Last Visit** - Most recent visit timestamp

### Booking Information
- **IP Address** - Stored with each booking for security

---

## 🗄️ Database Schema

### Visitor Logs Table
```sql
CREATE TABLE visitor_logs (
  id SERIAL PRIMARY KEY,
  ip_address VARCHAR(45) NOT NULL,
  user_agent TEXT,
  referrer TEXT,
  page_url TEXT,
  country VARCHAR(100),
  city VARCHAR(100),
  visit_count INTEGER DEFAULT 1,
  first_visit TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  last_visit TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Bookings Table Update
```sql
ALTER TABLE bookings ADD COLUMN ip_address VARCHAR(45);
```

---

## 🔧 How It Works

### 1. Automatic Visitor Tracking

**Component:** `VisitorTracker.tsx`
- Automatically loaded on every page
- Runs when user visits any page
- Sends IP and tracking data to API

**API Endpoint:** `/api/track-visitor`
- Receives visitor data
- Checks if IP exists in database
- Updates visit count or creates new entry

### 2. Booking IP Tracking

**API Endpoint:** `/api/booking`
- Captures IP address when booking is made
- Stores IP with booking record
- Helps prevent fraud and identify malicious users

---

## 📁 Files Modified

### New Files Created

1. **`/lib/db/migrations/add_visitor_tracking.sql`**
   - Database migration script
   - Creates `visitor_logs` table
   - Adds `ip_address` column to bookings

2. **`/app/api/track-visitor/route.ts`**
   - API endpoint for tracking visitors
   - Handles IP extraction and storage
   - Updates or creates visitor records

3. **`/components/VisitorTracker.tsx`**
   - Client-side tracking component
   - Automatically tracks page visits
   - Sends data to API

### Modified Files

1. **`/app/layout.tsx`**
   - Added `<VisitorTracker />` component
   - Tracks visitors on all pages

2. **`/app/api/booking/route.ts`**
   - Extracts IP from request headers
   - Stores IP with booking data

3. **`/lib/db/index.ts`**
   - Added `ipAddress` field to `Booking` interface
   - Updated conversion functions

---

## 🚀 Setup Instructions

### 1. Run Database Migration

Execute the SQL migration script in your Supabase dashboard:

```bash
# File: /lib/db/migrations/add_visitor_tracking.sql
```

Go to Supabase → SQL Editor → Paste the migration → Run

### 2. Verify Tables Created

Check that these tables exist:
- `visitor_logs` - New table for tracking
- `bookings` - Should have new `ip_address` column

### 3. Test the Tracking

1. Visit the website
2. Check Supabase → Table Editor → `visitor_logs`
3. You should see your visit logged with IP address

---

## 🔒 Privacy & Security

### IP Address Handling
- **Stored securely** in Supabase database
- **Not displayed** to regular users
- **Admin only access** to view IPs

### Compliance Considerations
- ⚠️ **GDPR**: IP addresses are personal data - add privacy policy
- ⚠️ **CCPA**: California users have rights to know what's collected
- ⚠️ **User consent**: Consider adding cookie/tracking consent banner

### Recommended Actions
1. **Add Privacy Policy** - Explain what data is collected
2. **Cookie Consent Banner** - Let users opt out
3. **Data Retention Policy** - Delete old visitor logs after X days
4. **Anonymization** - Consider hashing IPs for analytics

---

## 📈 Analytics Use Cases

### What You Can Track

1. **Unique Visitors** - Count distinct IP addresses
2. **Return Visitors** - Check `visit_count > 1`
3. **Popular Pages** - Most visited `page_url`
4. **Traffic Sources** - Analyze `referrer` data
5. **Geographic Data** - Use IP geolocation (needs additional setup)

### Example Queries

**Total Unique Visitors:**
```sql
SELECT COUNT(DISTINCT ip_address) FROM visitor_logs;
```

**Repeat Visitors:**
```sql
SELECT ip_address, visit_count
FROM visitor_logs
WHERE visit_count > 1
ORDER BY visit_count DESC;
```

**Most Popular Pages:**
```sql
SELECT page_url, COUNT(*) as visits
FROM visitor_logs
GROUP BY page_url
ORDER BY visits DESC;
```

**Booking Fraud Detection:**
```sql
SELECT ip_address, COUNT(*) as booking_count
FROM bookings
WHERE created_at > NOW() - INTERVAL '7 days'
GROUP BY ip_address
HAVING COUNT(*) > 3;
```

---

## 🛡️ Security Features

### Fraud Prevention

1. **Multiple Bookings Detection**
   - Track IPs making excessive bookings
   - Flag suspicious patterns

2. **Rate Limiting**
   - Can implement IP-based rate limiting
   - Prevent spam and abuse

3. **Geographic Restrictions**
   - Block specific countries if needed
   - Identify proxy/VPN usage

---

## 🌍 IP Geolocation (Optional Enhancement)

To add country/city tracking, you can use services like:

**Free Options:**
- [ipapi.co](https://ipapi.co/) - 1,000 requests/day free
- [ip-api.com](http://ip-api.com/) - Unlimited for non-commercial

**Example Implementation:**
```typescript
// In /app/api/track-visitor/route.ts
const geoResponse = await fetch(`https://ipapi.co/${ip}/json/`);
const geoData = await geoResponse.json();

await supabase.from('visitor_logs').insert({
  ip_address: ip,
  country: geoData.country_name,
  city: geoData.city,
  // ... other fields
});
```

---

## 📊 Admin Dashboard Ideas

### Visitor Statistics Page

Create `/admin/analytics` to show:
- Total visitors (today, week, month)
- Unique vs returning visitors
- Top pages visited
- Geographic distribution (if geolocation added)
- Recent visitors list

### Booking Analytics

Show in `/admin/bookings`:
- IP address for each booking
- Flag multiple bookings from same IP
- Suspicious activity alerts

---

## 🐛 Troubleshooting

### IP Shows as "unknown"

**Cause:** Headers not passed correctly

**Solution:** Make sure your hosting platform forwards IP headers:
- Vercel: Automatically handled
- Netlify: Enable in config
- Custom server: Configure reverse proxy

### Visitor not tracked

**Check:**
1. Database table exists (`visitor_logs`)
2. API endpoint works (`/api/track-visitor`)
3. Component is loaded (`VisitorTracker`)
4. No console errors in browser

### Booking IP not saved

**Check:**
1. `bookings` table has `ip_address` column
2. Migration was run successfully
3. Check Supabase logs for errors

---

## 🎯 Next Steps

### Recommended Enhancements

1. **Add Cookie Consent Banner**
   ```bash
   npm install react-cookie-consent
   ```

2. **Implement IP Geolocation**
   - Add country/city tracking
   - Show visitor map in admin

3. **Add Privacy Policy Page**
   - Explain what data is collected
   - How it's used and stored
   - User rights (GDPR/CCPA)

4. **Rate Limiting**
   - Prevent abuse
   - Block suspicious IPs

5. **Admin Analytics Dashboard**
   - Visitor charts and graphs
   - Real-time tracking
   - Export data as CSV

---

## ✅ Summary

**What was added:**
- ✅ `visitor_logs` table for tracking all visitors
- ✅ `ip_address` column in bookings table
- ✅ API endpoint `/api/track-visitor`
- ✅ `VisitorTracker` component on all pages
- ✅ IP extraction in booking API

**What gets tracked:**
- ✅ Every page visit with IP, user agent, referrer
- ✅ Visit count for returning visitors
- ✅ IP address with every booking

**Benefits:**
- 📊 Better analytics and insights
- 🛡️ Fraud prevention and security
- 📈 Understand user behavior
- 🎯 Identify popular content

---

**⚠️ Important:** Remember to add a privacy policy and comply with local data protection laws!
