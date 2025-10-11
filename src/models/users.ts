import mongoose, { Schema, Document, Types } from "mongoose";

/* --- TS interfaces for clarity --- */
export type UserStatus = "pending" | "approved" | "rejected";

export interface ISocialLink {
  id: string;
  platform: string;
  url: string;
}

export interface ICPProfile {
  id: string;
  platform: string;
  username: string;
  profileUrl: string;
}

export interface ISkill {
  id: string;
  name: string;
  level: "Beginner" | "Intermediate" | "Advanced" | "Expert";
}

export interface IProject {
  id: string;
  name: string;
  description: string;
  techStack: string[];
  githubUrl: string;
  liveUrl: string;
  imageUrl?: string;
}

export interface IResearch {
  id: string;
  title: string;
  description: string;
  publicationUrl: string;
  publishedDate: string;
}

export interface IUserProfileData {
  name: string;
  profilePhoto: string | null;
  profilePhotoPreview: string | null;
  university: string; // regNumber or identifier string
  session: string;
  bio: string;
  socialLinks: ISocialLink[];
  cpProfiles: ICPProfile[];
  skills: ISkill[];
  projects: IProject[];
  research: IResearch[];
  status?: UserStatus;
  rollNumber: string;
}

/* --- Mongoose Document interface --- */
export interface IUser extends Document, IUserProfileData {
  uid: string;
  email?: string;
  isBanned?: boolean;
  isMod?: boolean;
  uniObjectID?: Types.ObjectId | null;
}

/* --- Sub-schemas --- */
const SocialLinkSchema = new Schema<ISocialLink>(
  {
    id: { type: String, required: true },
    platform: { type: String, required: true },
    url: { type: String, required: true },
  },
  { _id: false }
);

const CPProfileSchema = new Schema<ICPProfile>(
  {
    id: { type: String, required: true },
    platform: { type: String, required: true },
    username: { type: String, required: true },
    profileUrl: { type: String, required: true },
  },
  { _id: false }
);

const SkillSchema = new Schema<ISkill>(
  {
    id: { type: String, required: true },
    name: { type: String, required: true },
    level: {
      type: String,
      enum: ["Beginner", "Intermediate", "Advanced", "Expert"],
      required: true,
    },
  },
  { _id: false }
);

const ProjectSchema = new Schema<IProject>(
  {
    id: { type: String, required: true },
    name: { type: String, required: true },
    description: { type: String, required: true },
    techStack: { type: [String], required: true, default: [] },
    githubUrl: { type: String, required: true },
    liveUrl: { type: String, required: true },
    imageUrl: { type: String, required: false },
  },
  { _id: false }
);

const ResearchSchema = new Schema<IResearch>(
  {
    id: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    publicationUrl: { type: String, required: true },
    publishedDate: { type: String, required: true },
  },
  { _id: false }
);

/* --- Main user schema --- */
const userSchema: Schema = new mongoose.Schema(
  {
    uid: {
      type: String,
      required: true,
      unique: true,
    },

    // existing/administrative fields
    name: {
      type: String,
      required: false,
      default: "Anon",
    },
    email: {
      type: String,
      required: true,
      default: "",
    },
    isBanned: {
      type: Boolean,
      required: false,
      default: false,
    },
    isMod: {
      type: Boolean,
      required: false,
      default: false,
    },
    hasRequestedForMod: {
      type: Boolean,
      required: false,
      default: false,
    },
    motivationForMod: {
      type: String,
      required: false,
      default: "",
    },
    

    // optional reference to university document
    uniObjectID: {
      type: Schema.Types.ObjectId,
      required: false,
      default: null,
      ref: "unis",
    },

    /* --- New profile fields from UserProfileData --- */
    profilePhoto: { type: String, required: false, default: null },
    profilePhotoPreview: { type: String, required: false, default: null },

    // store university as regNumber or string identifier (keeps backward compat)
    university: { type: String, required: false, default: "" },

    session: { type: String, required: false, default: "" },

    bio: { type: String, required: false, default: "" },

    socialLinks: { type: [SocialLinkSchema], default: [] },

    cpProfiles: { type: [CPProfileSchema], default: [] },

    skills: { type: [SkillSchema], default: [] },

    projects: { type: [ProjectSchema], default: [] },

    research: { type: [ResearchSchema], default: [] },

    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "approved",
    },

    rollNumber: { type: String, required: false, default: "" },
  },
  { timestamps: true }
);

/* Optional indexes */
// If you want rollNumber unique within a university, create a compound index later in your app:
// userSchema.index({ university: 1, rollNumber: 1 }, { unique: true, sparse: true });

/* --- Model export --- */
const UserModel = mongoose.models.User || mongoose.model<IUser>("User", userSchema);
export default UserModel;
