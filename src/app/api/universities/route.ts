import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongoose";
import uniModel from "@/models/uni";

// GET - Fetch all universities with pagination and filtering
export async function GET(request: Request) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');
    const status = searchParams.get('status');
    
    const skip = (page - 1) * limit;
    
    // Build filter
    let filter = {};
    if (status && status !== 'all') {
      filter = { status };
    }
    
    // Get universities with pagination
    const universities = await uniModel
      .find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
    
    // Get total count for pagination
    const total = await uniModel.countDocuments(filter);
    const totalPages = Math.ceil(total / limit);
    
    return NextResponse.json({ 
      data: universities,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1
      }
    }, { status: 200 });
    
  } catch (error: any) {
    console.error("❌ Error fetching universities:", error);
    return NextResponse.json(
      { error: "Failed to fetch universities", details: error.message },
      { status: 500 }
    );
  }
}

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
      email,
      type = "",
      regNumber = "",
      reqBy = "admin",
    } = body;

    if (!name || !regNumber || !email) {
      return NextResponse.json(
        { error: "Name, registration number, and email are required." },
        { status: 400 }
      );
    }

    // Check if university already exists
    const existingUniversity = await uniModel.findOne({ regNumber });
    if (existingUniversity) {
      return NextResponse.json(
        { error: "University with this registration number already exists." },
        { status: 400 }
      );
    }

    const newUniversity = await uniModel.create({
      name,
      logo,
      coverImage,
      location,
      bio,
      website,
      estd,
      email,
      type,
      regNumber,
      reqBy,
      status: "pending", // Default status
    });

    return NextResponse.json(
      { 
        message: "✅ University created successfully!", 
        data: newUniversity 
      },
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