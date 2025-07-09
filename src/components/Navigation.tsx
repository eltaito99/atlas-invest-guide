import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { TrendingUp, ArrowLeft, User } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { User as SupabaseUser } from "@supabase/supabase-js";

export const Navigation = () => {
  const location = useLocation();
  const [user, setUser] = useState<SupabaseUser | null>(null);

  useEffect(() => {
    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user ?? null);
      }
    );

    return () => subscription.unsubscribe();
  }, []);
  
  const navItems = [
    { path: "/portfolio", label: "Portfolio" },
    { path: "/forecaster", label: "Forecaster" },
    { path: "/news", label: "Market News" },
    { path: "/alerts", label: "Alerts" },
    { path: "/social", label: "Social" },
    { path: "/about", label: "About Us" }
  ];

  const isActivePage = (path: string) => location.pathname === path;

  return (
    <nav className="bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-50">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button asChild variant="ghost" size="sm">
              <Link to="/">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Home
              </Link>
            </Button>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-green-600 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-slate-800">Atlas Hedge</span>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`transition-colors ${
                  isActivePage(item.path)
                    ? "text-blue-600 font-semibold"
                    : "text-slate-600 hover:text-slate-800"
                }`}
              >
                {item.label}
              </Link>
            ))}
            {user && (
              <Button asChild variant="ghost" size="sm">
                <Link 
                  to="/profile" 
                  className="flex items-center gap-2 hover:bg-slate-100 rounded-md p-2"
                >
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-green-600 rounded-full flex items-center justify-center">
                    <User className="w-4 h-4 text-white" />
                  </div>
                </Link>
              </Button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};