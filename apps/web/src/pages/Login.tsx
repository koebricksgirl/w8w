import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useThemeStore } from "../store/useThemeStore";
import { EnvelopeClosedIcon, LockClosedIcon } from "@radix-ui/react-icons";
import { useLogin } from "../hooks/useAuth";

export default function Login() {
  const navigate = useNavigate();
  const { theme } = useThemeStore();
  const isDark = theme === 'dark';
  const login = useLogin();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    login.mutate({ email, password });
  };

  return (
    <div className="flex min-h-[calc(100vh-8rem)] items-center justify-center p-4">
      <div className={`w-full max-w-md space-y-8 ${
        isDark ? 'bg-zinc-800' : 'bg-white'
      } p-8 rounded-xl shadow-lg`}>
        <div className="text-center">
          <h2 className={`text-3xl font-bold ${
            isDark ? 'text-white' : 'text-zinc-900'
          }`}>
            Sign in to your account
          </h2>
          <p className={`mt-2 text-sm ${
            isDark ? 'text-zinc-400' : 'text-zinc-600'
          }`}>
            Welcome back! Please enter your details.
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label 
                htmlFor="email" 
                className={`block text-sm font-medium ${
                  isDark ? 'text-zinc-200' : 'text-zinc-700'
                }`}
              >
                Email address
              </label>
              <div className="mt-1 relative">
                <div className={`absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none ${
                  isDark ? 'text-zinc-400' : 'text-zinc-500'
                }`}>
                  <EnvelopeClosedIcon className="h-5 w-5" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`block w-full pl-10 pr-3 py-2 border ${
                    isDark 
                      ? 'bg-zinc-900 border-zinc-700 text-white placeholder-zinc-400' 
                      : 'bg-white border-zinc-300 text-zinc-900 placeholder-zinc-400'
                  } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                  placeholder="you@example.com"
                />
              </div>
            </div>

            <div>
              <label 
                htmlFor="password" 
                className={`block text-sm font-medium ${
                  isDark ? 'text-zinc-200' : 'text-zinc-700'
                }`}
              >
                Password
              </label>
              <div className="mt-1 relative">
                <div className={`absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none ${
                  isDark ? 'text-zinc-400' : 'text-zinc-500'
                }`}>
                  <LockClosedIcon className="h-5 w-5" />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`block w-full pl-10 pr-3 py-2 border ${
                    isDark 
                      ? 'bg-zinc-900 border-zinc-700 text-white placeholder-zinc-400' 
                      : 'bg-white border-zinc-300 text-zinc-900 placeholder-zinc-400'
                  } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                  placeholder="••••••••"
                />
              </div>
            </div>
          </div>

          {login.error && (
            <p className="text-red-500 text-sm text-center">
              {(() => {
                const err = login.error as any;
                return err?.response?.data?.message || err?.message || "Failed to login";
              })()}
            </p>
          )}

          <button
            type="submit"
            disabled={login.isPending}
            className={`w-full py-2 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white ${
              isDark
                ? 'bg-blue-600 hover:bg-blue-700'
                : 'bg-blue-500 hover:bg-blue-600'
            } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {login.isPending ? "Signing in..." : "Sign in"}
          </button>

          <div className="text-center">
            <p className={`text-sm ${
              isDark ? 'text-zinc-400' : 'text-zinc-600'
            }`}>
              Don't have an account?{" "}
              <button
                type="button"
                onClick={() => navigate("/register")}
                className="font-medium text-blue-500 hover:text-blue-400"
              >
                Sign up
              </button>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
