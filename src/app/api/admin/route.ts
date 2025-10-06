import { connectDB } from "@/lib/mongoose";
import Admin from "@/models/admin";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
try {
    await connectDB();
    const {email, password} = await request.json();
    // const admin = await Admin.findOne({ email, password });
    // if (admin) {
    //     return NextResponse.json({ message: "Login successful" }, { status: 200 });
    // } else {
    //     return NextResponse.json({ message: "Invalid email or password" }, { status: 401 });
    // }

    const admin= new Admin({email,password});
    await admin.save();
    return NextResponse.json({ message: "Admin created successfully" }, { status: 201 });
} catch (error) {
    console.log("Error in admin login:", error);
}
}