import { Cross1Icon } from "@radix-ui/react-icons";
import { useThemeStore } from "../../store/useThemeStore";

export function Modal({ children, onClose }: { children: React.ReactNode, onClose: () => void }) {
    const { theme } = useThemeStore();
    const isDark = theme === 'dark';
    return (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className={`${isDark ? "bg-zinc-900" : "bg-white"} p-6 rounded shadow-lg min-w-[300px] relative`}>
                {children}
                <button
                    className={`absolute top-3 right-3 text-zinc-400 ${isDark?"hover:text-zinc-100":"hover:text-zinc-600"} cursor-pointer`}
                    onClick={onClose}
                    aria-label="Close"
                >
                    <Cross1Icon className="w-5 h-5" />
                </button>
            </div>
        </div>
    )
}