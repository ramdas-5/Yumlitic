import "dotenv/config";
import express, { Request, Response } from "express";
import cors from "cors";
import session from "express-session";
import MongoStore from "connect-mongo";
import { connectDB } from "./config/db";
import { handleDemo } from "./routes/demo";
import * as authRoutes from "./routes/auth";
import * as savedRecipesRoutes from "./routes/saved-recipes";
import { requireAuth } from "./middleware/auth";

/**
 * Extend Express Session to include userId
 */
declare global {
  namespace Express {
    interface Session {
      userId?: string;
    }
  }
}

let dbConnected = false;
let dbConnecting = false;

/**
 * Initialize database connection asynchronously
 * This will be called when needed, not at startup
 */
async function ensureDBConnected() {
  if (!process.env.MONGODB_URI) {
    console.warn(
      "⚠ MONGODB_URI not configured. Auth features will not work. Set MONGODB_URI in .env to enable."
    );
    return;
  }

  if (dbConnected || dbConnecting) {
    return;
  }

  dbConnecting = true;
  try {
    await connectDB();
    dbConnected = true;
  } catch (error) {
    console.error("Failed to connect to MongoDB:", error);
    dbConnecting = false;
  }
}

export function createServer() {
  const app = express();

  // Session configuration
  const sessionSecret = process.env.SESSION_SECRET || "your-secret-key-change-this";
  const mongoUri = process.env.MONGODB_URI;
  const isProduction = process.env.NODE_ENV === "production";

  // Session store configuration
  // In development without MongoDB, use memory store
  // In production, MongoDB store is required
  let sessionStore: any = undefined;

  if (mongoUri && mongoUri !== "mongodb+srv://test:test@localhost/yumlytic") {
    try {
      sessionStore = new MongoStore({
        mongoUrl: mongoUri,
        touchAfter: 24 * 3600, // Lazy session update
      });
    } catch (error) {
      console.warn("Could not initialize MongoDB session store:", error);
    }
  }

  // If no store was created (no valid MongoDB URI), sessions will be stored in memory
  const sessionConfig: any = {
    secret: sessionSecret,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: isProduction, // HTTPS only in production
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
      sameSite: "lax" as const,
    },
  };

  if (sessionStore) {
    sessionConfig.store = sessionStore;
  }

  app.use(session(sessionConfig));

  // Middleware
  app.use(
    cors({
      origin: ["http://localhost:3000", "http://localhost:5173"],
      credentials: true,
    })
  );
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Middleware to ensure DB is connected for API routes
  app.use("/api/", async (req, res, next) => {
    await ensureDBConnected();
    next();
  });

  // Auth routes (public)
  app.post("/api/auth/signup", authRoutes.signup);
  app.post("/api/auth/login", authRoutes.login);
  app.post("/api/auth/logout", authRoutes.logout);
  app.get("/api/auth/me", authRoutes.getCurrentUser);

  // Saved recipes routes (protected)
  app.get("/api/saved", requireAuth, savedRecipesRoutes.getSavedRecipes);
  app.post("/api/saved", requireAuth, savedRecipesRoutes.saveRecipe);
  app.delete("/api/saved/:mealId", requireAuth, savedRecipesRoutes.deleteRecipe);

  // Example API routes
  app.get("/api/ping", (_req, res) => {
    const ping = process.env.PING_MESSAGE ?? "ping";
    res.json({ message: ping });
  });

  app.get("/api/demo", handleDemo);

  return app;
}
