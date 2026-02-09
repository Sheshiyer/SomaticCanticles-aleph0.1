# Custom Domain Setup Guide

## Domain: 1319.tryambakam.space

### Option 1: Cloudflare Dashboard (Recommended - Fastest)

1. **Go to Cloudflare Dashboard:**
   https://dash.cloudflare.com

2. **Navigate to:**
   - Account: Sheshnarayan.iyer@gmail.com's Account
   - Pages → somatic-canticles

3. **Add Custom Domain:**
   - Click on **"Custom domains"** tab
   - Click **"Set up a custom domain"**
   - Enter: `1319.tryambakam.space`
   - Click **"Continue"**
   - Cloudflare will automatically add the DNS record
   - Wait for SSL/TLS certificate provisioning (usually 1-2 minutes)

4. **Verify:**
   - Status should show as **"Active"**
   - Test: https://1319.tryambakam.space

### Option 2: Using API (If you have API token)

```bash
# Set your API token
export CLOUDFLARE_API_TOKEN='your-token-here'

# Run the helper script
./scripts/add-custom-domain.sh 1319.tryambakam.space
```

**Get API Token:** https://dash.cloudflare.com/profile/api-tokens
- Required permissions: Zone:Read, Page Rules:Edit, Account:Read

### DNS Configuration (Automatic)

Cloudflare automatically creates this DNS record:
```
Type: CNAME
Name: 1319
Target: somatic-canticles.pages.dev
Proxy: Enabled (orange cloud)
```

### After Domain Setup

1. **Update Pages Environment Variables:**
   Go to Cloudflare Dashboard → Pages → somatic-canticles → Settings → Environment Variables:
   
   ```
   NEXT_PUBLIC_API_URL=https://somatic-canticles-api-prod.sheshnarayan-iyer.workers.dev
   ```
   (Remove NEXTAUTH_SECRET - it's now managed by Workers)

2. **Redeploy Pages:**
   ```bash
   cd /Volumes/madara/2026/Serpentine-raising
   wrangler pages deploy out --project-name somatic-canticles --branch main
   ```

3. **Update Worker CORS (Already Done):**
   The Worker API now accepts requests from:
   - https://1319.tryambakam.space ✓
   - https://somatic-canticles.pages.dev ✓
   - http://localhost:3000 ✓

### Verification Checklist

- [ ] Domain shows as "Active" in Pages dashboard
- [ ] https://1319.tryambakam.space loads the site
- [ ] API calls work (test login or health check)
- [ ] SSL certificate is valid (padlock icon in browser)

### Troubleshooting

**Domain stuck on "Verifying":**
- Check DNS record exists in the zone: dash.cloudflare.com → tryambakam.space → DNS
- Ensure the CNAME points to somatic-canticles.pages.dev

**SSL/TLS errors:**
- Wait 5 minutes for certificate provisioning
- Check SSL/TLS mode is set to "Full (Strict)" in zone settings

**API CORS errors:**
- Worker CORS is already configured for the new domain
- Clear browser cache and try again

### Links

- **Primary Domain:** https://1319.tryambakam.space (after setup)
- **Fallback Domain:** https://somatic-canticles.pages.dev
- **API Endpoint:** https://somatic-canticles-api-prod.sheshnarayan-iyer.workers.dev
