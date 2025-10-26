import mongoose, { Schema, Document } from "mongoose";

export interface IUni extends Document {
  uid: string;
  name?: string;
  estd?: number | string;
  location?: string;
  type?: string;
  website?: string;
  bio?: string;
  email?: string;
  regNumber?: string;
  logo?: string | null; // base64 data URL
  coverImage?: string | null; // base64 data URL
  totalStudents?: number;
  reqBy: string; // user ID who made the request
  status?: "pending" | "approved" | "rejected" | "updating";
  createdAt: Date;
  updatedAt: Date;
}

const uniSchema: Schema = new mongoose.Schema(
  {
    uid: {
      type: String,
      unique: true,
      default: () => new mongoose.Types.ObjectId().toHexString(), // auto-generated if not provided
    },
    name: {
      type: String,
      required: false,
      trim: true,
      default: "Anon",
    },
    estd: {
      type: Schema.Types.Mixed, // number or string (keeps flexibility if you wish to store '1960' or 'c. 1960')
      required: false,
    },
    location: {
      type: String,
      required: false,
      trim: true,
      default: "",
    },
    type: {
      type: String,
      required: false,
      trim: true,
      default: "",
    },
    website: {
      type: String,
      required: true,
      trim: true,
      default: "",
    },
    bio: {
      type: String,
      required: false,
      default: "",
    },
    email: {
      type: String,
      required: false,
      trim: true,
      default: "",
      index: true,
    },
    regNumber: {
      type: String,
      required: false,
      trim: true,
      default: "",
    },
    logo: {
      type: String, // storing data URL (e.g., "data:image/png;base64,...")
      required: false,
      default: null,
    },
    coverImage: {
      type: String, // storing data URL (e.g., "data:image/png;base64,...")
      required: false,
      default: null,
    },
    totalStudents: {
      type: Number,
      required: false,
      default: 0,
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected", "updating"],
      default: "pending",
        },
    reqBy: {
      type: String,
      required: true,
    },
    updateRequested: {
      type: String,
      required: false,
      default: null,
    }

    
  },
  { timestamps: true }
);

uniSchema.index({ status: 1, createdAt: -1 });
uniSchema.index({ regNumber: 1 }, { unique: true });
uniSchema.index({ name: 'text' });

// Use the collection name "unis" (you can change to "universities")
const uniModel = mongoose.models.Uni || mongoose.model<IUni>("Uni", uniSchema);

export default uniModel;
