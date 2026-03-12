import mongoose, { Schema, Document } from "mongoose";
import bcryptjs from "bcryptjs";

/**
 * SavedRecipe interface - represents a recipe saved by the user
 */
interface SavedRecipe {
  mealId: string;
  mealName: string;
  mealThumb: string;
}

/**
 * User document interface extending Mongoose Document
 */
export interface IUser extends Document {
  email: string;
  password: string;
  savedRecipes: SavedRecipe[];
  comparePassword(password: string): Promise<boolean>;
}

/**
 * User schema definition
 * - Email is unique and required
 * - Password is hashed before saving (via pre-save hook)
 * - savedRecipes is an embedded array of recipe objects
 */
const UserSchema = new Schema<IUser>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    },
    password: {
      type: String,
      required: true,
    },
    savedRecipes: [
      {
        mealId: String,
        mealName: String,
        mealThumb: String,
      },
    ],
  },
  { timestamps: true }
);

/**
 * Pre-save hook to hash password before storing
 * Only hash if password is modified (new user or password change)
 */
UserSchema.pre<IUser>("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }

  try {
    const salt = await bcryptjs.genSalt(10);
    this.password = await bcryptjs.hash(this.password, salt);
    next();
  } catch (error) {
    next(error as any);
  }
});

/**
 * Instance method to compare password
 * Used during login to verify password matches stored hash
 */
UserSchema.methods.comparePassword = async function (
  password: string
): Promise<boolean> {
  return bcryptjs.compare(password, this.password);
};

/**
 * Create and export User model
 */
export const User = mongoose.model<IUser>("User", UserSchema);
