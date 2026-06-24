This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## RSVP Google Sheet Setup

The RSVP form posts to `/api/rsvp`, which appends each submission to a Google Sheet.

1. Create a Google Cloud service account and download its JSON key.
2. Create a Google Sheet with a tab named `RSVP`.
3. Add these headers in row 1: `Submitted At`, `Group ID`, `First Name`, `Last Name`, `Attending`, `Number of Attendees`, `Message`.
4. Share the Google Sheet with the service account email as an editor.
5. Copy `.env.example` to `.env.local` and fill in:
   - `GOOGLE_SHEETS_CLIENT_EMAIL`
   - `GOOGLE_SHEETS_PRIVATE_KEY`
   - `GOOGLE_SHEETS_SPREADSHEET_ID`
   - `GOOGLE_SHEETS_SHEET_NAME`

On Vercel, add the same variables in Project Settings → Environment Variables.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
