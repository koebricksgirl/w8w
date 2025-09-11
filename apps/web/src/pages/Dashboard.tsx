import { Link } from 'react-router-dom';
import { useThemeStore } from '../store/useThemeStore';
import { PlusIcon, PlayIcon } from '@radix-ui/react-icons';

export default function Dashboard() {
  const { theme } = useThemeStore();
  const isDark = theme === 'dark';

  return (
    <div className="py-32 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">My Workflows</h1>
          <Link
            to="/workflows/editor"
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg ${
              isDark 
                ? 'bg-blue-600 hover:bg-blue-700' 
                : 'bg-blue-500 hover:bg-blue-600'
            } text-white transition-colors`}
          >
            <PlusIcon className="w-5 h-5" />
            Create Workflow
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className={`p-6 rounded-lg border ${
            isDark ? 'border-zinc-800' : 'border-zinc-200'
          }`}>
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="font-semibold mb-1">Email → Telegram</h3>
                <p className={`text-sm ${
                  isDark ? 'text-zinc-400' : 'text-zinc-600'
                }`}>
                  Manual trigger
                </p>
              </div>
              <button className={`p-2 rounded-lg ${
                isDark 
                  ? 'hover:bg-white/10' 
                  : 'hover:bg-zinc-100'
              } transition-colors`}>
                <PlayIcon className="w-5 h-5" />
              </button>
            </div>
            <div className="flex gap-2">
              <Link
                to={`/workflows/editor/123`}
                className={`px-3 py-1 rounded text-sm ${
                  isDark 
                    ? 'hover:bg-white/10' 
                    : 'hover:bg-zinc-100'
                } transition-colors`}
              >
                Edit
              </Link>
              <button className={`px-3 py-1 rounded text-sm ${
                isDark 
                  ? 'hover:bg-white/10 text-red-400' 
                  : 'hover:bg-zinc-100 text-red-500'
              } transition-colors`}>
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
