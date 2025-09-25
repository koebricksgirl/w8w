import { useState } from "react";
import { CheckIcon, CopyIcon } from "@radix-ui/react-icons";
import { useThemeStore } from "../store/useThemeStore";

export function CopyBox({ text, className }: { text: string, className?: string }) {
  const [copied, setCopied] = useState(false);
  const { theme } = useThemeStore();
  const isDark = theme === 'dark';

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div className={`relative ${isDark ? "bg-zinc-800" : "bg-zinc-600"} border border-blue-400 rounded-lg p-4 mb-4 ${className}`}>
      <pre className="whitespace-pre-wrap break-words text-sm text-white">{text}</pre>
      <button
        onClick={handleCopy}
        className="absolute top-2 right-2 text-blue-500 hover:text-blue-700"
        aria-label="Copy"
      >
        {copied ? <CheckIcon /> : <CopyIcon />}
      </button>
    </div>
  );
}