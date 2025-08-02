# SMTP Tester

A comprehensive, professional-grade SMTP testing tool built with Next.js, TypeScript, and TailwindCSS. Test your SMTP server configurations with detailed logging, real-time feedback, and support for all major email providers.

![SMTP Tester](https://img.shields.io/badge/Next.js-15.3.5-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4.0-38B2AC?style=for-the-badge&logo=tailwind-css)
![Cloudflare](https://img.shields.io/badge/Cloudflare-Ready-orange?style=for-the-badge&logo=cloudflare)

## ✨ Features

- **🚀 Real-time Testing**: Live connection monitoring with detailed progress tracking
- **🔒 Secure & Private**: All tests run locally - credentials never leave your browser
- **📊 Detailed Logging**: Comprehensive logs with timing data, error details, and export options
- **🎯 Provider Presets**: Built-in configurations for Gmail, Outlook, SendGrid, Mailgun, and more
- **📱 Responsive Design**: Fully responsive UI optimized for all devices
- **⚡ Performance**: Built with Next.js 15 and optimized for speed
- **🎨 Modern UI**: Beautiful, accessible interface with smooth animations
- **📤 Export Results**: Download test results as JSON for analysis

## 🛠️ Tech Stack

- **Framework**: Next.js 15.3.5 with App Router
- **Language**: TypeScript 5.0
- **Styling**: TailwindCSS 4.0
- **Email**: Nodemailer 7.0
- **Validation**: Zod 4.0 with React Hook Form
- **Icons**: Lucide React
- **Deployment**: Cloudflare Pages with OpenNext

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- pnpm (recommended) or npm/yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/smtp-tester.git
   cd smtp-tester
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Start development server**
   ```bash
   pnpm dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📖 Usage Guide

### Basic SMTP Testing

1. **Select a Provider**: Choose from popular providers like Gmail, Outlook, or use custom settings
2. **Configure Settings**: Enter your SMTP host, port, security settings, and credentials
3. **Set Email Details**: Configure from/to addresses, subject, and message
4. **Run Test**: Click "Test SMTP Connection" to start the comprehensive test
5. **Review Results**: Analyze detailed logs, connection info, and any errors

### Supported SMTP Providers

- **Gmail** (smtp.gmail.com:587)
- **Outlook/Hotmail** (smtp-mail.outlook.com:587)
- **Yahoo** (smtp.mail.yahoo.com:587)
- **SendGrid** (smtp.sendgrid.net:587)
- **Mailgun** (smtp.mailgun.org:587)
- **Amazon SES** (email-smtp.us-east-1.amazonaws.com:587)
- **Custom SMTP** (any SMTP server)

### Security Options

- **None**: No encryption (not recommended for production)
- **STARTTLS**: Upgrade to TLS after initial connection (recommended)
- **TLS**: Direct TLS connection
- **SSL**: Legacy SSL connection

## 🔧 Configuration

### Environment Variables

Create a `.env.local` file for any custom configurations:

```env
# Optional: Custom timeout settings
SMTP_DEFAULT_TIMEOUT=30000

# Optional: Enable debug logging
NEXT_PUBLIC_DEBUG=false
```

### Advanced Settings

The application supports advanced SMTP configurations:

- **Timeout**: Connection timeout (1-60 seconds)
- **Reject Unauthorized**: SSL certificate validation
- **Authentication**: Optional SMTP authentication
- **HTML/Text**: Support for both HTML and plain text emails

## 📦 Building for Production

### Local Build

```bash
# Build the application
pnpm build

# Start production server
pnpm start
```

### Docker Build

```dockerfile
FROM node:18-alpine AS base
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

FROM node:18-alpine AS build
WORKDIR /app
COPY . .
RUN npm ci
RUN npm run build

FROM node:18-alpine AS runtime
WORKDIR /app
COPY --from=base /app/node_modules ./node_modules
COPY --from=build /app/.next ./.next
COPY --from=build /app/public ./public
COPY --from=build /app/package.json ./package.json

EXPOSE 3000
CMD ["npm", "start"]
```

## ☁️ Cloudflare Deployment Guide

This application is optimized for deployment on Cloudflare Pages using OpenNext. Follow this comprehensive guide for a seamless deployment.

### Prerequisites

- Cloudflare account (free tier works)
- GitHub repository with your code
- Wrangler CLI (optional, for advanced features)

### Method 1: Cloudflare Pages Dashboard (Recommended)

#### Step 1: Prepare Your Repository

1. **Push your code to GitHub**
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Verify build configuration**
   Ensure your `package.json` has the correct scripts:
   ```json
   {
     "scripts": {
       "build": "next build",
       "deploy": "opennextjs-cloudflare build && opennextjs-cloudflare deploy",
       "preview": "opennextjs-cloudflare build && opennextjs-cloudflare preview"
     }
   }
   ```

#### Step 2: Connect to Cloudflare Pages

1. **Login to Cloudflare Dashboard**
   - Go to [dash.cloudflare.com](https://dash.cloudflare.com)
   - Navigate to "Pages" in the sidebar

2. **Create a new project**
   - Click "Create a project"
   - Select "Connect to Git"
   - Choose your GitHub repository

3. **Configure build settings**
   ```
   Framework preset: Next.js
   Build command: npm run build
   Build output directory: .next
   Root directory: / (leave empty)
   ```

4. **Set environment variables** (if needed)
   ```
   NODE_VERSION=18
   NEXT_PUBLIC_DEBUG=false
   ```

#### Step 3: Deploy

1. **Trigger deployment**
   - Click "Save and Deploy"
   - Wait for the build to complete (usually 2-5 minutes)

2. **Verify deployment**
   - Your app will be available at `https://your-project.pages.dev`
   - Test all SMTP functionality

### Method 2: Wrangler CLI (Advanced)

#### Step 1: Install Wrangler

```bash
npm install -g wrangler
# or
pnpm add -g wrangler
```

#### Step 2: Login to Cloudflare

```bash
wrangler login
```

#### Step 3: Configure wrangler.toml

Your project already includes a `wrangler.jsonc` file. Update it if needed:

```json
{
  "name": "smtp-tester",
  "compatibility_date": "2024-01-01",
  "compatibility_flags": ["nodejs_compat"],
  "pages_build_output_dir": ".vercel/output/static"
}
```

#### Step 4: Deploy with Wrangler

```bash
# Build for Cloudflare
pnpm run deploy

# Or manually
npx opennextjs-cloudflare build
npx opennextjs-cloudflare deploy
```

### Method 3: GitHub Actions (CI/CD)

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Cloudflare Pages

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    permissions:
      contents: read
      deployments: write

    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Build application
        run: npm run build

      - name: Deploy to Cloudflare Pages
        uses: cloudflare/pages-action@v1
        with:
          apiToken: ${{ secrets.CLOUDFLARE_API_TOKEN }}
          accountId: ${{ secrets.CLOUDFLARE_ACCOUNT_ID }}
          projectName: smtp-tester
          directory: .next
          gitHubToken: ${{ secrets.GITHUB_TOKEN }}
```

### Custom Domain Setup

#### Step 1: Add Custom Domain

1. **In Cloudflare Pages**
   - Go to your project settings
   - Click "Custom domains"
   - Add your domain (e.g., `smtp-tester.yourdomain.com`)

2. **Update DNS**
   - Add a CNAME record pointing to your Pages domain
   - Or use Cloudflare's nameservers for full integration

#### Step 2: SSL Configuration

- SSL is automatically configured by Cloudflare
- Force HTTPS redirects are enabled by default
- Edge certificates are provisioned automatically

### Performance Optimization

#### Edge Caching

Add `public/_headers` file for optimal caching:

```
/*
  X-Frame-Options: DENY
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin

/_next/static/*
  Cache-Control: public, max-age=31536000, immutable

/api/*
  Cache-Control: no-cache, no-store, must-revalidate
```

#### Geographic Distribution

- Your app will be automatically distributed across Cloudflare's global network
- 200+ edge locations worldwide
- Sub-100ms response times globally

### Monitoring and Analytics

#### Cloudflare Analytics

1. **Enable Web Analytics**
   - Go to your Pages project
   - Enable "Web Analytics"
   - Add the analytics script to your site

2. **Monitor Performance**
   - Real User Monitoring (RUM)
   - Core Web Vitals tracking
   - Geographic performance data

#### Custom Monitoring

Add monitoring to your application:

```typescript
// Add to your API routes for monitoring
export async function POST(request: Request) {
  const startTime = Date.now();

  try {
    // Your SMTP testing logic
    const result = await testSMTP(config);

    // Log success metrics
    console.log(`SMTP test completed in ${Date.now() - startTime}ms`);

    return NextResponse.json({ success: true, result });
  } catch (error) {
    // Log error metrics
    console.error(`SMTP test failed after ${Date.now() - startTime}ms:`, error);

    return NextResponse.json({ success: false, error: error.message });
  }
}
```

### Troubleshooting

#### Common Issues

1. **Build Failures**
   ```bash
   # Clear cache and rebuild
   rm -rf .next node_modules
   npm install
   npm run build
   ```

2. **Environment Variables**
   - Ensure all required env vars are set in Cloudflare Pages
   - Use `NEXT_PUBLIC_` prefix for client-side variables

3. **API Route Issues**
   - Verify OpenNext configuration
   - Check function compatibility with Cloudflare Workers

4. **Performance Issues**
   - Enable Cloudflare's optimization features
   - Use edge caching for static assets
   - Optimize images with Cloudflare Image Optimization

#### Getting Help

- **Cloudflare Community**: [community.cloudflare.com](https://community.cloudflare.com)
- **Next.js Docs**: [nextjs.org/docs](https://nextjs.org/docs)
- **OpenNext Issues**: [GitHub Issues](https://github.com/opennextjs/opennextjs-cloudflare/issues)

### Cost Estimation

#### Cloudflare Pages Pricing

- **Free Tier**:
  - 1 build per minute
  - 500 builds per month
  - Unlimited bandwidth
  - Custom domains included

- **Pro Tier ($20/month)**:
  - 5 concurrent builds
  - 5,000 builds per month
  - Advanced analytics
  - Priority support

For most SMTP testing applications, the free tier is sufficient.

## 🔒 Security Considerations

### Data Privacy

- **No Data Storage**: SMTP credentials are never stored or logged
- **Client-Side Processing**: All sensitive data remains in the browser
- **Secure Transmission**: All API calls use HTTPS
- **No Third-Party Analytics**: No tracking or analytics on sensitive data

### Best Practices

1. **Use App Passwords**: For Gmail and other providers, use app-specific passwords
2. **Test Credentials**: Use dedicated test accounts when possible
3. **Network Security**: Deploy behind Cloudflare's security features
4. **Rate Limiting**: Implement rate limiting for API endpoints

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### Development Setup

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes
4. Add tests if applicable
5. Commit your changes: `git commit -m 'Add amazing feature'`
6. Push to the branch: `git push origin feature/amazing-feature`
7. Open a Pull Request

### Code Style

- Use TypeScript for all new code
- Follow the existing code style
- Add JSDoc comments for public APIs
- Ensure all tests pass

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org) - The React framework for production
- [TailwindCSS](https://tailwindcss.com) - A utility-first CSS framework
- [Nodemailer](https://nodemailer.com) - Send emails with Node.js
- [Zod](https://zod.dev) - TypeScript-first schema validation
- [Lucide](https://lucide.dev) - Beautiful & consistent icons
- [Cloudflare](https://cloudflare.com) - Global edge network and deployment platform

## 📞 Support

If you encounter any issues or have questions:

1. Check the [troubleshooting section](#troubleshooting)
2. Search [existing issues](https://github.com/yourusername/smtp-tester/issues)
3. Create a [new issue](https://github.com/yourusername/smtp-tester/issues/new) with detailed information

---

**Made with ❤️ for the developer community**
