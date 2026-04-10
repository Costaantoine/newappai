# NewAppAI - Setup Instructions

## Prerequisites
- Node.js 18+
- Supabase account
- Stripe account

## Setup Steps

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to Settings > API and copy your project URL and keys
3. Run the SQL schema in Supabase SQL Editor:
   - Open `supabase-schema.sql`
   - Copy and paste into Supabase SQL Editor
   - Execute the script

### 3. Configure Stripe

1. Get your API keys from [Stripe Dashboard](https://dashboard.stripe.com/test/apikeys)
2. Create a webhook endpoint:
   - Go to Developers > Webhooks
   - Add endpoint: `https://your-domain.com/api/stripe/webhook`
   - Select `checkout.session.completed` event
   - Copy the webhook signing secret

### 4. Environment Variables

Copy `.env.example` to `.env.local` and fill in your values:

```bash
cp .env.example .env.local
```

Required variables:
- `NEXT_PUBLIC_SUPABASE_URL` - Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Your Supabase anonymous key
- `SUPABASE_SERVICE_KEY` - Your Supabase service role key
- `ADMIN_PASSWORD` - Password for admin panel access
- `STRIPE_SECRET_KEY` - Stripe secret key (sk_test_...)
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` - Stripe publishable key (pk_test_...)
- `STRIPE_WEBHOOK_SECRET` - Webhook signing secret (whsec_...)
- `SESSION_SECRET` - Random 32+ character string

### 5. Run Development Server

```bash
npm run dev
```

Visit:
- http://localhost:3001 - Main site
- http://localhost:3001/admin - Admin panel

### 6. Test Stripe Webhooks Locally

```bash
npx stripe listen --forward-to localhost:3001/api/stripe/webhook
```

## File Structure

```
app/
├── api/
│   ├── auth/route.ts          # Admin authentication
│   ├── products/route.ts       # Product CRUD
│   ├── upload/route.ts         # Image upload
│   └── stripe/
│       ├── checkout/route.ts   # Stripe checkout
│       └── webhook/route.ts    # Webhook handler
├── admin/
│   ├── login/page.tsx          # Admin login
│   ├── dashboard/page.tsx      # Product list
│   └── products/
│       ├── new/page.tsx        # Create product
│       └── [id]/page.tsx       # Edit product
├── success/page.tsx            # Payment success
├── page.tsx                    # Home
├── solutions/page.tsx          # Solutions
├── about/page.tsx              # About
└── contact/page.tsx            # Contact
```

## Deployment

### Vercel (Recommended)
1. Push to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy

### Stripe Webhook for Production
- Update webhook endpoint URL to your production domain
- Use production Stripe keys
