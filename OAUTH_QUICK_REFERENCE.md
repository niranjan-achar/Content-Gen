# 🚀 Quick OAuth Setup Reference

## Google OAuth - Quick Steps

### 1. Google Cloud Console
```
https://console.cloud.google.com/
→ Create New Project: "ContentGen"
→ APIs & Services → OAuth consent screen → External
→ APIs & Services → Credentials → Create OAuth Client ID
```

### 2. Authorized Origins
```
http://localhost:5173
https://hhawezsgcbosghieqduz.supabase.co
```

### 3. Redirect URIs
```
https://hhawezsgcbosghieqduz.supabase.co/auth/v1/callback
http://localhost:5173/auth/callback
```

### 4. Copy Credentials
- Client ID: `123456789-abc...xyz.apps.googleusercontent.com`
- Client Secret: `GOCSPX-...`

### 5. Paste in Supabase
```
Supabase Dashboard
→ Authentication → Providers → Google
→ Enable + Paste Client ID + Secret
→ Save
```

---

## GitHub OAuth - Quick Steps

### 1. GitHub Settings
```
https://github.com/settings/developers
→ New OAuth App
```

### 2. App Configuration
```
Name: ContentGen
Homepage: http://localhost:5173
Callback: https://hhawezsgcbosghieqduz.supabase.co/auth/v1/callback
```

### 3. Copy Credentials
- Client ID: `Iv1...`
- Client Secret: `Generate new` → copy

### 4. Paste in Supabase
```
Supabase Dashboard
→ Authentication → Providers → GitHub
→ Enable + Paste Client ID + Secret
→ Save
```

---

## Supabase URLs Configuration

### Navigation
```
Supabase Dashboard
→ Authentication → URL Configuration
```

### Site URL
```
http://localhost:5173
```

### Redirect URLs (add both)
```
http://localhost:5173
http://localhost:5173/auth/callback
```

---

## Test Checklist

- [ ] Start backend: `cd backend && poetry run uvicorn backend.main:app --port 8000`
- [ ] Start frontend: `cd frontend && npm run dev`
- [ ] Visit: `http://localhost:5173`
- [ ] Click "Sign In" button
- [ ] Try "Continue with Google" - should redirect to Google
- [ ] Complete OAuth flow - should redirect back to dashboard
- [ ] See profile picture in header
- [ ] Click "Sign Out" - should clear session

---

## Important URLs

| Service | URL |
|---------|-----|
| Google Cloud Console | https://console.cloud.google.com/ |
| GitHub OAuth Apps | https://github.com/settings/developers |
| Supabase Dashboard | https://app.supabase.com/ |
| Your Frontend | http://localhost:5173 |
| Your Backend | http://localhost:8000 |
| API Docs | http://localhost:8000/docs |

---

## Common Issues

### "redirect_uri_mismatch"
→ Check Google Cloud Console URIs match exactly

### "The redirect_uri MUST match..."
→ Check GitHub OAuth App callback URL

### User not showing in header
→ Check browser console for errors
→ Verify `.env` has correct Supabase keys

### CORS errors
→ Ensure backend allows `http://localhost:5173` origin

---

## Need More Help?
See full guide: `OAUTH_SETUP_GUIDE.md`
