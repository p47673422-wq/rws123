import { NextResponse } from "next/server";
// Dummy API for store team
export async function GET() {
  // Return list of team members
  return NextResponse.json([
    { name: "Amit", phone: "9876543210", role: "Distributor", joinDate: "2024-01-10", status: "Active" },
    { name: "Sita", phone: "9876543211", role: "Distributor", joinDate: "2024-03-15", status: "Inactive" },
  ]);
}

export async function PATCH(request: Request) {
  // Update team member status, send reminder, etc.
  return NextResponse.json({ success: true });
}
