//src\app\api\universities\route.ts

import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongoose";
import University from "@/models/createUniversity";

// POST - Create new university
export async function POST(req: Request) {
  try {
    await connectDB();
    const body = await req.json();

    const {
      name,
      logo = "",
      coverImage = "",
      location = "",
      bio = "",
      website = "",
      estd = 0,
      varsityEmail,
      type = "",
      regNumber = "",
      block=false,
    } = body;

    if (!name || !varsityEmail) {
      return NextResponse.json(
        { error: "Name and varsityEmail are required." },
        { status: 400 }
      );
    }

    const existingProfile = await University.findOne({ varsityEmail });
    if (existingProfile) {
      return NextResponse.json(
        { error: "University with this email already exists." },
        { status: 400 }
      );
    }

    const newUniversity = await University.create({
      name,
      logo,
      coverImage,
      location,
      bio,
      website,
      estd,
      varsityEmail,
      type,
      regNumber,
      block
    });

    return NextResponse.json(
      { message: "✅ University created successfully!", data: newUniversity },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("❌ Error creating university:", error);
    return NextResponse.json(
      { error: "Failed to create university.", details: error.message },
      { status: 500 }
    );
  }
}

// GET - Fetch all universities
export async function GET() {
  try {
    await connectDB();
    const universities = await University.find({}).sort({ createdAt: -1 });
    return NextResponse.json({ data: universities }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { error: "Failed to fetch universities", details: error.message },
      { status: 500 }
    );
  }
}


