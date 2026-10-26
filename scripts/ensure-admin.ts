/**
 * Upsert a super-admin user (for production DB without full re-seed).
 * Usage: npx tsx scripts/ensure-admin.ts [email] [password] [name]
 */
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";
import bcrypt from "bcryptjs";
import "dotenv/config";

const connectionString =
  process.env.DIRECT_URL ??
  process.env.DATABASE_URL_UNPOOLED ??
  process.env.DATABASE_URL;

if (!connectionString) {
  console.error("Missing DATABASE_URL or DIRECT_URL");
  process.exit(1);
}

const pool = new pg.Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  const email = (process.argv[2] ?? "alphaadmin@gmail.com").trim().toLowerCase();
  const password = process.argv[3] ?? "Alpha-admin1";
  const name = process.argv[4] ?? "Alpha Admin";

  const passwordHash = await bcrypt.hash(password, 12);

  const user = await prisma.user.upsert({
    where: { email },
    update: { passwordHash, isActive: true, name },
    create: { email, name, passwordHash, isActive: true },
  });

  const superAdminRole = await prisma.role.findUnique({
    where: { slug: "super-admin" },
  });

  if (!superAdminRole) {
    throw new Error('Role "super-admin" not found. Run prisma migrate deploy and db:seed first.');
  }

  await prisma.userRole.upsert({
    where: {
      userId_roleId: { userId: user.id, roleId: superAdminRole.id },
    },
    update: {},
    create: { userId: user.id, roleId: superAdminRole.id },
  });

  const ok = await bcrypt.compare(password, passwordHash);
  console.log(`Super-admin ready: ${email} (password verify: ${ok ? "ok" : "failed"})`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
