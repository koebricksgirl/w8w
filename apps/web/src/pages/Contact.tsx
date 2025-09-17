import { EnvelopeClosedIcon, ChatBubbleIcon, GitHubLogoIcon } from "@radix-ui/react-icons";

import { useThemeStore } from "../store/useThemeStore";
import { social } from "../utils/social";

export default function Contact() {
  const { theme } = useThemeStore();
  const isDark = theme === 'dark';

  return (
    <div className="min-h-screen">
      <section className="flex flex-col items-center pb-32 pt-12 px-4">
        <div className="space-y-8 max-w-4xl mx-auto text-center">
          <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg border ${
            isDark ? 'border-zinc-800' : 'border-zinc-200'
          } mb-4`}>
            <ChatBubbleIcon className="w-4 h-4" />
            <span className="text-sm">Get in Touch</span>
          </div>

          <h1 className="text-5xl font-bold">
            Let's Connect
          </h1>

          <p className={`text-xl ${
            isDark ? 'text-zinc-400' : 'text-zinc-600'
          } max-w-2xl mx-auto`}>
            Have questions about our workflow automation platform? We'd love to hear from you.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16">
            <a 
              href="mailto:rsankhasi@gmail.com"
              className={`p-6 rounded-lg border ${
                isDark ? 'border-zinc-800' : 'border-zinc-200'
              } ${isDark ? 'hover:bg-zinc-800 bg-zinc-900' : 'hover:bg-zinc-100/40 bg-white'} transition-all text-left group`}
            >
              <div className={`p-3 rounded-lg border ${
                isDark ? 'border-zinc-800' : 'border-zinc-200'
              } w-fit mb-4`}>
                <EnvelopeClosedIcon className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Email Us</h3>
              <p className={`font-mono ${
                isDark ? 'text-zinc-400' : 'text-zinc-600'
              }`}>
                hello@example.com
              </p>
            </a>

            <a 
              href={social.github}
              target="_blank"
              rel="noopener noreferrer"
              className={`p-6 rounded-lg border ${
                isDark ? 'border-zinc-800' : 'border-zinc-200'
              } ${isDark ? 'hover:bg-zinc-800 bg-zinc-900' : 'hover:bg-zinc-100/40 bg-white'} transition-all text-left group`}
            >
              <div className={`p-3 rounded-lg border ${
                isDark ? 'border-zinc-800' : 'border-zinc-200'
              } w-fit mb-4`}>
                <GitHubLogoIcon className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-semibold mb-2">GitHub</h3>
              <p className={isDark ? 'text-zinc-400' : 'text-zinc-600'}>
                Check out our open source code
              </p>
            </a>

            <div className={`p-6 rounded-lg border ${
              isDark ? 'border-zinc-800' : 'border-zinc-200'
            } ${isDark ? 'hover:bg-zinc-800 bg-zinc-900' : 'hover:bg-zinc-100/40 bg-white'} transition-all text-left`}>
              <div className={`p-3 rounded-lg border ${
                isDark ? 'border-zinc-800' : 'border-zinc-200'
              } w-fit mb-4`}>
                <ChatBubbleIcon className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Discord</h3>
              <p className={isDark ? 'text-zinc-400' : 'text-zinc-600'}>
                Join our community
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
