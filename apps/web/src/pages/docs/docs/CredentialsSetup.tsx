import { CopyBox } from "../../../components/CopyBox";
import { nodeIcons } from "../../../lib/nodeIcons";
import { useThemeStore } from "../../../store/useThemeStore";
import { useNavigate } from "react-router-dom";

export default function CredentialsSetup() {
    const { theme } = useThemeStore();
    const isDark = theme === "dark";
    const navigate = useNavigate();

    const platforms = [
        { name: "Telegram", icon: nodeIcons["Telegram"] },
        { name: "ResendEmail", icon: nodeIcons["ResendEmail"] },
        { name: "Google Gemini", icon: nodeIcons["Gemini"] },
        { name: "Slack", icon: nodeIcons["Slack"]},
    ];

    return (
        <div className="w-full">
            <h2 className="text-2xl font-bold mb-8 text-center">Platform Credentials Setup</h2>

            <div className={`flex flex-wrap gap-4 mb-10 p-4 rounded-lg ${isDark ? "bg-zinc-800" : "bg-zinc-100"}`}>
                {platforms.map((platform) => (
                    <div
                        key={platform.name}
                        className="flex items-center gap-2 px-3 py-1.5 rounded-md text-sm bg-white dark:bg-zinc-700 shadow-sm"
                    >
                        <img src={platform.icon} alt={platform.name} className="h-5 w-5" />
                        <span className={`${isDark ? "text-white" : "text-zinc-900"}`}>{platform.name}</span>
                    </div>
                ))}
            </div>


            <div className="mb-10">
                <h2 className="text-xl font-semibold flex items-center gap-2 mb-6">
                    <span className="text-blue-500">Step 2:</span> Add credentials in the{" "}
                    <span
                        className="text-blue-500 underline cursor-pointer"
                        onClick={() => navigate("/credentials")}
                    >
                        Credentials page
                    </span>
                </h2>

                <div className="space-y-8">
             
                    <div className="p-4 rounded-xl border-l-4 border-blue-400 bg-blue-50 dark:bg-blue-900/20">
                        <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
                            <img src={nodeIcons["Telegram"]} alt="Telegram" className="h-6 w-6" /> Telegram
                        </h3>
                        <ul className="list-disc pl-6 mb-3 text-sm">
                            <li><strong>chatId</strong></li>
                            <li><strong>botToken</strong></li>
                        </ul>
                        <p className="text-sm mb-3 font-semibold">Setup:</p>
                        <ol className="list-decimal pl-6 space-y-2 text-sm">
                            <li>Open Telegram and search for <span className="font-mono">BotFather</span>.</li>
                            <li>Send <span className="font-mono">/start</span> and then <span className="font-mono">/newbot</span> to create a bot.</li>
                            <li>Choose a name and a unique username (ending in <span className="font-mono">bot</span>).</li>
                            <li>Copy the <strong>bot token</strong> BotFather gives you.</li>
                            <li>Start a chat with your new bot in Telegram (send any message).</li>
                            <li>Request your <strong>chatId</strong> by calling:
                                <br />
                                 <CopyBox className="mt-2" text="https://api.telegram.org/bot&lt;botToken&gt;/getUpdates" />
                            </li>
                            <li>
                                In the JSON response, look for <span className="font-mono">"chat": {"{ id: ... }"}</span>.
                                That number is your <strong>chatId</strong>.
                            </li>
                            <li>
                                <strong>If you don’t see chatId:</strong>
                                - Make sure you’ve actually sent a message to your bot.
                                - Try again after a few seconds (Telegram caches updates).
                                - If using a group, add your bot to the group and send a message.
                            </li>
                        </ol>
                    </div>


             
                    <div className="p-4 rounded-xl border-l-4 border-purple-400 bg-purple-50 dark:bg-purple-900/20">
                        <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
                            <img src={nodeIcons["Gemini"]} alt="Gemini" className="h-6 w-6" /> Google Gemini
                        </h3>
                        <ul className="list-disc pl-6 mb-3 text-sm">
                            <li><strong>geminiApiKey</strong></li>
                        </ul>
                        <p className="text-sm mb-3 font-semibold">Setup:</p>
                        <ol className="list-decimal pl-6 space-y-2 text-sm">
                            <li>Go to <a href="https://makersuite.google.com/app/apikey" target="_blank" rel="noreferrer" className="text-blue-500 underline">Google AI Studio</a>.</li>
                            <li>Sign in with your Google account.</li>
                            <li>Click <strong>Get API Key</strong> and generate a new key.</li>
                            <li>Copy the key and paste it into the <span className="font-mono">geminiApiKey</span> field on the Credentials page.</li>
                            <li>This key is required to access Gemini API for prompts and responses.</li>
                        </ol>
                    </div>

              
                    <div className="p-4 rounded-xl border-l-4 border-green-400 bg-green-50 dark:bg-green-900/20">
                        <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
                            <img src={nodeIcons["ResendEmail"]} alt="ResendEmail" className="h-6 w-6" /> Resend Email
                        </h3>
                        <ul className="list-disc pl-6 mb-3 text-sm">
                            <li><strong>apiKey</strong></li>
                            <li><strong>resendDomainMail</strong></li>
                        </ul>
                        <p className="text-sm mb-3 font-semibold">Setup:</p>
                        <ol className="list-decimal pl-6 space-y-2 text-sm">
                            <li>Create a free account at <a href="https://resend.com" target="_blank" rel="noreferrer" className="text-blue-500 underline">Resend.com</a>.</li>
                            <li>Open your dashboard and go to the <strong>API Keys</strong> section.</li>
                            <li>Click <strong>Generate API Key</strong> and copy it.</li>
                            <li>Paste it into the <span className="font-mono">apiKey</span> field on the Credentials page.</li>
                            <li>Verify your sending domain in Resend (e.g. <span className="font-mono">yourdomain.com</span>).</li>
                            <li>Use your verified email (e.g. <span className="font-mono">noreply@yourdomain.com</span>) as <span className="font-mono">resendDomainMail</span>.</li>
                        </ol>
                        <p className="text-sm my-3 font-medium"> <span className="text-yellow-400"> Special Mention: </span>If you don't provide us your verified domain mail then you will not able to send message to any other email id rather than your resend account email id </p>
                    </div>

                         <div className="p-4 rounded-xl border-l-4 border-pink-400 bg-pink-50 dark:bg-pink-900/20">
                        <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
                            <img src={nodeIcons["Slack"]} alt="Slack" className="h-6 w-6" /> Slack
                        </h3>
                        <ul className="list-disc pl-6 mb-3 text-sm">
                            <li><strong>botToken</strong></li>
                            <li><strong>channelId</strong> (not necessary during credentials set up)</li>
                        </ul>
                        <p className="text-sm mb-3 font-semibold">Setup:</p>
                        <ol className="list-decimal pl-6 space-y-2 text-sm">
                            <li>Create a Slack App at <a href="https://api.slack.com/apps" target="_blank" rel="noreferrer" className="text-blue-500 underline">Slack API Apps</a>.</li>
                            <li>Enable <strong>Bots</strong> feature and add the <strong>chat:write</strong> scope.</li>
                            <li>Install the app to your workspace and copy the <span className="font-mono">Bot User OAuth Token</span>.</li>
                            <li>Invite your bot to the channel where you want to post: <span className="font-mono">/invite @YourBotName</span>.</li>
                            <li>Fetch your channel IDs via Slack API:
                                <CopyBox className="mt-2" text="https://slack.com/api/conversations.list?types=public_channel,private_channel" />
                                Add your bot token as Bearer in Authorization header.
                            </li>
                            <li>Find the <span className="font-mono">id</span> field of your channel (e.g. <span className="font-mono">C09H17HGD8A</span>).</li>
                            <li>Use that channel ID in the workflow node.</li>
                        </ol>
                    </div>

                </div>
            </div>

            <h2 className="text-xl font-semibold mb-4">Step 3: Save and test by creating workflows</h2>
        </div>
    );
}
