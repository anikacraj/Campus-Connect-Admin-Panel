//src\app\api\users\[_id]\revoke-mod\route.ts

import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongoose";
import UserModel from "@/models/users";


export async function PATCH(
  request: NextRequest,
  { params }: { params: { _id: string } }
) {
  try {
    await connectDB();

    const { _id } = params;

    if (!_id) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    // Find the user and revoke moderator status
    const user = await UserModel.findByIdAndUpdate(
      _id,
      {
        isMod: false,
        hasRequestedForMod: false,
      },
      { new: true, runValidators: true }
    );

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Moderator status revoked successfully",
        data: user,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error revoking moderator:", error);
    return NextResponse.json(
      {
        error: error.message || "Failed to revoke moderator status",
      },
      { status: 500 }
    );
  }
}