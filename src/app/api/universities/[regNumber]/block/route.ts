// src/app/api/universities/[regNumber]/block/route.ts
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongoose";
import University from "@/models/createUniversity";
import uniModel from "@/models/uni";

// PATCH - Toggle Block/Unblock university
export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ regNumber: string }> }
) {
  try {
    await connectDB();
    const { regNumber } = await params;

    // Find current university
    const university = await uniModel.findOne({ regNumber });

    if (!university) {
      return NextResponse.json(
        { error: "University not found" },
        { status: 404 }
      );
    }

    if (university.status === 'approved') {
      university.status = 'pending';
    } else if (university.status === 'pending') {
      university.status = 'approved';
    }

    await university.save();

    return NextResponse.json(
      {
        message: `University has been ${university.status === 'approved' ? 'unblocked' : 'blocked'} successfully.`,
        data: university,
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