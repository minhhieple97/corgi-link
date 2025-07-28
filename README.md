<div align="center">
  <h1>🔗 Coriglink</h1>
  <p><strong>Modern URL Shortener & Analytics Platform</strong></p>
  
  <p>
    <a href="https://corgi-link.vercel.app/" target="_blank">
      <img src="https://img.shields.io/badge/🌐_Live_Demo-Visit_App-blue?style=for-the-badge" alt="Live Demo" />
    </a>
  </p>
  
  <p>
    <img src="https://img.shields.io/badge/Next.js-15.1.8-black?style=for-the-badge&logo=next.js" alt="Next.js" />
    <img src="https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript" alt="TypeScript" />
    <img src="https://img.shields.io/badge/PostgreSQL-16-blue?style=for-the-badge&logo=postgresql" alt="PostgreSQL" />
    <img src="https://img.shields.io/badge/Redis-Upstash-red?style=for-the-badge&logo=redis" alt="Redis" />
  </p>
</div>

---

## 🌟 Overview

A next-generation URL shortener and biolink platform engineered for enterprise performance and security. Built with cutting-edge asynchronous processing architecture and AI-powered threat detection, CorgiLink delivers lightning-fast URL transformation and beautiful personal landing pages while ensuring maximum security for your links and users.

**🚀 Experience blazing-fast performance with intelligent security at [https://corgi-link.vercel.app](https://corgi-link.vercel.app/)**

### 🎯 **Why Choose CorgiLink?**

**⚡ Asynchronous Processing Excellence**  
Our advanced async architecture ensures sub-second response times, handling thousands of concurrent requests without performance degradation. Every operation is optimized for speed and scalability.

**🤖 AI-Powered Security Intelligence**  
Integrated machine learning algorithms automatically scan and analyze URLs for malicious content, phishing attempts, and security threats in real-time, protecting your users before they click.

**🏗️ Enterprise-Grade Architecture**  
Built on Next.js 15 with Redis caching, PostgreSQL optimization, and intelligent load balancing for mission-critical applications that demand reliability and performance.

**📊 Real-Time Analytics & Insights**  
Comprehensive analytics dashboard with geographic tracking, referral analysis, and user behavior insights to help you understand and optimize your link performance.

**🎨 Professional BioLink Builder**  
Create stunning personal landing pages with our intuitive drag-and-drop editor. Showcase your portfolio, social links, and projects with customizable components and professional themes.

## ✨ Key Features

<table>
  <tr>
    <td>🔗 <strong>Smart URL Shortening</strong></td>
    <td>Create custom short links with intelligent collision detection</td>
  </tr>
  <tr>
    <td>📊 <strong>Advanced Analytics</strong></td>
    <td>Real-time click tracking, geographic data, and referral insights</td>
  </tr>
  <tr>
    <td>🔐 <strong>Secure Authentication</strong></td>
    <td>Powered by Clerk with role-based access control</td>
  </tr>
  <tr>
    <td>⚡ <strong>High Performance</strong></td>
    <td>Redis caching and optimized database queries</td>
  </tr>
  <tr>
    <td>📱 <strong>QR Code Generation</strong></td>
    <td>Instant QR codes for mobile sharing</td>
  </tr>
  <tr>
    <td>🎨 <strong>BioLink Builder</strong></td>
    <td>Drag-and-drop personal landing page creator</td>
  </tr>
  <tr>
    <td>🧩 <strong>Dynamic Components</strong></td>
    <td>8 component types: buttons, text, images, social links, projects</td>
  </tr>
  <tr>
    <td>🎛️ <strong>Visual Page Editor</strong></td>
    <td>Professional 3-panel interface with real-time preview</td>
  </tr>
  <tr>
    <td>🎨 <strong>Custom Styling</strong></td>
    <td>Colors, fonts, layouts with live preview</td>
  </tr>
  <tr>
    <td>📄 <strong>Version Control</strong></td>
    <td>Save drafts and publish when ready</td>
  </tr>
  <tr>
    <td>🛡️ <strong>URL Safety Checking</strong></td>
    <td>AI-powered malicious URL detection</td>
  </tr>
  <tr>
    <td>👨‍💼 <strong>Admin Dashboard</strong></td>
    <td>Complete user and URL management interface</td>
  </tr>
  <tr>
    <td>🎨 <strong>Modern UI/UX</strong></td>
    <td>Responsive design with dark/light theme support</td>
  </tr>
</table>

## 🚀 Tech Stack

### **Frontend**
- **Framework:** Next.js 15.1.8 with App Router
- **Language:** TypeScript 5.0
- **Styling:** Tailwind CSS 3.4.1
- **UI Components:** Shadcn/ui + Radix UI
- **Forms:** React Hook Form + Zod validation

### **Backend**
- **Database:** PostgreSQL 16 (Docker)
- **ORM:** Drizzle ORM 0.43.1
- **Caching:** Upstash Redis 1.34.9
- **Authentication:** Clerk 6.20.0
- **API:** Next.js Server Actions with `next-safe-action`

### **DevOps & Tools**
- **Package Manager:** pnpm
- **Environment:** T3 Env validation
- **Linting:** ESLint 9
- **Database Tools:** Drizzle Kit + Drizzle Studio

## 🛠️ Quick Start

### Prerequisites
```bash
Node.js 20+ | pnpm | Docker
```

### 1. Clone & Install
```bash
git clone https://github.com/minhhieple97/corgi-link.git
cd corgi-link
pnpm install
```

### 2. Environment Setup
Create `.env` file:
```env
# App Configuration
NODE_ENV=development
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key
NEXT_PUBLIC_CLERK_SIGN_IN_PATH=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_PATH=/sign-up
CLERK_WEBHOOK_SIGNING_SECRET=your_clerk_webhook_signing_secret

# Database
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/url_shortener_db"

# Redis Cache
UPSTASH_REDIS_REST_URL=your_upstash_redis_rest_url
UPSTASH_REDIS_REST_TOKEN=your_upstash_redis_rest_token

# AI Features (Optional)
OPENAI_API_KEY=your_openai_api_key
```

### 3. Database Setup
```bash
# Start PostgreSQL container
docker-compose up -d

# Setup database schema
npm run db
```

### 4. Launch Development Server
```bash
npm run dev
```