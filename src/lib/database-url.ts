/** Unpooled connection for Prisma CLI (migrate, seed). Supports Neon naming. */
export function getDirectDatabaseUrl() {
  return (
    process.env.DIRECT_URL ??
    process.env.DATABASE_URL_UNPOOLED ??
    process.env.POSTGRES_URL_NON_POOLING ??
    process.env.DATABASE_URL
  );
}

/** Pooled connection for app runtime (Vercel/serverless). */
export function getPooledDatabaseUrl() {
  return (
    process.env.DATABASE_URL ??
    process.env.POSTGRES_PRISMA_URL ??
    process.env.POSTGRES_URL
  );
}
