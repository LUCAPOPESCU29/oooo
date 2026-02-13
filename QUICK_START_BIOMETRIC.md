# 🚀 Quick Start: Biometric Authentication

## Test It Right Now! (3 Steps)

### Step 1: Enable Biometric Login
1. Open http://localhost:3000
2. Sign in (email: `admin@aframecabins.com`, password: `admin123`)
3. Click profile icon → **Settings**
4. Go to **Privacy & Security** tab
5. Toggle **Biometric Login** ON
6. Your Mac/iPhone/Windows will prompt you to authenticate
7. ✅ Done! Biometric enabled

### Step 2: Sign Out
1. Click profile icon → **Sign Out**

### Step 3: Sign In with Biometric
1. Go to **Sign In** page
2. You'll see a new button: **"Sign in with Touch ID"** (or Face ID/Windows Hello)
3. Click it
4. Authenticate with your fingerprint/face
5. ✅ You're instantly signed in!

## What You'll See

### Settings Page
```
Privacy & Security
┌─────────────────────────────────────┐
│ Biometric Login                     │
│ Touch ID / Face ID           [ON ✓] │ ← Toggle this!
└─────────────────────────────────────┘
```

### Sign In Page (After Enabling)
```
┌──────────────────────────────┐
│ Email: [____________]        │
│ Password: [____________]     │
│ [        Sign In       ]     │
├──────────────────────────────┤
│    Or continue with          │
│ [🔓 Sign in with Touch ID]   │ ← This appears!
└──────────────────────────────┘
```

## Device Support Check

**Will it work on your device?**

✅ **YES** if you have:
- MacBook with Touch ID (2016+)
- iPhone/iPad with Face ID or Touch ID
- Windows PC with Windows Hello
- Android phone with fingerprint sensor

❌ **NO** if:
- Desktop without biometric hardware
- Old device without Touch ID/Face ID
- Browser doesn't support WebAuthn (very old browsers)

If not supported, the option simply won't appear (graceful degradation).

## Troubleshooting

**"Biometric Login" toggle doesn't appear?**
- Your device doesn't have biometric hardware
- Browser doesn't support WebAuthn
- This is expected behavior - it auto-hides

**"Sign in with Touch ID" button doesn't appear on sign-in page?**
- You haven't enabled it in Settings yet
- Go to Settings → Privacy & Security → Toggle ON first

**Authentication fails?**
- Make sure you're using the same device where you registered
- Try disabling and re-enabling in Settings
- Check browser console for errors

**Want to disable it?**
- Go to Settings → Privacy & Security
- Toggle "Biometric Login" OFF
- Credential is removed from device

## Security Notes

✅ **Your biometric data never leaves your device**
✅ **Private key stored in secure enclave (Touch ID Secure Enclave/TPM)**
✅ **Public key cryptography ensures security**
✅ **Password login still works as fallback**

## Next Steps

After testing, you can:
1. **Create new account** and enable biometric
2. **Try on different devices** (iPhone, Windows PC, etc.)
3. **Check the guide** - See `BIOMETRIC_AUTH_GUIDE.md` for full documentation

---

**That's it! Enjoy passwordless authentication! 🎉**
