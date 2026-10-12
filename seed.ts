
import { prisma } from "../src/lib/prisma.js";

async function main() {
  await prisma.student.upsert({
    where: { code: "6500000001" },
    update: {},
    create: {
      code: "6500000001",
      name: "สมชาย ใจดี",
      email: "somchai@example.com",
      score: 80,
    },
  });

  console.log("เพิ่มข้อมูลนักศึกษาตัวอย่างเรียบร้อย");
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
