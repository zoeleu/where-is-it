# Next.js template

This is a Next.js template with shadcn/ui.

## Database (PostgreSQL)

This project now uses PostgreSQL with Prisma.

1. Start a PostgreSQL instance and create a database (for example: `whereisit`).
2. Set `DATABASE_URL` in `.env`.
3. Run migrations:

```bash
bunx prisma migrate dev
```

4. Regenerate the Prisma client after schema changes:

```bash
bunx prisma generate
```

## Adding components

To add components to your app, run the following command:

```bash
npx shadcn@latest add button
```

This will place the ui components in the `components` directory.

## Using components

To use the components in your app, import them as follows:

```tsx
import { Button } from "@/components/ui/button";
```
