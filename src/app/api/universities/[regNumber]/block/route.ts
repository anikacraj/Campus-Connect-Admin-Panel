// src/app/api/universities/[regNumber]/block/route.ts
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongoose";
import University from "@/models/createUniversity";

// PATCH - Toggle Block/Unblock university
export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ regNumber: string }> }
) {
  try {
    await connectDB();
    const { regNumber } = await params;

    // Find current university
    const university = await University.findOne({ regNumber });

    if (!university) {
      return NextResponse.json(
        { error: "University not found" },
        { status: 404 }
      );
    }

    // Toggle block status
    const newBlockStatus = !university.block;

    // Update in database
    const updatedUniversity = await University.findOneAndUpdate(
      { regNumber },
      { $set: { block: newBlockStatus } },
      { new: true }
    );

    return NextResponse.json(
      {
        message: newBlockStatus ? "University blocked" : "University unblocked",
        data: updatedUniversity,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error updating block status:", error);
    return NextResponse.json(
      { error: "Failed to update block status", details: error.message },
      { status: 500 }
    );
  }
}