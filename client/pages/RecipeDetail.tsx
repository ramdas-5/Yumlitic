import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Bookmark, Clock, Users, AlertCircle } from "lucide-react";

interface Ingredient {
  name: string;
  measure: string;
}

interface RecipeFull {
  idMeal: string;
  strMeal: string;
  strCategory: string;
  strInstructions: string;
  strMealThumb: string;
  ingredients: Ingredient[];
}

export default function RecipeDetail() {
  const { mealId } = useParams<{ mealId: string }>();
  const navigate = useNavigate();
  const [recipe, setRecipe] = useState<RecipeFull | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [isSaved, setIsSaved] = useState(false);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);

  // Fetch recipe details
  useEffect(() => {
    const fetchRecipe = async () => {
      if (!mealId) return;

      try {
        const response = await fetch(
          `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealId}`
        );
        const data = await response.json();

        if (data.meals && data.meals.length > 0) {
          const meal = data.meals[0];
          const ingredients: Ingredient[] = [];

          // Extract ingredients and measurements
          for (let i = 1; i <= 20; i++) {
            const ingredient = meal[`strIngredient${i}`];
            const measure = meal[`strMeasure${i}`];
            if (ingredient && ingredient.trim()) {
              ingredients.push({
                name: ingredient,
                measure: measure || "to taste",
              });
            }
          }

          setRecipe({
            idMeal: meal.idMeal,
            strMeal: meal.strMeal,
            strCategory: meal.strCategory,
            strInstructions: meal.strInstructions,
            strMealThumb: meal.strMealThumb,
            ingredients,
          });
        } else {
          setError("Recipe not found");
        }
      } catch (err) {
        console.error("Fetch error:", err);
        setError("Failed to load recipe details");
      } finally {
        setIsLoading(false);
      }
    };

    fetchRecipe();
  }, [mealId]);

  // Check if user is logged in and if recipe is saved
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch("/api/auth/me", {
          credentials: "include",
        });
        if (response.ok) {
          const userData = await response.json();
          setUser(userData);

          // Check if recipe is saved
          if (userData && recipe) {
            const savedResponse = await fetch("/api/saved", {
              credentials: "include",
            });
            if (savedResponse.ok) {
              const savedData = await savedResponse.json();
              const isRecipeSaved = savedData.savedRecipes.some(
                (r: any) => r.mealId === recipe.idMeal
              );
              setIsSaved(isRecipeSaved);
            }
          }
        }
      } catch (error) {
        console.error("Auth check failed:", error);
      }
    };

    checkAuth();
  }, [recipe]);

  const handleSaveRecipe = async () => {
    if (!user || !recipe) return;

    setIsSaving(true);
    setSaveMessage(null);

    try {
      const response = await fetch("/api/saved", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          mealId: recipe.idMeal,
          mealName: recipe.strMeal,
          mealThumb: recipe.strMealThumb,
        }),
      });

      if (response.ok) {
        setIsSaved(true);
        setSaveMessage("Recipe saved successfully!");
        setTimeout(() => setSaveMessage(null), 3000);
      } else if (response.status === 409) {
        setSaveMessage("This recipe is already saved!");
        setTimeout(() => setSaveMessage(null), 3000);
      } else {
        setSaveMessage("Failed to save recipe. Please try again.");
      }
    } catch (error) {
      console.error("Save error:", error);
      setSaveMessage("Failed to save recipe. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-blue-50/30 dark:to-slate-900/20 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          </div>
          <p className="text-muted-foreground mt-4">Loading recipe...</p>
        </div>
      </div>
    );
  }

  if (error || !recipe) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-blue-50/30 dark:to-slate-900/20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="glass rounded-xl p-8 text-center flex items-center gap-4 justify-center">
            <AlertCircle className="text-destructive" size={24} />
            <div>
              <h2 className="text-xl font-bold text-destructive">Error</h2>
              <p className="text-muted-foreground">{error || "Recipe not found"}</p>
            </div>
          </div>
          <div className="text-center mt-8">
            <button
              onClick={() => navigate("/home")}
              className="btn-primary"
            >
              Back to Search
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-blue-50/30 dark:to-slate-900/20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Save Message */}
        {saveMessage && (
          <div className="mb-6 glass rounded-lg p-4 text-center animate-fade-in">
            <p
              className={
                saveMessage.includes("already saved") || saveMessage.includes("Failed")
                  ? "text-amber-600 dark:text-amber-400"
                  : "text-green-600 dark:text-green-400"
              }
            >
              {saveMessage}
            </p>
          </div>
        )}

        <div className="grid md:grid-cols-3 gap-8 animate-fade-in">
          {/* Image */}
          <div className="md:col-span-1">
            <div className="glass rounded-xl overflow-hidden sticky top-20">
              <img
                src={recipe.strMealThumb}
                alt={recipe.strMeal}
                className="w-full aspect-square object-cover"
              />
              {user && (
                <div className="p-4">
                  <button
                    onClick={handleSaveRecipe}
                    disabled={isSaving || isSaved}
                    className={`w-full py-3 rounded-lg font-semibold transition-all ${
                      isSaved
                        ? "btn-outline opacity-75"
                        : "btn-primary"
                    } disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2`}
                  >
                    <Bookmark size={18} fill={isSaved ? "currentColor" : "none"} />
                    {isSaving ? "Saving..." : isSaved ? "Saved" : "Save Recipe"}
                  </button>
                </div>
              )}
              {!user && (
                <div className="p-4 text-center text-sm text-muted-foreground">
                  <p>Login to save recipes</p>
                </div>
              )}
            </div>
          </div>

          {/* Details */}
          <div className="md:col-span-2 space-y-8">
            {/* Header */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-semibold">
                  {recipe.strCategory}
                </span>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                {recipe.strMeal}
              </h1>
              <p className="text-muted-foreground text-lg">
                A delicious {recipe.strCategory.toLowerCase()} recipe
              </p>
            </div>

            {/* Ingredients */}
            <div className="glass rounded-xl p-6">
              <h2 className="text-2xl font-bold mb-6">Ingredients</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                {recipe.ingredients.map((ingredient, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 p-3 bg-white/50 dark:bg-slate-800/50 rounded-lg"
                  >
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                      ✓
                    </div>
                    <div>
                      <p className="font-medium">{ingredient.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {ingredient.measure}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Instructions */}
            <div className="glass rounded-xl p-6">
              <h2 className="text-2xl font-bold mb-4">Instructions</h2>
              <div className="space-y-4">
                {recipe.strInstructions.split(". ").map((step, index) => (
                  <div key={index} className="flex gap-4">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 text-white flex items-center justify-center flex-shrink-0 font-bold text-sm">
                      {index + 1}
                    </div>
                    <p className="pt-1 text-foreground leading-relaxed">
                      {step.trim()}
                      {step !== recipe.strInstructions.split(". ")[recipe.strInstructions.split(". ").length - 1] && "."}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Back Button */}
        <div className="mt-12 text-center">
          <button
            onClick={() => navigate("/home")}
            className="btn-outline"
          >
            ← Back to Recipes
          </button>
        </div>
      </div>
    </div>
  );
}
