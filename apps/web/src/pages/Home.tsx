import { Dialog, DialogTrigger } from "@radix-ui/react-dialog";
import { ArrowRightIcon, LightningBoltIcon } from "@radix-ui/react-icons";
import { useNavigate } from "react-router-dom"
import { useThemeStore } from "../store/useThemeStore";

export default function Home() {
  const { theme } = useThemeStore();
  const navigate = useNavigate();

  const isDark = theme === "dark";
  return (
    <div className="min-h-screen">
      <section className="flex flex-col justify-center items-center py-32 text-center px-4">
        <div className="space-y-8 flex flex-col justify-center items-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border mb-4">
            <LightningBoltIcon className="w-4 h-4" />
            <span className="text-sm">Powerful Workflow Automation</span>
          </div>
          
          <h1 className="text-6xl font-bold max-w-4xl leading-tight">
            Automate Your Workflows with Ease 
          </h1>
          
          <p className="text-xl max-w-2xl mx-auto">
            Build, run, and scale automation workflows effortlessly. Inspired by n8n's
            powerful engine, reimagined for modern teams.
          </p>

          <div className="flex flex-wrap gap-4 justify-center items-center mt-8">
            <Dialog>
              <DialogTrigger asChild>
                <button className="inline-flex items-center gap-2 px-8 py-4 bg-blue-500 text-white rounded-lg font-semibold hover:bg-blue-600 transition-all"
                onClick={ () => navigate("/dashboard")}
                >
                  Get Started
                  <ArrowRightIcon className="w-4 h-4" />
                </button>
              </DialogTrigger>
            </Dialog>
            
            <button className={`px-8 py-4 rounded-lg font-semibold border transition-all ${
              isDark 
                ? "hover:bg-zinc-800" 
                : "hover:bg-zinc-100/40"
            }`}>
              Watch Demo
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16 text-left">
            {[
              {
                icon: <ArrowRightIcon className="w-6 h-6" />,
                title: "Visual Builder",
                description: "Drag & drop interface to create complex workflows"
              },
              {
                icon: <LightningBoltIcon className="w-6 h-6" />,
                title: "Real-time Execution",
                description: "Monitor and debug your workflows in real-time"
              },
              {
                icon: <ArrowRightIcon className="w-6 h-6" />,
                title: "Extensible",
                description: "Connect with your favorite tools and services"
              }
            ].map((feature, i) => (
              <div 
                key={i} 
                className={`p-6 rounded-lg border transition-all ${
                  isDark 
                    ? "hover:bg-zinc-800 bg-zinc-900" 
                    : "hover:bg-zinc-100/40 bg-white"
                }`}>
                <div className="p-3 rounded-lg border w-fit mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className={isDark ? "text-zinc-400" : "text-zinc-600"}>{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
