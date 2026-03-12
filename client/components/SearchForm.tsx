import { useState } from "react";
import { Search } from "lucide-react";

interface SearchFormProps {
  onSearch: (query: string, searchType: "name" | "ingredient") => void;
  isLoading?: boolean;
}

export default function SearchForm({ onSearch, isLoading = false }: SearchFormProps) {
  const [query, setQuery] = useState("");
  const [searchType, setSearchType] = useState<"name" | "ingredient">("name");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim(), searchType);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="glass rounded-xl p-6 space-y-4">
        {/* Search Type Tabs */}
        <div className="flex gap-4 border-b border-border">
          <button
            type="button"
            onClick={() => setSearchType("name")}
            className={`pb-3 font-semibold transition-colors ${
              searchType === "name"
                ? "border-b-2 border-primary text-primary"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Search by Dish Name
          </button>
          <button
            type="button"
            onClick={() => setSearchType("ingredient")}
            className={`pb-3 font-semibold transition-colors ${
              searchType === "ingredient"
                ? "border-b-2 border-primary text-primary"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Search by Ingredient
          </button>
        </div>

        {/* Search Input */}
        <div className="flex gap-3">
          <div className="flex-1 relative">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={
                searchType === "name"
                  ? "e.g., Pizza, Pasta, Cake..."
                  : "e.g., Tomato, Chicken, Garlic..."
              }
              className="input-field"
            />
            <Search
              className="absolute right-3 top-3 text-muted-foreground pointer-events-none"
              size={20}
            />
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "Searching..." : "Search"}
          </button>
        </div>

        <p className="text-sm text-muted-foreground">
          {searchType === "name"
            ? "Enter a dish name to find recipes"
            : "Enter an ingredient to find recipes containing it"}
        </p>
      </div>
    </form>
  );
}
