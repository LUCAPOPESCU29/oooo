# 📱 Quick Mobile Access (30 Seconds)

## Step 1: Start Mobile Server

Stop your current dev server (Ctrl+C in terminal) and run:

```bash
npm run dev:mobile
```

## Step 2: Access on Your Phone

1. **Make sure your phone is on the SAME WiFi** as your Mac
2. **Open Safari or Chrome** on your phone
3. **Go to this URL:**

```
http://192.168.1.4:3000
```

## ✅ Done!

Your site should load on your phone!

---

## 🧪 Test Biometric Auth (iPhone/Android)

1. Sign in: `admin@aframecabins.com` / `admin123`
2. Go to **Settings** → **Privacy & Security**
3. Toggle **"Biometric Login"** ON
4. Your phone will prompt for Face ID/Touch ID/Fingerprint
5. Sign out
6. Click **"Sign in with Touch ID"** button
7. Authenticate → Instant login! ✨

---

## 🆘 Not Working?

### Try This:
1. ✅ Both devices on **same WiFi**?
2. ✅ Used `npm run dev:mobile` (not `npm run dev`)?
3. ✅ Typed IP correctly: `192.168.1.4:3000`?

### Still Not Working?

**Get your actual IP address:**

```bash
ifconfig | grep "inet " | grep -v 127.0.0.1
```

Use that IP instead of `192.168.1.4`

---

## 🌐 Alternative: Use ngrok (Works Anywhere)

If WiFi doesn't work, use ngrok for a public URL:

```bash
# Install ngrok
brew install ngrok

# In a new terminal (keep dev server running)
ngrok http 3000
```

Use the `https://` URL ngrok gives you on your phone.

---

**That's it! Enjoy testing on mobile!** 🚀
