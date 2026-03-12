import { useState } from "react";
import SearchForm from "@/components/SearchForm";
import RecipeCard from "@/components/RecipeCard";
import { AlertCircle } from "lucide-react";

interface Recipe {
  idMeal: string;
  strMeal: string;
  strMealThumb: string;
}

export default function Home() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (query: string, searchType: "name" | "ingredient") => {
    setIsLoading(true);
    setError(null);
    setHasSearched(true);

    try {
      let url = "";
      if (searchType === "name") {
        url = `https://www.themealdb.com/api/json/v1/1/search.php?s=${encodeURIComponent(
          query
        )}`;
      } else {
        url = `https://www.themealdb.com/api/json/v1/1/filter.php?i=${encodeURIComponent(
          query
        )}`;
      }

      const response = await fetch(url);
      const data = await response.json();

      if (data.meals) {
        setRecipes(data.meals);
      } else {
        setRecipes([]);
        setError(
          `No recipes found for "${query}". Try a different search term.`
        );
      }
    } catch (error) {
      console.error("Search failed:", error);
      setError("Failed to fetch recipes. Please try again.");
      setRecipes([]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-blue-50/30 dark:to-slate-900/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12 animate-fade-in">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="gradient-text">Find Your Next Favorite Recipe</span>
          </h1>
          <p className="text-lg text-muted-foreground">
            Search by dish name or ingredient to discover amazing recipes
          </p>
        </div>

        {/* Search Form */}
        <div className="mb-12 animate-slide-in">
          <SearchForm onSearch={handleSearch} isLoading={isLoading} />
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-8 flex items-center gap-4 glass rounded-xl p-4 border-l-4 border-destructive">
            <AlertCircle className="text-destructive flex-shrink-0" size={24} />
            <p className="text-destructive">{error}</p>
          </div>
        )}

        {/* Empty State */}
        {hasSearched && recipes.length === 0 && !error && !isLoading && (
          <div className="text-center py-16">
            <p className="text-xl text-muted-foreground">
              No recipes found. Try searching for something different!
            </p>
          </div>
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="text-center py-16">
            <div className="inline-block">
              <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
            <p className="text-muted-foreground mt-4">Searching for recipes...</p>
          </div>
        )}

        {/* Recipe Grid */}
        {recipes.length > 0 && (
          <div className="space-y-8 animate-fade-in">
            <p className="text-lg text-muted-foreground">
              Found <span className="font-bold text-foreground">{recipes.length}</span> recipe{recipes.length !== 1 ? "s" : ""}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {recipes.map((recipe) => (
                <RecipeCard
                  key={recipe.idMeal}
                  mealId={recipe.idMeal}
                  mealName={recipe.strMeal}
                  mealThumb={recipe.strMealThumb}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
