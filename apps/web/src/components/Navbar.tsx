import { Link, useNavigate } from "react-router-dom";
import { useThemeStore } from "../store/useThemeStore";
import { useAuthStore } from "../store/useAuthStore";
import { MoonIcon, SunIcon, PersonIcon, ExitIcon } from "@radix-ui/react-icons";
import Logo from "./ui/Logo";

export default function Navbar() {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useThemeStore();
  const { user, isAuthenticated, clearAuth } = useAuthStore();
  const isDark = theme === 'dark';

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 flex justify-between items-center px-6 py-4 ${
      isDark 
        ? 'bg-zinc-900/50 border-zinc-800' 
        : 'bg-white/50 border-zinc-200'
    } backdrop-blur-md border-b`}>
      <Link to="/" className="flex items-center gap-2">
        <div className={`w-8 h-8 rounded-lg ${
          isDark ? 'bg-white/10' : 'bg-zinc-100'
        } flex items-center justify-center`}>
          <span className="text-lg"><Logo/></span>
        </div>
        <h1 className={`text-xl font-bold ${
          isDark ? 'text-white' : 'text-zinc-900'
        }`}>
          W8W
        </h1>
      </Link>
      
      <div className="hidden md:flex items-center gap-8">
        <Link 
          to="/" 
          className={`text-sm ${
            isDark 
              ? 'text-white/70 hover:text-white' 
              : 'text-zinc-600 hover:text-zinc-900'
          } transition-colors`}
        >
          Home
        </Link>
        <Link 
          to="/about" 
          className={`text-sm ${
            isDark 
              ? 'text-white/70 hover:text-white' 
              : 'text-zinc-600 hover:text-zinc-900'
          } transition-colors`}
        >
          About
        </Link>
        <Link 
          to="/contact" 
          className={`text-sm ${
            isDark 
              ? 'text-white/70 hover:text-white' 
              : 'text-zinc-600 hover:text-zinc-900'
          } transition-colors`}
        >
          Contact
        </Link>
      </div>

      <div className="flex items-center gap-4">
        <button
          onClick={toggleTheme}
          className={`p-2 rounded-full ${
            isDark 
              ? 'hover:bg-white/10' 
              : 'hover:bg-zinc-100'
          } transition-colors`}
          aria-label="Toggle theme"
        >
          {isDark ? (
            <SunIcon className={`w-5 h-5 ${
              isDark ? 'text-white/70' : 'text-zinc-600'
            }`} />
          ) : (
            <MoonIcon className={`w-5 h-5 ${
              isDark ? 'text-white/70' : 'text-zinc-600'
            }`} />
          )}
        </button>
        
        {isAuthenticated ? (
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 px-3 py-1 rounded-lg border">
              <PersonIcon className="w-4 h-4" />
              <span className="text-sm">{user?.email}</span>
            </div>
            <button
              onClick={() => {
                clearAuth();
                navigate("/login");
              }}
              className={`p-2 rounded-lg ${
                isDark 
                  ? 'hover:bg-white/10' 
                  : 'hover:bg-zinc-100'
              } transition-colors`}
              aria-label="Logout"
            >
              <ExitIcon className="w-5 h-5" />
            </button>
          </div>
        ) : (
          <Link
            to="/login"
            className={`hidden md:inline-flex items-center gap-2 px-4 py-2 rounded-lg ${
              isDark 
                ? 'bg-white/10 hover:bg-white/20 border-white/10' 
                : 'bg-zinc-100 hover:bg-zinc-200 border-zinc-200'
            } transition-all border text-sm font-medium`}
          >
            Sign In
          </Link>
        )}
      </div>
    </nav>
  );
}
