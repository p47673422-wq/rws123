import { PrismaClient } from '@prisma/client';
import ExcelJS from 'exceljs';

const prisma = new PrismaClient();

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const tablesParam = url.searchParams.get('tables'); // optional comma-separated table list

    // No auth required for quick export (intentionally left open per user request)

    let tables: string[] = [];

    if (tablesParam) {
      tables = tablesParam.split(',').map((s) => s.trim()).filter(Boolean);
    } else {
      const res: Array<{ table_name: string }> = await prisma.$queryRaw`
        SELECT table_name FROM information_schema.tables
        WHERE table_schema = 'public' AND table_type = 'BASE TABLE'
      ` as any;
      tables = res.map((r) => r.table_name).filter((t) => t !== '_prisma_migrations');
    }

    const workbook = new ExcelJS.Workbook();

    for (const table of tables) {
      // Fetch all rows from the table
      const rows: any[] = await prisma.$queryRawUnsafe(`SELECT * FROM "${table}"`);

      // Excel sheet names max length 31
      const sheetName = table.length > 31 ? table.slice(0, 31) : table;
      const ws = workbook.addWorksheet(sheetName);

      if (!rows || rows.length === 0) {
        ws.addRow(["(no rows)"]);
        continue;
      }

      // Determine union of keys across rows
      const keySet = new Set<string>();
      for (const r of rows) Object.keys(r || {}).forEach((k) => keySet.add(k));
      const keys = Array.from(keySet);

      ws.columns = keys.map((k) => ({ header: k, key: k, width: 30 }));

      for (const r of rows) {
        const rowObj: Record<string, any> = {};
        for (const k of keys) {
          const v = r[k];
          if (v === null || v === undefined) rowObj[k] = '';
          else if (typeof v === 'object') rowObj[k] = JSON.stringify(v);
          else rowObj[k] = String(v);
        }
        ws.addRow(rowObj);
      }
    }

    const buffer = await workbook.xlsx.writeBuffer();

    return new Response(buffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': 'attachment; filename="db-export.xlsx"',
      },
    });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: String(err) }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  } finally {
    await prisma.$disconnect();
  }
}
