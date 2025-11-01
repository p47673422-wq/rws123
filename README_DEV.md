Development setup

Steps to run locally (Windows PowerShell):

1. Install dependencies

   npm install

2. Generate Prisma client (after setting DATABASE_URL in .env)

   npx prisma generate

3. Start dev server

   npm run dev

Notes:
- I added runtime-safe Prisma usage in API routes so the code will not break until you run `npx prisma generate`.
- If TypeScript complains about missing types for new dependencies (lucide-react, next-auth, classnames), run `npm install` as above.
- If you change Prisma schema, run `npx prisma generate` again.
