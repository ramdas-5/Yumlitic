import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import RecipeCard from "@/components/RecipeCard";
import { AlertCircle, Bookmark } from "lucide-react";

interface SavedRecipe {
  mealId: string;
  mealName: string;
  mealThumb: string;
}

export default function SavedRecipes() {
  const [recipes, setRecipes] = useState<SavedRecipe[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);
  const navigate = useNavigate();

  // Check auth and fetch saved recipes
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Check if user is logged in
        const authResponse = await fetch("/api/auth/me", {
          credentials: "include",
        });

        if (!authResponse.ok) {
          // Not logged in, redirect to login
          navigate("/login");
          return;
        }

        const userData = await authResponse.json();
        if (!userData) {
          navigate("/login");
          return;
        }

        setUser(userData);

        // Fetch saved recipes
        const recipesResponse = await fetch("/api/saved", {
          credentials: "include",
        });

        if (!recipesResponse.ok) {
          throw new Error("Failed to fetch saved recipes");
        }

        const data = await recipesResponse.json();
        setRecipes(data.savedRecipes || []);
      } catch (err) {
        console.error("Error:", err);
        setError("Failed to load saved recipes");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [navigate]);

  const handleDelete = async (mealId: string) => {
    if (!window.confirm("Are you sure you want to remove this recipe?")) {
      return;
    }

    try {
      const response = await fetch(`/api/saved/${mealId}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (response.ok) {
        setRecipes(recipes.filter((r) => r.mealId !== mealId));
      } else {
        setError("Failed to delete recipe");
      }
    } catch (err) {
      console.error("Delete error:", err);
      setError("Failed to delete recipe");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-blue-50/30 dark:to-slate-900/20 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          </div>
          <p className="text-muted-foreground mt-4">Loading your saved recipes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-blue-50/30 dark:to-slate-900/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12 animate-fade-in">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Bookmark className="text-primary" size={32} />
            <h1 className="text-4xl md:text-5xl font-bold">
              <span className="gradient-text">Your Saved Recipes</span>
            </h1>
          </div>
          <p className="text-lg text-muted-foreground">
            {recipes.length} recipe{recipes.length !== 1 ? "s" : ""} saved
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-8 flex items-center gap-4 glass rounded-xl p-4 border-l-4 border-destructive">
            <AlertCircle className="text-destructive flex-shrink-0" size={24} />
            <p className="text-destructive">{error}</p>
          </div>
        )}

        {/* Empty State */}
        {recipes.length === 0 && (
          <div className="text-center py-16">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-6">
              <Bookmark className="text-primary" size={32} />
            </div>
            <h2 className="text-2xl font-bold mb-3">No Saved Recipes Yet</h2>
            <p className="text-muted-foreground mb-8 max-w-md mx-auto">
              Start exploring recipes and save your favorites to view them here
            </p>
            <a href="/home" className="btn-primary inline-block">
              Browse Recipes →
            </a>
          </div>
        )}

        {/* Recipe Grid */}
        {recipes.length > 0 && (
          <div className="animate-fade-in">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {recipes.map((recipe) => (
                <div key={recipe.mealId} className="relative group">
                  <RecipeCard
                    mealId={recipe.mealId}
                    mealName={recipe.mealName}
                    mealThumb={recipe.mealThumb}
                    isSaved={true}
                  />
                  {/* Delete Button - appears on hover */}
                  <button
                    onClick={() => handleDelete(recipe.mealId)}
                    className="absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity bg-destructive hover:bg-destructive/90 text-white px-3 py-1 rounded-lg text-sm font-semibold"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
