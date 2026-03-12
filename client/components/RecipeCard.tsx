import { Link } from "react-router-dom";
import { Bookmark } from "lucide-react";

interface RecipeCardProps {
  mealId: string;
  mealName: string;
  mealThumb: string;
  isSaved?: boolean;
}

export default function RecipeCard({
  mealId,
  mealName,
  mealThumb,
  isSaved = false,
}: RecipeCardProps) {
  return (
    <Link
      to={`/recipe/${mealId}`}
      className="group card-hover"
    >
      <div className="glass rounded-xl overflow-hidden h-full">
        {/* Image Container */}
        <div className="relative overflow-hidden bg-gray-200 dark:bg-slate-800 aspect-square">
          <img
            src={mealThumb}
            alt={mealName}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
          />
          {isSaved && (
            <div className="absolute top-3 right-3 bg-purple-500 text-white p-2 rounded-full">
              <Bookmark size={16} fill="currentColor" />
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-4">
          <h3 className="font-semibold text-foreground line-clamp-2 group-hover:text-primary transition-colors">
            {mealName}
          </h3>
        </div>
      </div>
    </Link>
  );
}
