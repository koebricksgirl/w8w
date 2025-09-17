import { useThemeStore } from "../../store/useThemeStore";
import { useNavigate } from "react-router-dom";

export default function NotFound() {
  const { theme } = useThemeStore();
  const isDark = theme === "dark";
  const navigate = useNavigate();

  return (
    <div className="flex min-h-[calc(100vh-8rem)] items-center justify-center p-4">
      <div className={`w-full max-w-md space-y-8 ${
        isDark ? 'bg-zinc-800' : 'bg-white'
      } p-8 rounded-xl shadow-lg text-center`}>
        <h1 className={`text-4xl font-bold ${
          isDark ? 'text-white' : 'text-zinc-900'
        }`}>
          404 - Not Found
        </h1>
        <p className={`mt-2 text-lg ${
          isDark ? 'text-zinc-400' : 'text-zinc-600'
        }`}>
          Sorry, the page you are looking for does not exist.
        </p>
        <button
          onClick={() => navigate("/")}
          className={`mt-6 py-2 px-4 rounded-lg font-medium text-white ${
            isDark ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'
          }`}
        >
          Go Home
        </button>
      </div>
    </div>
  );
}