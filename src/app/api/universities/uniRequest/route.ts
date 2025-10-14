import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongoose";
import University from "@/models/createUniversity";
import uniModel from "@/models/uni";

export async function GET() {
  try {
    await connectDB();
    const universities = await uniModel.find({status:"pending"}).sort({ createdAt: -1 });
    return NextResponse.json({ data: universities }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { error: "Failed to fetch universities", details: error.message },
      { status: 500 }
    );
  }
}
