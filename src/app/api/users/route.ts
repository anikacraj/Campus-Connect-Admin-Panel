import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongoose";
import University from "@/models/createUniversity";
import UserModel from "@/models/users";

// GET - Fetch single university by regNumber
export async function GET() {
  try {
    await connectDB();
    const users = await UserModel.find({}).sort({ createdAt: -1 });
    console.log(users)
    return NextResponse.json({ data: users }, { status: 200 });
    console.log(users)
  } catch (error: any) {
    return NextResponse.json(
      { error: "Failed to fetch universities", details: error.message },
      { status: 500 }
    );
  }
}
