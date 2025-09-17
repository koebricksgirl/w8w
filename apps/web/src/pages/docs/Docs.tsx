import { useThemeStore } from "../../store/useThemeStore";
import { useNavigate } from "react-router-dom";
import { docsList } from "../../utils/docsList"; 

export default function Docs() {
  const { theme } = useThemeStore();
  const isDark = theme === "dark";
  const navigate = useNavigate();

  return (
    <div className={`min-h-[calc(100vh-4rem)] px-6 py-10 ${isDark ? "bg-zinc-900" : "bg-zinc-50"}`}>
      <div className="max-w-6xl mx-auto">
        <h1 className={`text-4xl font-bold mb-10 text-center ${isDark ? "text-white" : "text-zinc-900"}`}>
          Documentation
        </h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {docsList.map(doc => (
            <div
              key={doc.id}
              onClick={() => navigate(`/docs/${doc.id}`)}
              className={`cursor-pointer rounded-xl p-6 transition transform hover:scale-[1.02] hover:shadow-lg ${
                isDark ? "bg-zinc-800 hover:bg-zinc-700" : "bg-white hover:bg-zinc-100"
              }`}
            >
              <h2 className={`text-xl font-semibold mb-2 ${isDark ? "text-white" : "text-zinc-900"}`}>
                {doc.title}
              </h2>
              <p className={`${isDark ? "text-zinc-400" : "text-zinc-600"}`}>
                {doc.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
