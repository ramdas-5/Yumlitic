import { Link } from "react-router-dom";
import { ChefHat, Search, Bookmark, Users } from "lucide-react";

export default function Landing() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-blue-50/30 to-background dark:via-slate-900/20">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-32 text-center animate-fade-in">
        <div className="space-y-6">
          {/* Logo and Title */}
          <div className="flex justify-center mb-8">
            <div className="w-16 h-16 rounded-xl bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center text-white text-4xl hover:scale-110 transition-transform">
              <ChefHat size={40} />
            </div>
          </div>

          <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold leading-tight">
            <span className="gradient-text">Discover Delicious</span>
            <br />
            <span className="text-foreground">Recipes, Anytime</span>
          </h1>

          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Explore thousands of recipes, save your favorites, and get inspired
            to cook amazing dishes. Whether you're a beginner or a seasoned
            chef, Yumlytic has something for everyone.
          </p>

          {/* CTA Button */}
          <div className="flex justify-center gap-4 pt-8">
            <Link to="/home" className="btn-primary text-lg">
              Get Started →
            </Link>
            <a href="#features" className="btn-outline text-lg">
              Learn More
            </a>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div id="features" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <h2 className="text-4xl font-bold text-center mb-16 gradient-text">
          Why Choose Yumlytic?
        </h2>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Feature 1 */}
          <div className="glass rounded-2xl p-8 space-y-4 hover:shadow-xl transition-shadow">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-purple-500 to-purple-600 flex items-center justify-center text-white">
              <Search size={24} />
            </div>
            <h3 className="text-2xl font-bold text-foreground">
              Powerful Search
            </h3>
            <p className="text-muted-foreground">
              Search recipes by dish name or ingredient. Find exactly what you're
              looking for in seconds.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="glass rounded-2xl p-8 space-y-4 hover:shadow-xl transition-shadow">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center text-white">
              <Bookmark size={24} />
            </div>
            <h3 className="text-2xl font-bold text-foreground">
              Save Favorites
            </h3>
            <p className="text-muted-foreground">
              Create an account and save your favorite recipes to access them
              anytime, anywhere.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="glass rounded-2xl p-8 space-y-4 hover:shadow-xl transition-shadow">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center text-white">
              <Users size={24} />
            </div>
            <h3 className="text-2xl font-bold text-foreground">
              Detailed Recipes
            </h3>
            <p className="text-muted-foreground">
              Get complete ingredient lists with measurements and step-by-step
              cooking instructions.
            </p>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="glass rounded-2xl p-12">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <h3 className="text-4xl font-bold gradient-text mb-2">10000+</h3>
              <p className="text-muted-foreground">Recipes Available</p>
            </div>
            <div>
              <h3 className="text-4xl font-bold gradient-text mb-2">100%</h3>
              <p className="text-muted-foreground">Free to Use</p>
            </div>
            <div>
              <h3 className="text-4xl font-bold gradient-text mb-2">24/7</h3>
              <p className="text-muted-foreground">Always Available</p>
            </div>
          </div>
        </div>
      </div>

      {/* Final CTA */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <h2 className="text-3xl font-bold mb-6">Ready to Explore?</h2>
        <Link to="/home" className="btn-primary text-lg">
          Start Cooking Now →
        </Link>
      </div>
    </div>
  );
}
