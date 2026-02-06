import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { prisma } from "../db/prisma.js";
import { sendResetEmail } from "../utils/mailer.js";

const JWT_SECRET = process.env.JWT_SECRET || "dev_secret_change_me";
const RESET_TTL_MINUTES = Number(process.env.RESET_TTL_MINUTES || 30);
const APP_URL = process.env.APP_URL || "http://localhost:5173";

function isValidEmail(email) {
  return typeof email === "string" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function hashToken(token) {
  return crypto.createHash("sha256").update(token).digest("hex");
}

export async function register({ email, password, firstName, lastName }) {
  if (!isValidEmail(email)) throw new Error("Invalid email");
  if (typeof password !== "string" || password.length < 8) {
    throw new Error("Password must be at least 8 characters");
  }
  if (!firstName || !lastName) throw new Error("firstName and lastName are required");

  const exists = await prisma.user.findUnique({ where: { email } });
  if (exists) throw new Error("Email already in use");

  const passwordHash = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: { email, passwordHash, firstName, lastName },
    select: { id: true, email: true, firstName: true, lastName: true, createdAt: true },
  });

  return user;
}

export async function login({ email, password }) {
  if (!isValidEmail(email)) throw new Error("Invalid credentials");

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) throw new Error("Invalid credentials");

  const ok = await bcrypt.compare(password || "", user.passwordHash);
  if (!ok) throw new Error("Invalid credentials");

  const token = jwt.sign(
    { sub: user.id, email: user.email },
    JWT_SECRET,
    { expiresIn: "7d" }
  );

  return {
    token,
    user: { id: user.id, email: user.email, firstName: user.firstName, lastName: user.lastName },
  };
}

export async function forgotPassword({ email }) {
  if (!isValidEmail(email)) return;

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return;

  const token = crypto.randomBytes(32).toString("hex");
  const tokenHash = hashToken(token);
  const expiresAt = new Date(Date.now() + RESET_TTL_MINUTES * 60 * 1000);

  await prisma.passwordResetToken.updateMany({
    where: { userId: user.id, usedAt: null, expiresAt: { gt: new Date() } },
    data: { usedAt: new Date() },
  });

  await prisma.passwordResetToken.create({
    data: { userId: user.id, tokenHash, expiresAt },
  });

  const resetLink = `${APP_URL}/reset-password?token=${token}`;
  await sendResetEmail(user.email, resetLink);
}

export async function resetPassword({ token, newPassword }) {
  if (typeof token !== "string" || token.length < 10) {
    throw new Error("Invalid or expired token");
  }
  if (typeof newPassword !== "string" || newPassword.length < 8) {
    throw new Error("Password must be at least 8 characters");
  }

  const tokenHash = hashToken(token);

  const record = await prisma.passwordResetToken.findUnique({
    where: { tokenHash },
    include: { user: true },
  });

  if (!record) throw new Error("Invalid or expired token");
  if (record.usedAt) throw new Error("Token already used");
  if (record.expiresAt <= new Date()) throw new Error("Token expired");

  const passwordHash = await bcrypt.hash(newPassword, 10);

  await prisma.$transaction([
    prisma.user.update({
      where: { id: record.userId },
      data: { passwordHash },
    }),
    prisma.passwordResetToken.update({
      where: { id: record.id },
      data: { usedAt: new Date() },
    }),
  ]);
}
