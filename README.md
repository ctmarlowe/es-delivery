# Delivery Plan App

A modern web application for Expert Services teams to collaboratively design, manage, and track delivery plans for fixed-hour consulting engagements.

## Features

- **Customer Management**: Manage customer organizations
- **Engagement Management**: Track consulting engagements with fixed package hours
- **Delivery Plans**: Create and manage delivery plans with status tracking (DRAFT, ACTIVE, COMPLETED, ARCHIVED)
- **Session Management**: Add sessions to delivery plans with hour tracking
- **Library**: Reusable session templates
- **Topics**: Categorization tags for sessions and library items
- **Hour Validation**: Automatic validation to prevent exceeding package hours

## Tech Stack

- **Next.js 14** (App Router)
- **TypeScript**
- **PostgreSQL**
- **Prisma ORM**
- **Tailwind CSS**
- **shadcn/ui** components
- **lucide-react** icons

## Getting Started

### Prerequisites

- Node.js 18+ 
- PostgreSQL database
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Set up your database:
   - Create a PostgreSQL database
   - Copy `.env.example` to `.env` (if it exists) or create a `.env` file with:
   ```
   DATABASE_URL="postgresql://user:password@localhost:5432/delivery_plan"
   ```

3. Generate Prisma client and push schema:
```bash
npm run db:generate
npm run db:push
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Database Management

- Generate Prisma client: `npm run db:generate`
- Push schema changes: `npm run db:push`
- Create migration: `npm run db:migrate`
- Open Prisma Studio: `npm run db:studio`

## Project Structure

```
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   ├── customers/         # Customer pages
│   ├── engagements/       # Engagement pages
│   ├── delivery-plans/    # Delivery plan pages
│   ├── library/          # Library pages
│   └── topics/           # Topic pages
├── components/            # React components
│   └── ui/               # shadcn/ui components
├── lib/                   # Utility functions
│   ├── prisma.ts         # Prisma client
│   └── utils.ts          # Utility functions
└── prisma/                # Prisma schema
    └── schema.prisma     # Database schema
```

## Features in Detail

### Hour Tracking
- Delivery plans track total planned hours against engagement package hours
- Sessions validate that total planned hours don't exceed package hours
- Visual indicators show remaining hours and warnings when over budget

### Status Management
Delivery plans can have one of four statuses:
- **DRAFT**: Initial planning phase
- **ACTIVE**: Currently being executed
- **COMPLETED**: Finished delivery
- **ARCHIVED**: Archived for reference

### Library Items
- Create reusable session templates
- When adding a session from a library item, title and default hours are automatically populated
- Library items can be tagged with topics for better organization

## Deployment

This app is configured for Vercel deployment. To deploy:

1. Push your code to GitHub
2. Import the project in Vercel
3. Add your `DATABASE_URL` environment variable
4. Deploy

## License

MIT

