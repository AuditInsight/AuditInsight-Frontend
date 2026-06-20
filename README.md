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

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.



## Demo accounts

Password for all accounts below: `demo1234`

| Email | Role |
|-------|------|
| `ceo@insightai.rw` | CLIENT (Organisation Admin) |
| `accountant@insightai.rw` | MEMBER (Accountant) |
| `auditor@audit.rw` | AUDITOR |
| `admin@auditinsight.com` | ADMIN |

## Mock OTP (registration)

The backend API is not wired up yet. Organisation Admin sign-up uses a **fixed demo OTP** stored in the browser (`localStorage`) so you can test the full registration flow locally.

**Demo OTP code:** `123456`

Defined in `src/mock/auth.mock.ts` as `DUMMY_OTP_CODE`.

### Sign-up flow (CLIENT only)

1. Go to `/sign-up` and choose **Organisation Admin**
2. Fill in the form and submit
3. You are redirected to `/verify-otp`
4. Enter **`123456`** (or click **Use demo code** on that page)
5. Click **Verify Code** → you are sent to `/onboarding`
6. Complete organisation setup and choose a plan → `/dashboard`

Auditor sign-up skips OTP and goes to login pending admin approval.

### Notes

- No real email is sent; OTP metadata is saved in `localStorage` under `signup_otp_meta`
- OTP verification is marked with `otp_verified` in `localStorage` before onboarding
- When the real backend is connected, replace the mock helpers in `src/mock/auth.mock.ts` and the verify logic in `src/app/verify-otp/page.tsx`

