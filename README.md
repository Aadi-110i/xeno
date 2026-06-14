# Xeno CRM

Xeno is a high-performance customer relationship management and audience orchestration platform built for the 2026 Xeno Engineering Internship Assignment. It focuses on data integrity, intelligent segmentation, and multi-channel campaign execution.

## Core Functionality

### 1. Data Ingestion
The system includes a JSON-based ingestion portal designed for high-velocity data synchronization from external sources (Web, POS, Apps). 
- Supports batch uploads of customer and order data.
- Employs transactional logic to ensure data consistency between customer records and purchase history.

### 2. Segment Orchestration
A flexible audience builder that allows users to define specific customer groups based on behavioral data.
- Visual Rule Builder: Create segments using structured filters like total spend, purchase frequency, and last activity.
- AI Natural Language Parser: Integrates Gemini to convert plain-text descriptions (e.g., "customers who spent over $500 in the last month") into executable database queries.

### 3. Campaign Management
A multi-step workflow for designing and deploying targeted marketing messages.
- Multi-Channel Support: Capabilities for WhatsApp, SMS, Email, and RCS.
- Deliverability Simulator: A real-time mobile preview that renders personalized templates, allowing users to verify message formatting before execution.

### 4. Live Telemetry
A technical dashboard providing real-time visibility into campaign performance and system health.
- Revenue Attribution: Tracks ROI through conversion trends linked directly to campaign logs.
- Delivery Signals: Monitors real-time status updates (sent, delivered, opened, converted) across all communication channels.

## Technical Stack

- Framework: Next.js (App Router)
- Language: TypeScript
- Database: PostgreSQL (via Prisma ORM)
- Authentication: JWT-based with bcrypt password hashing
- Styling: Vanilla CSS / CSS Modules
- Animation: Motion (formerly Framer Motion)
- Icons: Lucide React
- AI: Google Gemini (for query parsing and content generation)

## Setup and Installation

### Prerequisites
- Node.js (v18+)
- A hosted PostgreSQL instance (e.g., Vercel Postgres, Supabase, or Neon)

### Environment Variables
Create a .env file in the root directory with the following variables:
- DATABASE_URL: Your PostgreSQL connection string.
- JWT_SECRET: A secure string for signing authentication tokens.
- GOOGLE_GENERATIVE_AI_API_KEY: Your Gemini API key.

### Installation Steps
1. Install dependencies:
   npm install

2. Initialize the database schema:
   npx prisma generate
   npx prisma migrate dev --name init

3. (Optional) Seed the database with sample data:
   node prisma/seed.js

4. Start the development server:
   npm run dev

## Deployment on Vercel
1. Push the code to a GitHub repository.
2. Connect the repository to Vercel.
3. Configure the environment variables in the Vercel dashboard.
4. Vercel will automatically run the build script (prisma generate && next build).
