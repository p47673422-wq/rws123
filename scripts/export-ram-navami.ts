import { PrismaClient } from "@prisma/client";
import ExcelJS from "exceljs";
import path from "path";

async function main() {
  const prisma = new PrismaClient();
  try {
    const target = "ram-navami-meditation-2025";

    // Try to resolve a Quiz by type (some deployments use slug as the quiz type)
    const quizByType = await prisma.quiz.findUnique({ where: { type: target } }).catch(() => null);

    // Find attempts where quizId equals the target slug OR matches the quiz id resolved above
    const attempts = await prisma.quizAttempt.findMany({
      where: {
        OR: [
          { quizId: target },
          ...(quizByType ? [{ quizId: quizByType.id }] : []),
        ],
      },
      include: { user: true },
      orderBy: { createdAt: "asc" },
    });

    if (!attempts.length) {
      console.log("No attempts found for quiz:", target);
      return;
    }

    // Group attempts by user
    const byUser = new Map<string, typeof attempts>();
    for (const a of attempts) {
      const uid = a.userId;
      if (!byUser.has(uid)) byUser.set(uid, [] as any);
      byUser.get(uid)!.push(a as any);
    }

    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet("Ram Navami Attempts");

    // Set two-column layout: left = field/attempt id, right = value/details
    sheet.columns = [
      { header: "Field/Attempt", key: "field", width: 30 },
      { header: "Value", key: "value", width: 100 },
    ];

    let rowCursor = 1;

    for (const [userId, userAttempts] of byUser.entries()) {
      const user = userAttempts[0].user;

      // User header (merged across A:B)
      sheet.mergeCells(rowCursor, 1, rowCursor, 2);
      const header = sheet.getRow(rowCursor);
      header.getCell(1).value = `User: ${user.name || "(no name)"} — ${user.mobile || "(no mobile)"}`;
      header.getCell(1).font = { bold: true } as any;
      header.getCell(1).alignment = { vertical: "middle", horizontal: "left" } as any;
      rowCursor += 1;

      // User meta rows
      sheet.getRow(rowCursor).values = ["User ID", user.id]; rowCursor += 1;
      sheet.getRow(rowCursor).values = ["Name", user.name ?? ""]; rowCursor += 1;
      sheet.getRow(rowCursor).values = ["Mobile", user.mobile ?? ""]; rowCursor += 1;
      sheet.getRow(rowCursor).values = ["Gender", user.gender ?? ""]; rowCursor += 1;
      sheet.getRow(rowCursor).values = ["Address", user.address ?? ""]; rowCursor += 1;
      sheet.getRow(rowCursor).values = ["CreatedAt", user.createdAt?.toISOString?.() ?? String(user.createdAt)];
      rowCursor += 2; // spacer

      // Attempts header
      sheet.getRow(rowCursor).values = ["Attempt ID", "Created At / Score / Reward / Answers"];
      sheet.getRow(rowCursor).font = { bold: true } as any;
      rowCursor += 1;

      for (const att of userAttempts) {
        const answers = typeof att.answers === "string" ? att.answers : JSON.stringify(att.answers || {}, null, 2);
        const created = att.createdAt ? new Date(att.createdAt).toISOString() : String(att.createdAt);
        const summary = `Created: ${created}  |  Score: ${att.score ?? ""}  |  Reward: ${att.reward ?? ""}`;

        const r = sheet.getRow(rowCursor);
        r.getCell(1).value = att.id;
        r.getCell(2).value = `${summary}\n\n${answers}`;
        r.getCell(2).alignment = { wrapText: true, vertical: "top" } as any;
        rowCursor += 1;
      }

      // Spacer row between users
      rowCursor += 1;
    }

    const outPath = path.resolve(process.cwd(), "ram-navami-attempts.xlsx");
    await workbook.xlsx.writeFile(outPath);
    console.log("Wrote Excel file:", outPath);
  } catch (err) {
    console.error(err);
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
