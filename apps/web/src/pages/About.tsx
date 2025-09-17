import { LightningBoltIcon, RocketIcon, CodeIcon } from "@radix-ui/react-icons";

import { useThemeStore } from "../store/useThemeStore";

export default function About() {
  const { theme } = useThemeStore();
  const isDark = theme === 'dark';

  return (
    <div className="min-h-screen">
      <section className="flex flex-col items-center pb-32 pt-12 px-4">
        <div className="space-y-8 max-w-4xl mx-auto text-center">
          <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg border ${
            isDark ? 'border-zinc-800' : 'border-zinc-200'
          } mb-4`}>
            <RocketIcon className="w-4 h-4" />
            <span className="text-sm">Our Mission</span>
          </div>

          <h1 className="text-5xl font-bold">
            Empowering Your Automation Journey
          </h1>

          <p className={`text-xl ${
            isDark ? 'text-zinc-400' : 'text-zinc-600'
          } max-w-2xl mx-auto`}>
            We're building the next generation of workflow automation tools, inspired by n8n's
            powerful engine and reimagined for modern teams.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-16">
            <div className={`p-6 rounded-lg border ${
              isDark ? 'border-zinc-800' : 'border-zinc-200'
            } ${isDark ? 'hover:bg-zinc-800 bg-zinc-900' : 'hover:bg-zinc-100/40 bg-white'} transition-all text-left`}>
              <div className={`p-3 rounded-lg border ${
                isDark ? 'border-zinc-800' : 'border-zinc-200'
              } w-fit mb-4`}>
                <LightningBoltIcon className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Our Technology</h3>
              <p className={isDark ? 'text-zinc-400' : 'text-zinc-600'}>
                Built with cutting-edge tech including React, Zustand, TanStack Query, 
                and Radix UI for a modern development experience.
              </p>
            </div>

            <div className={`p-6 rounded-lg border ${
              isDark ? 'border-zinc-800' : 'border-zinc-200'
            } ${isDark ? 'hover:bg-zinc-800 bg-zinc-900' : 'hover:bg-zinc-100/40 bg-white'} transition-all text-left`}>
              <div className={`p-3 rounded-lg border ${
                isDark ? 'border-zinc-800' : 'border-zinc-200'
              } w-fit mb-4`}>
                <CodeIcon className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Open Source</h3>
              <p className={isDark ? 'text-zinc-400' : 'text-zinc-600'}>
                We believe in transparency and collaboration. Our platform is built 
                in the open, welcoming contributions from the community.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
