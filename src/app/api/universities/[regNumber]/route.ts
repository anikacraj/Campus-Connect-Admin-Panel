import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongoose";
import uniModel from "@/models/uni";

// Helper function to validate base64 images
function isValidBase64Image(str: string): boolean {
  if (!str) return true;
  return /^data:image\/(png|jpg|jpeg|gif|webp);base64,/.test(str);
}

// GET - Fetch single university by regNumber
export async function GET(
  req: Request,
  { params }: { params: Promise<{ regNumber: string }> }
) {
  try {
    await connectDB();
    const { regNumber } = await params;

    const university = await uniModel.findOne({ regNumber });
    if (!university) {
      return NextResponse.json(
        { error: "University not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ data: university }, { status: 200 });
  } catch (error: any) {
    console.error("❌ Error fetching university:", error);
    return NextResponse.json(
      { error: "Failed to fetch university", details: error.message },
      { status: 500 }
    );
  }
}

// PUT - Update university by regNumber
export async function PUT(
  req: Request,
  { params }: { params: Promise<{ regNumber: string }> }
) {
  try {
    await connectDB();
    const { regNumber } = await params;
    const body = await req.json();

    const {
      name,
      logo,
      coverImage,
      location,
      bio,
      website,
      estd,
      email,
      type,
    } = body;

    // Validate required fields
    if (!name || !email) {
      return NextResponse.json(
        { error: "Name and email are required." },
        { status: 400 }
      );
    }

    // Validate bio length
    if (bio !== undefined && bio.length < 20) {
      return NextResponse.json(
        { error: "Bio must be at least 20 characters." },
        { status: 400 }
      );
    }

    // Validate website URL
    if (website !== undefined && website) {
      try {
        new URL(website);
      } catch {
        return NextResponse.json(
          { error: "Invalid website URL format." },
          { status: 400 }
        );
      }
    }

    // Validate establishment year
    if (estd !== undefined && estd) {
      const year = parseInt(estd);
      const currentYear = new Date().getFullYear();
      if (isNaN(year) || year < 1000 || year > currentYear) {
        return NextResponse.json(
          { error: "Invalid establishment year." },
          { status: 400 }
        );
      }
    }

    // Validate images
    if (logo !== undefined && logo && !isValidBase64Image(logo)) {
      return NextResponse.json(
        { error: "Invalid logo image format." },
        { status: 400 }
      );
    }

    if (coverImage !== undefined && coverImage && !isValidBase64Image(coverImage)) {
      return NextResponse.json(
        { error: "Invalid cover image format." },
        { status: 400 }
      );
    }

    // Check if university exists
    const existingUniversity = await uniModel.findOne({ regNumber });
    if (!existingUniversity) {
      return NextResponse.json(
        { error: "University not found" },
        { status: 404 }
      );
    }

    // Check if email is being changed and already taken
    if (email !== existingUniversity.email) {
      const emailExists = await uniModel.findOne({
        email,
        regNumber: { $ne: regNumber },
      });

      if (emailExists) {
        return NextResponse.json(
          { error: "University with this email already exists." },
          { status: 400 }
        );
      }
    }

    // Prepare update data
    const updateData: any = {};
    if (name !== undefined) updateData.name = name;
    if (logo !== undefined) updateData.logo = logo;
    if (coverImage !== undefined) updateData.coverImage = coverImage;
    if (location !== undefined) updateData.location = location;
    if (bio !== undefined) updateData.bio = bio;
    if (website !== undefined) updateData.website = website;
    if (estd !== undefined) updateData.estd = estd;
    if (email !== undefined) updateData.email = email;
    if (type !== undefined) updateData.type = type;

    const updatedUniversity = await uniModel.findOneAndUpdate(
      { regNumber },
      { $set: updateData },
      { new: true, runValidators: true }
    );

    return NextResponse.json(
      {
        message: "✅ University updated successfully!",
        data: updatedUniversity,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("❌ Error updating university:", error);

    // Handle mongoose validation errors
    if (error.name === 'ValidationError') {
      return NextResponse.json(
        { error: "Validation failed", details: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Failed to update university.", details: error.message },
      { status: 500 }
    );
  }
}

// DELETE - Delete university by regNumber
export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ regNumber: string }> }
) {
  try {
    await connectDB();
    const { regNumber } = await params;

    const deletedUniversity = await uniModel.findOneAndDelete({
      regNumber
    });

    if (!deletedUniversity) {
      return NextResponse.json(
        { error: "University not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "✅ University deleted successfully!" },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("❌ Error deleting university:", error);
    return NextResponse.json(
      { error: "Failed to delete university.", details: error.message },
      { status: 500 }
    );
  }
}