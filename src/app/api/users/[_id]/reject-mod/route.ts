// app/api/users/[_id]/reject-mod/route.ts

import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongoose";
import UserModel from "@/models/users";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ _id: string }> }
) {
  try {
    await connectDB();

    const { _id } = await params;

    if (!_id) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    // Find the user and reject their moderator request
    const user = await UserModel.findById(_id);

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // Check if user has requested for mod
    if (!user.hasRequestedForMod) {
      return NextResponse.json(
        { error: "User has no pending moderator request" },
        { status: 400 }
      );
    }

    // Reject the request by setting hasRequestedForMod to false
    user.hasRequestedForMod = false;
    user.motivationForMod = ""; // Optional: Clear the motivation
    await user.save();

    return NextResponse.json(
      {
        success: true,
        message: "Moderator request rejected successfully",
        data: {
          _id: user._id,
          name: user.name,
          email: user.email,
          isMod: user.isMod,
          hasRequestedForMod: user.hasRequestedForMod,
        },
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error rejecting moderator request:", error);
    return NextResponse.json(
      { error: error.message || "Failed to reject moderator request" },
      { status: 500 }
    );
  }
}