import { GitHubLogoIcon, LinkedInLogoIcon, TwitterLogoIcon } from "@radix-ui/react-icons";
import { Link } from "react-router-dom";
import { useThemeStore } from "../store/useThemeStore";

export default function Footer() {
  const { theme } = useThemeStore();
  const isDark = theme === 'dark';

  return (
    <footer className={`py-12 px-6 border-t ${
      isDark ? 'border-zinc-800' : 'border-zinc-200'
    }`}>
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-lg border ${
                isDark ? 'border-zinc-800' : 'border-zinc-200'
              } flex items-center justify-center`}>
                <span className="text-lg">W8W</span>
              </div>
            </div>
            <p className={`text-sm ${
              isDark ? 'text-zinc-400' : 'text-zinc-600'
            }`}>
              Powerful workflow automation for modern teams
            </p>
          </div>

          <div>
            <h3 className={`font-semibold mb-4 ${
              isDark ? 'text-white' : 'text-zinc-900'
            }`}>Product</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/features" className={`text-sm ${
                  isDark 
                    ? 'text-zinc-400 hover:text-white' 
                    : 'text-zinc-600 hover:text-zinc-900'
                } transition-colors`}>
                  Features
                </Link>
              </li>
              <li>
                <Link to="/pricing" className={`text-sm ${
                  isDark 
                    ? 'text-zinc-400 hover:text-white' 
                    : 'text-zinc-600 hover:text-zinc-900'
                } transition-colors`}>
                  Pricing
                </Link>
              </li>
              <li>
                <Link to="/docs" className={`text-sm ${
                  isDark 
                    ? 'text-zinc-400 hover:text-white' 
                    : 'text-zinc-600 hover:text-zinc-900'
                } transition-colors`}>
                  Documentation
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className={`font-semibold mb-4 ${
              isDark ? 'text-white' : 'text-zinc-900'
            }`}>Company</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/about" className={`text-sm ${
                  isDark 
                    ? 'text-zinc-400 hover:text-white' 
                    : 'text-zinc-600 hover:text-zinc-900'
                } transition-colors`}>
                  About
                </Link>
              </li>
              <li>
                <Link to="/contact" className={`text-sm ${
                  isDark 
                    ? 'text-zinc-400 hover:text-white' 
                    : 'text-zinc-600 hover:text-zinc-900'
                } transition-colors`}>
                  Contact
                </Link>
              </li>
              <li>
                <Link to="/blog" className={`text-sm ${
                  isDark 
                    ? 'text-zinc-400 hover:text-white' 
                    : 'text-zinc-600 hover:text-zinc-900'
                } transition-colors`}>
                  Blog
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className={`font-semibold mb-4 ${
              isDark ? 'text-white' : 'text-zinc-900'
            }`}>Legal</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/privacy" className={`text-sm ${
                  isDark 
                    ? 'text-zinc-400 hover:text-white' 
                    : 'text-zinc-600 hover:text-zinc-900'
                } transition-colors`}>
                  Privacy
                </Link>
              </li>
              <li>
                <Link to="/terms" className={`text-sm ${
                  isDark 
                    ? 'text-zinc-400 hover:text-white' 
                    : 'text-zinc-600 hover:text-zinc-900'
                } transition-colors`}>
                  Terms
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className={`pt-8 border-t ${
          isDark ? 'border-zinc-800' : 'border-zinc-200'
        } flex flex-col md:flex-row justify-between items-center gap-4`}>
          <p className={`text-sm ${
            isDark ? 'text-zinc-400' : 'text-zinc-600'
          }`}>
            © 2025 W8W. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              className={`p-2 rounded-lg ${
                isDark 
                  ? 'hover:bg-zinc-800' 
                  : 'hover:bg-zinc-50'
              } transition-colors`}
            >
              <TwitterLogoIcon className={`w-5 h-5 ${
                isDark ? 'text-zinc-400' : 'text-zinc-600'
              }`} />
            </a>
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className={`p-2 rounded-lg ${
                isDark 
                  ? 'hover:bg-zinc-800' 
                  : 'hover:bg-zinc-50'
              } transition-colors`}
            >
              <GitHubLogoIcon className={`w-5 h-5 ${
                isDark ? 'text-zinc-400' : 'text-zinc-600'
              }`} />
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              className={`p-2 rounded-lg ${
                isDark 
                  ? 'hover:bg-zinc-800' 
                  : 'hover:bg-zinc-50'
              } transition-colors`}
            >
              <LinkedInLogoIcon className={`w-5 h-5 ${
                isDark ? 'text-zinc-400' : 'text-zinc-600'
              }`} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}