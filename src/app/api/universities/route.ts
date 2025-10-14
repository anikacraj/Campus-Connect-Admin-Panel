import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongoose";
import University from "@/models/createUniversity";
import uniModel from "@/models/uni";

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
      email, // Changed from 'email' to match your frontend
      type = "",
      regNumber = "",
      reqBy = "admin", // Add default value for reqBy
    } = body;

    if (!name || !regNumber || !email) {
      return NextResponse.json(
        { error: "Name, registration number, and email are required." },
        { status: 400 }
      );
    }

    // const existingProfile = await uniModel.findOne({regNumber} );
    // if (existingProfile) {
    //   return NextResponse.json(
    //     { error: "University with this email already exists." },
    //     { status: 400 }
    //   );
    // }

    const newUniversity = await uniModel.create({
      name,
      logo,
      coverImage,
      location,
      bio,
      website,
      estd,
      email, // Changed from 'email'
      type,
      regNumber,
      reqBy, // Add reqBy field
      status: "approved", // Set status directly
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
    const universities = await uniModel.find({status:"approved"}).sort({ createdAt: -1 });
    return NextResponse.json({ data: universities }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { error: "Failed to fetch universities", details: error.message },
      { status: 500 }
    );
  }
}


