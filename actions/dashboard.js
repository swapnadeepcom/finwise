"use server"

import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

const serializeTransaction = (obj) => {
  const serialized = { ...obj };
  if (obj.balance) {
    serialized.balance = obj.balance.toNumber();
  }
  if (obj.amount) {
    serialized.amount = obj.amount.toNumber();
  }
  return serialized;
};

// ------------------------- createAccount -------------------------
export async function createAccount(data) {
  const { userId } = await auth();
  if (!userId) return { success: false, error: "Unauthorized" };

  const user = await db.user.findUnique({ where: { clerkUserId: userId } });
  if (!user) {
    return { success: false, error: "User not found" };
  }

  const balanceFloat = parseFloat(data.balance);
  if (isNaN(balanceFloat)) {
    return { success: false, error: "Invalid balance amount" };
  }

  const existingAccounts = await db.account.findMany({
    where: { userId: user.id },
  });
  const shouldBeDefault = existingAccounts.length === 0 ? true : data.isDefault;

  if (shouldBeDefault) {
    await db.account.updateMany({
      where: { userId: user.id, isDefault: true },
      data: { isDefault: false },
    });
  }

  const account = await db.account.create({
    data: {
      ...data,
      balance: balanceFloat,
      userId: user.id,
      isDefault: shouldBeDefault,
    },
  });

  const serializedAccount = serializeTransaction(account);
  revalidatePath("/dashboard");
  return { success: true, data: serializedAccount };
}

// ------------------------- getUserAccounts -------------------------
export async function getUserAccounts() {
  const { userId } = await auth();
  if (!userId) return [];

  const user = await db.user.findUnique({ where: { clerkUserId: userId } });
  if (!user) return [];

  const accounts = await db.account.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { transactions: true } } },
  });

  return (accounts || []).map(serializeTransaction);
}

// ------------------------- getDashboardData -------------------------
export async function getDashboardData() {
  const { userId } = await auth();
  if (!userId) return [];

  const user = await db.user.findUnique({ where: { clerkUserId: userId } });
  if (!user) return [];

  const transactions = await db.transaction.findMany({
    where: { userId: user.id },
    orderBy: { date: "desc" },
  });

  return (transactions || []).map(serializeTransaction);
}
