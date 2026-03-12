import { RequestHandler } from "express";
import { User } from "../models/User";

/**
 * GET /api/saved
 * Returns all saved recipes for the logged-in user
 * Protected route - requires authentication
 * Returns: { savedRecipes: Array<{mealId, mealName, mealThumb}> }
 */
export const getSavedRecipes: RequestHandler = async (req, res) => {
  try {
    const user = await User.findById(req.session.userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({ savedRecipes: user.savedRecipes });
  } catch (error) {
    console.error("Get saved recipes error:", error);
    res.status(500).json({ error: "Failed to get saved recipes" });
  }
};

/**
 * POST /api/saved
 * Adds a recipe to the user's saved recipes
 * Protected route - requires authentication
 * Body: { mealId: string, mealName: string, mealThumb: string }
 * Returns: { message: string, savedRecipes: Array }
 */
export const saveRecipe: RequestHandler = async (req, res) => {
  try {
    const { mealId, mealName, mealThumb } = req.body;

    if (!mealId || !mealName || !mealThumb) {
      return res
        .status(400)
        .json({ error: "mealId, mealName, and mealThumb are required" });
    }

    const user = await User.findById(req.session.userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Check if recipe already saved
    const alreadySaved = user.savedRecipes.some((recipe) => recipe.mealId === mealId);
    if (alreadySaved) {
      return res.status(409).json({ error: "Recipe already saved" });
    }

    // Add to savedRecipes
    user.savedRecipes.push({
      mealId,
      mealName,
      mealThumb,
    });

    await user.save();

    res.status(201).json({
      message: "Recipe saved successfully",
      savedRecipes: user.savedRecipes,
    });
  } catch (error) {
    console.error("Save recipe error:", error);
    res.status(500).json({ error: "Failed to save recipe" });
  }
};

/**
 * DELETE /api/saved/:mealId
 * Removes a recipe from the user's saved recipes
 * Protected route - requires authentication
 * Returns: { message: string, savedRecipes: Array }
 */
export const deleteRecipe: RequestHandler = async (req, res) => {
  try {
    const { mealId } = req.params;

    const user = await User.findById(req.session.userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Remove recipe from savedRecipes
    user.savedRecipes = user.savedRecipes.filter(
      (recipe) => recipe.mealId !== mealId
    );

    await user.save();

    res.json({
      message: "Recipe removed successfully",
      savedRecipes: user.savedRecipes,
    });
  } catch (error) {
    console.error("Delete recipe error:", error);
    res.status(500).json({ error: "Failed to delete recipe" });
  }
};
