# 📱 Access Your Site on Mobile

Three ways to access your A-Frame Cabin Booking site on your phone!

## 🔥 Method 1: Local Network (Fastest - Same WiFi)

### Step 1: Start the mobile-friendly dev server

Stop your current dev server (Ctrl+C) and run:

```bash
npm run dev:mobile
```

### Step 2: Get your local IP address

Your computer's local IP is: **`192.168.1.4`**

### Step 3: Access from your phone

1. **Make sure your phone is on the SAME WiFi network** as your computer
2. Open Safari (iOS) or Chrome (Android)
3. Go to: **`http://192.168.1.4:3000`**
4. ✅ Your site should load!

### Test Biometric Authentication on iPhone

If you have an iPhone with Face ID or Touch ID:
1. Sign in at `http://192.168.1.4:3000/signin`
2. Go to Settings → Privacy & Security
3. Enable "Biometric Login"
4. Your iPhone will prompt for Face ID/Touch ID
5. Sign out and try "Sign in with Face ID" button!

---

## 🌐 Method 2: ngrok (Public URL - Works Anywhere)

Perfect for testing from anywhere, sharing with friends, or testing on cellular data.

### Step 1: Install ngrok

```bash
# macOS
brew install ngrok

# Or download from https://ngrok.com/download
```

### Step 2: Start your dev server (if not running)

```bash
npm run dev
```

### Step 3: Create ngrok tunnel

In a NEW terminal:

```bash
ngrok http 3000
```

### Step 4: Use the public URL

ngrok will show something like:

```
Forwarding    https://abc123.ngrok.io -> http://localhost:3000
```

Use that URL on your phone: `https://abc123.ngrok.io`

**Pros:**
- ✅ Works from anywhere (cellular data)
- ✅ Can share with others
- ✅ HTTPS (required for biometric auth on some browsers)
- ✅ No WiFi needed

**Cons:**
- ⚠️ Requires ngrok installation
- ⚠️ URL changes each time (unless paid plan)

---

## ☁️ Method 3: Deploy to Vercel (Production)

For permanent mobile access and best performance.

### Step 1: Install Vercel CLI

```bash
npm i -g vercel
```

### Step 2: Deploy

```bash
cd /Users/lucapopescu/Downloads/azuga/aframe-cabin-booking
vercel
```

Follow the prompts:
- Set up and deploy? **Y**
- Which scope? (Select your account)
- Link to existing project? **N**
- Project name? **aframe-cabin-booking**
- Directory? **./** (press Enter)
- Override settings? **N**

### Step 3: Access from anywhere

Vercel will give you a URL like:
```
https://aframe-cabin-booking.vercel.app
```

Access from your phone, anywhere in the world!

**Pros:**
- ✅ Fast global CDN
- ✅ Free HTTPS
- ✅ Auto-deploys on git push
- ✅ Perfect for production testing
- ✅ Share with anyone

**Cons:**
- ⚠️ Takes 1-2 minutes to deploy
- ⚠️ Need to redeploy for changes

---

## 📋 Quick Comparison

| Method | Speed | Setup | Use Case |
|--------|-------|-------|----------|
| **Local Network** | ⚡⚡⚡ Instant | 30 seconds | Same WiFi testing |
| **ngrok** | ⚡⚡ Fast | 2 minutes | Testing anywhere |
| **Vercel** | ⚡ Production | 5 minutes | Production/sharing |

---

## 🎯 Recommended Approach

### For Quick Testing (Right Now)

1. Run `npm run dev:mobile`
2. Open `http://192.168.1.4:3000` on your phone
3. Test away! ✅

### For Comprehensive Testing

1. Use **Local Network** for quick iterations
2. Use **ngrok** to test on cellular data
3. Use **Vercel** when ready to share

---

## 🧪 Testing Checklist for Mobile

Once you access on your phone, test these features:

### Touch ID / Face ID
- [ ] Enable biometric in Settings
- [ ] Sign out
- [ ] Sign in with Face ID/Touch ID button
- [ ] Should authenticate instantly

### Performance
- [ ] Check page load speed
- [ ] Scroll smoothness (should be 60 FPS)
- [ ] Animation responsiveness
- [ ] Image loading

### Dark Mode
- [ ] Enable dark mode in Settings
- [ ] Check glassmorphism effects
- [ ] Floating orbs (should be hidden on mobile)
- [ ] Text readability

### Responsive Design
- [ ] Navigation menu
- [ ] Cabin cards layout
- [ ] Booking form
- [ ] Settings page
- [ ] Profile dropdown

### Features
- [ ] Book a cabin
- [ ] View booking confirmation
- [ ] Check My Bookings page
- [ ] Adjust settings
- [ ] Language switching (EN/RO)

---

## 🔒 Security Note

**Local Network Method:**
- ⚠️ Only accessible on your WiFi
- ⚠️ Not HTTPS (biometric may not work in all browsers)
- ✅ Most secure (not exposed to internet)

**ngrok Method:**
- ⚠️ Creates public URL (anyone with link can access)
- ✅ HTTPS enabled (biometric works everywhere)
- ⚠️ Close tunnel when done testing

**Vercel Method:**
- ✅ HTTPS
- ✅ Professional deployment
- ⚠️ Public URL

---

## 💡 Pro Tips

1. **iOS Safari**: Best for testing biometric authentication
2. **Chrome DevTools**: Use remote debugging for console logs
3. **Network Tab**: Check performance metrics
4. **Lighthouse**: Run mobile performance audit

### Enable Remote Debugging (iOS)

On Mac:
1. Connect iPhone via cable
2. Open Safari → Develop → [Your iPhone] → localhost
3. See console logs and debug!

### Enable Remote Debugging (Android)

On Computer:
1. Connect Android via cable
2. Open Chrome → `chrome://inspect`
3. Click "Inspect" next to your phone
4. See console logs and debug!

---

## 🚀 Start Testing Now!

**Easiest way (30 seconds):**

```bash
# In your terminal
npm run dev:mobile
```

Then on your phone:
```
http://192.168.1.4:3000
```

**That's it! You're now testing on mobile!** 📱✨

---

## 🆘 Troubleshooting

### "Site can't be reached"
- ✅ Check both devices on same WiFi
- ✅ Verify IP: `ifconfig | grep "inet "`
- ✅ Check firewall settings
- ✅ Try turning WiFi off and on

### "Biometric auth not working"
- ✅ Use HTTPS (ngrok or Vercel)
- ✅ Check browser supports WebAuthn
- ✅ Enable in Settings first

### "Page loads slowly"
- ✅ Use performance optimizations (already added!)
- ✅ Check WiFi signal strength
- ✅ Try ngrok for better speed

### "Images not loading"
- ✅ Wait a few seconds (lazy loading)
- ✅ Check console for errors
- ✅ Verify Unsplash URLs are accessible

---

## 📚 Additional Resources

- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [Vercel Docs](https://vercel.com/docs)
- [ngrok Docs](https://ngrok.com/docs)
- [WebAuthn on iOS](https://webkit.org/blog/11312/meet-face-id-and-touch-id-for-the-web/)

---

**Happy mobile testing! 🎉📱**

Your A-Frame Cabin Booking site is optimized for mobile and ready to test!
