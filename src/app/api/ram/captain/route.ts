import { NextResponse } from "next/server";
// Dummy API for captain dashboard
export async function GET() {
  return NextResponse.json({
    stats: {
      totalDistributors: 12,
      activeThisWeek: 8,
      totalScore: 1200,
      totalPendingDues: 25000,
      performanceOverTime: [
        { date: "Oct 20", score: 200 },
        { date: "Oct 21", score: 220 },
        { date: "Oct 22", score: 250 },
        { date: "Oct 23", score: 300 },
        { date: "Oct 24", score: 230 },
      ],
    },
    team: [
      { name: "Amit", score: 120, ordersThisMonth: 10, pendingDues: 8000, inventoryValue: 5000, lastActive: "2025-10-25" },
      { name: "Sita", score: 110, ordersThisMonth: 8, pendingDues: 3000, inventoryValue: 4000, lastActive: "2025-10-24" },
      { name: "Ram", score: 40, ordersThisMonth: 2, pendingDues: 0, inventoryValue: 2000, lastActive: "2025-10-20" },
    ],
  });
}
