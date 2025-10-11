import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongoose";
import UserModel from "@/models/users";
import { sendBanNotificationEmail } from "@/lib/email";

export async function PATCH(
  req: Request,
  context: { params: Promise<{ _id: string }> }
) {
  try {
    await connectDB();
    const { _id } = await context.params;

    // Find student by MongoDB _id
    const student = await UserModel.findById(_id);
    
    if (!student) {
      return NextResponse.json(
        { error: "Student not found" },
        { status: 404 }
      );
    }

    // Toggle the ban status - handle both 'banned' and 'isBanned' field names
    const currentBanStatus = student.isBanned ?? student.banned ?? false;
    const newBanStatus = !currentBanStatus;

    // Update in database (use both field names to ensure compatibility)
    const updatedStudent = await UserModel.findByIdAndUpdate(
      _id,
      { 
        $set: { 
          isBanned: newBanStatus,
          banned: newBanStatus  // Add this if your model uses 'banned'
        } 
      },
      { new: true }
    );

    if (!updatedStudent) {
      return NextResponse.json(
        { error: "Failed to update student" },
        { status: 500 }
      );
    }

    // Send email notification
    try {
      await sendBanNotificationEmail({
        to: updatedStudent.email,
        studentName: updatedStudent.name,
        isBanned: newBanStatus,
      });
      console.log(`✅ Email sent to ${updatedStudent.email}`);
    } catch (emailError: any) {
      console.error("⚠️ Email sending failed:", emailError.message);
      // Don't fail the request if email fails
    }

    return NextResponse.json(
      {
        message: newBanStatus ? "Student banned successfully" : "Student unbanned successfully",
        data: {
          ...updatedStudent.toObject(),
          isBanned: newBanStatus  // Ensure frontend gets the correct field
        },
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error updating ban status:", error);
    return NextResponse.json(
      { error: "Failed to update ban status", details: error.message },
      { status: 500 }
    );
  }
} 