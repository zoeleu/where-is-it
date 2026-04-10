# WhereIsIt

WhereIsIt is a full-stack Next.js app for tracking items and locations so you always know where everything is.

## Tech Stack

- Next.js 16 (App Router)
- React 19 + TypeScript
- Better Auth (email/password)
- Prisma ORM + PostgreSQL
- Tailwind CSS v4 + shadcn/ui

## Features

- User authentication (sign up, login, session-based auth)
- Create, view, update, and delete locations
- Create, view, update, and delete items
- Item-to-location assignment
- Dashboard views for recent items and summary stats

## Prerequisites

- Node.js 20+ (or Bun)
- PostgreSQL database

## Getting Started

1. Install dependencies:

```bash
npm install
```

2. Create a .env file in the project root:

```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST:5432/whereisit"
BETTER_AUTH_SECRET="replace-with-a-long-random-secret"
BETTER_AUTH_URL="http://localhost:3000"
```

3. Run Prisma migrations:

```bash
npx prisma migrate dev
```

4. Start the development server:

```bash
npm run dev
```

Open http://localhost:3000 in your browser.

## Available Scripts

- npm run dev: Start development server
- npm run build: Build for production
- npm run start: Run production server
- npm run lint: Run ESLint
- npm run typecheck: Run TypeScript type checks
- npm run format: Format TypeScript files with Prettier

## Database Notes

- Prisma schema is located in prisma/schema.prisma
- Generated Prisma client is output to prisma/generated
- If you change the schema, run:

```bash
npx prisma migrate dev
npx prisma generate
```

## Project Structure

- app: Next.js routes, API endpoints, and page layouts
- components: Reusable UI and feature components
- hooks: Data-fetching hooks for items and locations
- lib: Auth and database utilities
- prisma: Schema, migrations, and generated client

## API Routes

- /api/auth/*: Better Auth handlers
- /api/items: Item CRUD endpoints
- /api/locations: Location CRUD endpoints

## License

Private project.
