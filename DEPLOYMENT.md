# ADIS Frontend - GitHub Pages Deployment Guide

This guide explains how to deploy the ADIS frontend to GitHub Pages.

## Prerequisites

1. A GitHub repository for your project
2. Node.js and npm installed locally
3. Git configured with your GitHub account

## Deployment Methods

### Method 1: Automatic Deployment with GitHub Actions (Recommended)

The project is configured with GitHub Actions for automatic deployment. Every push to the main/master branch will trigger a deployment.

#### Setup Steps:

1. **Push your code to GitHub:**
   ```bash
   git add .
   git commit -m "Configure for GitHub Pages deployment"
   git push origin main
   ```

2. **Enable GitHub Pages in your repository:**
   - Go to your repository on GitHub
   - Navigate to Settings → Pages
   - Under "Source", select "GitHub Actions"
   - The deployment will start automatically

3. **Access your deployed site:**
   - Your site will be available at: `https://yourusername.github.io/ADIS/`
   - Replace `yourusername` with your actual GitHub username

### Method 2: Manual Deployment

If you prefer manual deployment or need to deploy from your local machine:

1. **Install dependencies:**
   ```bash
   cd frontend
   npm install
   ```

2. **Install gh-pages package (if not already installed):**
   ```bash
   npm install --save-dev gh-pages
   ```

3. **Build and deploy:**
   ```bash
   npm run deploy
   ```

## Configuration Details

### Vite Configuration
- **Base URL**: Set to `/ADIS/` for GitHub Pages
- **Build Output**: `dist/` directory
- **Environment**: Production mode for GitHub Pages builds

### Router Configuration
- **Basename**: Configured to use `/ADIS` in production
- **SPA Routing**: 404.html handles client-side routing for GitHub Pages

### Environment Variables
- **Production API URL**: Configured in `.env.production`
- **Development API URL**: Configured in `.env`

## File Structure

```
frontend/
├── .github/
│   └── workflows/
│       └── deploy.yml          # GitHub Actions workflow
├── public/
│   └── 404.html               # SPA routing for GitHub Pages
├── src/
│   ├── App.tsx                # Router with basename configuration
│   └── pages/
│       └── NotFound.tsx       # 404 page with SPA routing logic
├── .env                       # Development environment variables
├── .env.production           # Production environment variables
├── package.json              # Build and deployment scripts
└── vite.config.ts            # Vite configuration with base URL
```

## Troubleshooting

### Common Issues:

1. **404 errors on page refresh:**
   - Ensure 404.html is in the public folder
   - Check that the NotFound component handles SPA routing

2. **Assets not loading:**
   - Verify the base URL in vite.config.ts matches your repository name
   - Check that the basename in App.tsx is correct

3. **API calls failing:**
   - Ensure the API URL in .env.production is correct
   - Check CORS settings on your backend

4. **Deployment not triggering:**
   - Check that GitHub Actions is enabled in your repository
   - Verify the workflow file is in `.github/workflows/`

### Manual Build Testing:

Test your build locally before deploying:

```bash
cd frontend
npm run build:gh-pages
npm run preview
```

## Environment Variables

### Development (.env)
```
REACT_APP_BASE_URL=https://www.chaintechhub.com/ADIS/backend/api
```

### Production (.env.production)
```
REACT_APP_BASE_URL=https://www.chaintechhub.com/ADIS/backend/api
VITE_API_BASE_URL=https://www.chaintechhub.com/ADIS/backend/api
```

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run build:gh-pages` - Build specifically for GitHub Pages
- `npm run deploy` - Build and deploy to GitHub Pages
- `npm run preview` - Preview production build locally

## Notes

- The deployment assumes your repository is named "ADIS"
- If your repository has a different name, update the base URL in vite.config.ts and the basename in App.tsx
- The backend API URL should be accessible from the deployed frontend
- Make sure your backend has proper CORS configuration for the GitHub Pages domain