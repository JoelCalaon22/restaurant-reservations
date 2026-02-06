/**
 * One-time script used to backfill reservation codes
 * after introducing the Reservation.code field.
 * Not used in runtime.
 */

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

function randomCode(len = 6) {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let out = "";
  for (let i = 0; i < len; i++) out += chars[Math.floor(Math.random() * chars.length)];
  return out;
}

async function generateUniqueCode(branchId) {
  const prefix = (branchId || "BR")
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, "")
    .slice(0, 6);

  for (let i = 0; i < 30; i++) {
    const code = `${prefix}-${randomCode(6)}`;
    const exists = await prisma.reservation.findUnique({
      where: { code },
      select: { id: true },
    });
    if (!exists) return code;
  }

  throw new Error("Could not generate unique reservation code");
}

async function main() {
  const rows = await prisma.reservation.findMany({
    where: { code: null },
    select: { id: true, branchId: true },
  });

  console.log("Reservations missing code:", rows.length);

  for (const r of rows) {
    const code = await generateUniqueCode(r.branchId);
    await prisma.reservation.update({
      where: { id: r.id },
      data: { code },
    });
    console.log("Updated", r.id, "->", code);
  }
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
