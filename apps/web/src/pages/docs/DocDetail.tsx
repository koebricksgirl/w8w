import { useParams } from "react-router-dom";
import { useThemeStore } from "../../store/useThemeStore";
import { docsList } from "../../utils/docsList"; 
import WorkflowExamples from "./docs/WorkflowExamples";
import CredentialsSetup from "./docs/CredentialsSetup";

export default function DocDetail() {
  const { id } = useParams();
  const { theme } = useThemeStore();
  const isDark = theme === "dark";
  const doc = docsList.find(d => d.id === id);

  if (!doc) {
    return (
      <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4">
        <div className={`w-full max-w-2xl ${isDark ? "bg-zinc-800" : "bg-white"} p-8 rounded-xl shadow-lg text-center`}>
          <h1 className={`text-2xl font-bold ${isDark ? "text-white" : "text-zinc-900"}`}>Doc Not Found</h1>
          <p className={`${isDark ? "text-zinc-400" : "text-zinc-600"}`}>The documentation you are looking for does not exist.</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-[calc(100vh-4rem) mt-10 px-6 py-10 ${isDark ? "bg-zinc-900" : "bg-zinc-50"}`}>
      <div className="max-w-6xl mx-auto">
        <h1 className={`text-4xl font-bold mb-6 ${isDark ? "text-white" : "text-zinc-900"}`}>
          {doc.title}
        </h1>
        <p className={`mb-10 ${isDark ? "text-zinc-400" : "text-zinc-600"}`}>{doc.description}</p>
        {id === "1" && <WorkflowExamples />}
        {id === "2" && <CredentialsSetup />}
      </div>
    </div>
  );
}
