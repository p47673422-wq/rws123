import { PrismaClient } from '@prisma/client';
import XLSX from "xlsx";
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

const TEMP_PASSWORD = "iskcon20251608";

async function importUsers() {
  console.log("Reading Excel file (users.xlsx)...");

  const workbook = XLSX.readFile('./users.xlsx');
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  const rows = XLSX.utils.sheet_to_json<any>(sheet);

  const hashedPassword = await bcrypt.hash(TEMP_PASSWORD, 10);

  for (const row of rows) {
    const name = row.name?.trim();
    const email = row.email?.trim() || null;   // email optional
    const mobile = row.mobile?.toString().trim();
    const courseList = row.courseCode.toString().split(",").map((c: string) => c.trim());

    if (!name || !mobile || courseList.length === 0) {
      console.log("⛔ Skipping invalid row:", row);
      continue;
    }

    console.log(`\n➡ Processing user: ${name} (${mobile})`);

    // 1️⃣ Create or find User (email is optional)
    const user = await prisma.user_a.upsert({
      where: { mobile },
      update: {},
      create: {
        name,
        email,
        mobile,
        password: hashedPassword,
        tempPasswordUsed: true,
      },
    });

    // 2️⃣ Create UserCourse entries
    for (const courseCode of courseList) {
      await prisma.userCourse.upsert({
        where: {
          userId_courseCode: { userId: user.id, courseCode },
        },
        update: {},
        create: {
          userId: user.id,
          courseCode,
        },
      });
      console.log(`   ✔ Added access to course: ${courseCode}`);
    }
  }

  console.log("\n🎉 IMPORT COMPLETE!");
  await prisma.$disconnect();
}

// Run script
importUsers().catch((err) => {
  console.error(err);
  prisma.$disconnect();
  process.exit(1);
});
