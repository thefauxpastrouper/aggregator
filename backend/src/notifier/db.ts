import { PrismaClient } from '@prisma/client';

export const prisma = new PrismaClient();

export async function saveNotices(notices: { university: string; title: string; url: string; isPdf: boolean; date?: Date; summary?: string }[]) {
  let newCount = 0;
  for (const notice of notices) {
    try {
      const exists = await prisma.notice.findUnique({ where: { url: notice.url } });
      if (!exists) {
        await prisma.notice.create({
          data: {
            ...notice,
            date: notice.date || new Date(),
          },
        });
        newCount++;
      }
    } catch (e) {
      console.error(`Failed to save notice ${notice.url}`, e);
    }
  }
  return newCount;
}
