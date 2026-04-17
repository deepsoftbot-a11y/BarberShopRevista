#!/bin/sh
set -e

node node_modules/prisma/build/index.js migrate deploy

node -e "
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function main() {
  const email = process.env.ADMIN_EMAIL;
  const passwordHash = process.env.ADMIN_PASSWORD_HASH;
  if (!email || !passwordHash) return;
  const existing = await prisma.admin.findUnique({ where: { email } });
  if (!existing) {
    await prisma.admin.create({ data: { id: 'admin_001', email, passwordHash } });
    console.log('Admin creado:', email);
  }
}
main().finally(() => prisma.\$disconnect());
"

exec node server.js
