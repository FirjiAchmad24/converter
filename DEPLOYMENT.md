# Deployment Guide - Vercel 🚀

## 🔒 Security Setup (IMPORTANT!)

### Step 1: Prepare Environment Variables

1. **Remove hardcoded API key** from public code
2. **Use environment variables** for sensitive data
3. **Never commit** `.env.local` to Git

### Step 2: Deploy to Vercel

#### Option A: Deploy via Vercel Dashboard

1. **Push code to GitHub**:
   ```bash
   git add .
   git commit -m "Prepare for Vercel deployment"
   git push origin main
   ```

2. **Go to Vercel**:
   - Visit: https://vercel.com
   - Click "Add New" → "Project"
   - Import your GitHub repository

3. **Configure Build Settings**:
   - Framework Preset: **Vite**
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`

4. **Add Environment Variables** (CRITICAL!):
   - Go to: Project Settings → Environment Variables
   - Add new variable:
     - **Name**: `VITE_CONVERTAPI_SECRET`
     - **Value**: `5x4j8g7KaYLKjj5LbzpqIa2oe48ipgjk` (your API key)
     - **Environment**: Production, Preview, Development (select all)
   - Click "Save"

5. **Deploy**:
   - Click "Deploy"
   - Wait for build to complete
   - Your site is live! 🎉

#### Option B: Deploy via Vercel CLI

1. **Install Vercel CLI**:
   ```bash
   npm install -g vercel
   ```

2. **Login**:
   ```bash
   vercel login
   ```

3. **Deploy**:
   ```bash
   vercel
   ```

4. **Add Environment Variable**:
   ```bash
   vercel env add VITE_CONVERTAPI_SECRET
   ```
   - Enter your API key when prompted
   - Select all environments

5. **Redeploy**:
   ```bash
   vercel --prod
   ```

## 🔐 Security Checklist

- ✅ `.env.local` is in `.gitignore`
- ✅ API key is stored in Vercel Environment Variables
- ✅ No sensitive data in public JavaScript files
- ✅ `.env.example` is committed (without real keys)
- ✅ Config.js uses environment variables

## 📝 Local Development

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Create `.env.local`**:
   ```
   VITE_CONVERTAPI_SECRET=your_api_key_here
   ```

3. **Run development server**:
   ```bash
   npm run dev
   ```

4. **Open browser**:
   - http://localhost:3000

## 🌐 Production URL

After deployment, your site will be available at:
- `https://your-project-name.vercel.app`

## ⚙️ Environment Variables Reference

| Variable | Description | Required |
|----------|-------------|----------|
| `VITE_CONVERTAPI_SECRET` | ConvertAPI secret key | Yes |

## 🔄 Update Deployment

When you make changes:

```bash
git add .
git commit -m "Your commit message"
git push origin main
```

Vercel will automatically redeploy! 🚀

## 🆘 Troubleshooting

### API not working in production?
- Check if environment variable is set in Vercel dashboard
- Ensure variable name is exactly: `VITE_CONVERTAPI_SECRET`
- Redeploy after adding environment variables

### Build fails?
- Make sure `package.json` exists
- Check if Node version is compatible (16+)
- Review build logs in Vercel dashboard

---

**Created by Firji Achmad Fahresi** 🎯
