/**
 * page.tsx — Login route entry point.
 *
 * Delegates entirely to LoginPage.production which uses:
 *  - React Hook Form + Zod validation
 *  - Production AuthContext (JWT-based, real API)
 *  - AxiosError handling with inline server errors
 */

export { default } from "./LoginPage.production";
