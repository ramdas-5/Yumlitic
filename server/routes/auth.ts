import { RequestHandler } from "express";
import { User, IUser } from "../models/User";

/**
 * POST /api/auth/signup
 * Creates a new user account
 * Body: { email: string, password: string, confirmPassword: string }
 * Returns: { message: string, userId: string }
 */
export const signup: RequestHandler = async (req, res) => {
  try {
    const { email, password, confirmPassword } = req.body;

    // Validate input
    if (!email || !password || !confirmPassword) {
      return res.status(400).json({ error: "All fields are required" });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ error: "Passwords do not match" });
    }

    if (password.length < 6) {
      return res
        .status(400)
        .json({ error: "Password must be at least 6 characters" });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ error: "Email already registered" });
    }

    // Create new user (password hashed by pre-save hook)
    const user = new User({
      email,
      password,
      savedRecipes: [],
    });

    await user.save();

    // Set session
    req.session.userId = user._id.toString();

    res.status(201).json({
      message: "Account created successfully",
      userId: user._id.toString(),
    });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ error: "Signup failed" });
  }
};

/**
 * POST /api/auth/login
 * Authenticates user and creates session
 * Body: { email: string, password: string }
 * Returns: { message: string, userId: string }
 */
export const login: RequestHandler = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    // Compare passwords
    const isValidPassword = await user.comparePassword(password);
    if (!isValidPassword) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    // Set session
    req.session.userId = user._id.toString();

    res.json({
      message: "Login successful",
      userId: user._id.toString(),
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Login failed" });
  }
};

/**
 * POST /api/auth/logout
 * Destroys user session
 * Returns: { message: string }
 */
export const logout: RequestHandler = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ error: "Logout failed" });
    }
    res.json({ message: "Logged out successfully" });
  });
};

/**
 * GET /api/auth/me
 * Returns current logged-in user info
 * Returns: { userId: string, email: string } or null if not logged in
 */
export const getCurrentUser: RequestHandler = async (req, res) => {
  try {
    if (!req.session.userId) {
      return res.json(null);
    }

    const user = await User.findById(req.session.userId).select(
      "email _id"
    );
    if (!user) {
      req.session.destroy(() => {});
      return res.json(null);
    }

    res.json({
      userId: user._id.toString(),
      email: user.email,
    });
  } catch (error) {
    console.error("Get current user error:", error);
    res.status(500).json({ error: "Failed to get current user" });
  }
};
