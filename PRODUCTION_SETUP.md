# Frontend Production Environment Setup

## Environment Variables Configuration

All frontend environment variables must be prefixed with `VITE_` for Vite to expose them to the browser.

### 🚀 Deployment Instructions

#### 1. Copy Template File
```bash
cp .env.production.template .env.production
```

#### 2. Fill in Production Values
Edit `.env.production` with your actual production values:

```bash
# API Configuration
VITE_API_URL=https://api.pandijiautoconnect.com/api

# Cloudinary Configuration  
VITE_CLOUDINARY_CLOUD_NAME=your-cloud-name
VITE_CLOUDINARY_API_KEY=your-api-key
VITE_CLOUDINARY_UPLOAD_PRESET=your-upload-preset

# Payment Gateway
VITE_RAZORPAY_KEY_ID=rzp_live_your_live_key

# Site Configuration
VITE_SITE_URL=https://pandijiautoconnect.com
VITE_CONTACT_EMAIL=support@pandijiautoconnect.com
VITE_CONTACT_PHONE=+91-XXXXXXXXXX

# Analytics
VITE_GOOGLE_ANALYTICS_ID=G-XXXXXXXXXX
```

### 📊 Analytics Setup

#### Google Analytics 4
1. Create GA4 property
2. Get Measurement ID (G-XXXXXXXXXX)
3. Set `VITE_GOOGLE_ANALYTICS_ID`

#### Google Tag Manager (Optional)
1. Create GTM container
2. Get Container ID (GTM-XXXXXXX)
3. Set `VITE_GOOGLE_TAG_MANAGER_ID`

### 💳 Payment Integration

#### Razorpay Live Keys
1. Complete KYC verification
2. Get live key from dashboard
3. Set `VITE_RAZORPAY_KEY_ID=rzp_live_...`

⚠️ **Security Note**: Only the Key ID is exposed to frontend. Secret key stays on backend.

### 🌐 Domain Configuration

#### Main Domain
- `VITE_SITE_URL`: https://pandijiautoconnect.com
- `VITE_API_URL`: https://api.pandijiautoconnect.com/api
- `VITE_CANONICAL_URL`: https://pandijiautoconnect.com

#### CDN Configuration
- `VITE_ASSET_CDN_URL`: https://cdn.pandijiautoconnect.com
- `VITE_IMAGE_CDN_URL`: Cloudinary URL or custom CDN

### 📱 Social Media Integration

Configure social media URLs:
```bash
VITE_FACEBOOK_URL=https://facebook.com/pandijiautoconnect
VITE_INSTAGRAM_URL=https://instagram.com/pandijiautoconnect
VITE_TWITTER_URL=https://twitter.com/pandijiautoconnect
VITE_YOUTUBE_URL=https://youtube.com/@pandijiautoconnect
VITE_LINKEDIN_URL=https://linkedin.com/company/pandijiautoconnect
```

### 🛡️ Security Configuration

#### reCAPTCHA (Optional)
1. Create reCAPTCHA v3 site
2. Get site key
3. Set `VITE_RECAPTCHA_SITE_KEY`

#### Error Tracking (Optional)
1. Create Sentry project
2. Get DSN
3. Set `VITE_SENTRY_DSN`

### 🚀 Deployment Platform Configuration

#### Vercel
1. Connect GitHub repository
2. Set framework preset: "Vite"
3. Add environment variables in dashboard
4. Build command: `npm run build`
5. Output directory: `dist`

#### Netlify
1. Connect GitHub repository
2. Build command: `npm run build`
3. Publish directory: `dist`
4. Add environment variables in site settings

#### Railway
1. Connect GitHub repository
2. Add environment variables in dashboard
3. Build command: `npm run build`
4. Start command: `npm run preview`

#### Custom Server
1. Build locally: `npm run build`
2. Upload `dist` folder to server
3. Configure web server (nginx/apache)

### 🔧 Build Configuration

#### Production Build
```bash
npm run build
```

#### Preview Production Build
```bash
npm run preview
```

#### Build with Environment
```bash
npm run build:production
```

### 📋 Environment Variables Checklist

#### Required Variables
- [ ] `VITE_API_URL` - Backend API URL
- [ ] `VITE_SITE_URL` - Frontend domain
- [ ] `VITE_RAZORPAY_KEY_ID` - Payment gateway key
- [ ] `VITE_CLOUDINARY_CLOUD_NAME` - Image service

#### Optional but Recommended
- [ ] `VITE_GOOGLE_ANALYTICS_ID` - Analytics tracking
- [ ] `VITE_CONTACT_EMAIL` - Support email
- [ ] `VITE_CONTACT_PHONE` - Support phone
- [ ] Social media URLs
- [ ] Error tracking configuration

### 🧪 Testing Production Build

1. **Environment Check**
```bash
# Check if variables are loaded
npm run build && npm run preview
```

2. **API Connectivity**
- Test API calls to production backend
- Verify CORS configuration

3. **Payment Testing**
- Test Razorpay integration with small amounts
- Verify webhook handling

4. **Analytics Verification**
- Check Google Analytics real-time data
- Verify event tracking

### 🚨 Security Best Practices

1. **Never expose secrets**
   - Only API keys meant for frontend
   - Backend secrets stay on backend

2. **Domain validation**
   - Configure CORS properly
   - Use HTTPS everywhere

3. **Content Security Policy**
   - Configure CSP headers
   - Whitelist trusted domains

### 📊 Performance Optimization

1. **Build optimization**
   - Enable compression
   - Minimize bundle size
   - Use tree shaking

2. **Asset optimization**
   - Use Cloudinary for images
   - Enable lazy loading
   - Configure CDN

3. **Caching strategy**
   - Set cache headers
   - Use service workers
   - Implement offline support

Remember: Never commit `.env.production` with real values to version control!
