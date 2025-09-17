import { useNavigate } from "react-router-dom";
import { useThemeStore } from "../../../store/useThemeStore";
import { nodeIcons } from "../../../lib/nodeIcons";

export default function WorkflowExamples() {
  const { theme } = useThemeStore();
  const isDark = theme === "dark";
  const navigate = useNavigate();

  const cardBg = isDark ? "bg-zinc-800" : "bg-white";
  const subtleBg = isDark ? "bg-zinc-900" : "bg-zinc-50";
  const textMuted = isDark ? "text-zinc-400" : "text-zinc-600";

  return (
    <div className={`max-w-6xl mx-auto px-6 py-10 ${isDark ? "text-zinc-200" : "text-zinc-900"}`}>
      <h1 className="text-3xl font-bold mb-6">Workflow Editor — Guide & Examples</h1>

   
      <section className={`rounded-xl p-6 mb-8 shadow-sm ${cardBg}`}>
        <h2 className="text-2xl font-semibold mb-3">Getting started — quick steps</h2>
        <ol className="list-decimal pl-6 space-y-2 leading-relaxed">
          <li>
            Go to the{" "}
            <span
              onClick={() => navigate("/dashboard")}
              className="text-blue-500 font-semibold underline cursor-pointer"
            >
              Dashboard
            </span>{" "}
            — you will see your workflows. From there you can <strong>view</strong>, <strong>edit</strong>, or{" "}
            <strong>delete</strong> workflows.
          </li>
          <li>
            Create a new workflow by clicking the <strong>Create Workflow</strong> button. This opens the
            editor canvas.
          </li>
          <li>
            Add nodes from the sidebar, drag them onto the canvas, and connect them by clicking an output handle and dragging to a target handle.
          </li>
          <li>
            Configure each node by clicking it — a node configuration dialog appears. Select credentials and fill required fields.
          </li>
          <li>
            After you finish, click <strong>Save Changes</strong>. If you are editing an existing workflow you must click Save Changes for the edits to persist.
          </li>
          <li>
            To remove a node or an edge: click it, then press <kbd>Delete</kbd> on your keyboard.
          </li>
          <li>
            You can <strong>zoom in / zoom out</strong> the canvas for a better view — use the React Flow Controls (the +/-) or your mouse wheel / pinch gesture.
          </li>
        </ol>
      </section>


      <section className={`rounded-xl p-6 mb-8 ${subtleBg} border ${isDark ? "border-zinc-700" : "border-zinc-200"}`}>
        <h2 className="text-2xl font-semibold mb-3">Node UI: what each element means</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="mb-2">
              <strong>Two dots on each node</strong>:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong>Big dot:</strong> becomes <span className="text-green-500 font-semibold">green</span> when all
                required fields & credentials for that node are filled/valid.
              </li>
              <li>
                <strong>Small dot:</strong> execution status indicator:
                <ul className="list-disc pl-6 mt-1">
                  <li className="text-green-500">Green → success</li>
                  <li className="text-yellow-500">Yellow → running</li>
                  <li className="text-red-500">Red → failed</li>
                </ul>
              </li>
            </ul>
          </div>

          <div>
            <p className="mb-2">
              <strong>Visual hints & tips</strong>:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Hover a node to see its tooltip with id and usage snippet (e.g. <code>{"{{ $node.node1 }}"}</code>).</li>
              <li>Click a node to open its configuration dialog where you choose credentials and fill inputs.</li>
              <li>Use the mini-map and Controls to quickly navigate and zoom the canvas.</li>
            </ul>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-4">
          <img src="https://pbs.twimg.com/media/G1FAd2tXcAAyOt7?format=jpg&name=large" alt="node-dots" className="rounded-lg shadow-md w-full object-cover" />
          <img src="https://pbs.twimg.com/media/G1E3u_oXQAANljt?format=jpg&name=medium" alt="node-setup" className="rounded-lg shadow-md w-full object-cover" />
          <img src="https://pbs.twimg.com/media/G1E4FuCXkAESIre?format=jpg&name=medium" alt="node-look" className="rounded-lg shadow-md w-full object-cover" />
        </div>
      </section>

  
      <section className={`rounded-xl p-6 mb-8 ${cardBg} border ${isDark ? "border-zinc-700" : "border-zinc-200"}`}>
        <h2 className="text-2xl font-semibold mb-3">Workflow types</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li>
            <img src={nodeIcons.Workflow} className="inline h-5 w-5 mr-2 align-middle" alt="workflow icon" />
            <strong>Manual</strong> — run workflows directly from the Dashboard/UI.
          </li>
          <li>
            <img src={nodeIcons.Webhook} className="inline h-5 w-5 mr-2 align-middle" alt="webhook icon" />
            <strong>Webhook</strong> — exposed endpoint. You must configure:
            <ul className="list-disc pl-6 mt-1">
              <li>Webhook <strong>title</strong></li>
              <li>Webhook <strong>method</strong> (GET/POST)</li>
              <li><strong>Secret</strong> — required to validate the request (sent in <code>Authorization</code> header)</li>
            </ul>
          </li>
        </ul>
      </section>

      <section className={`rounded-xl p-6 mb-8 ${subtleBg} border ${isDark ? "border-zinc-700" : "border-zinc-200"}`}>
        <h2 className="text-2xl font-semibold mb-3">Detailed Example — Webhook → Gemini → Email → Telegram</h2>

        <p className="mb-2">
          Below is a full example: webhook triggers the flow, Gemini generates content, ResendEmail sends the email, Telegram posts a notification.
        </p>

        <div className="bg-zinc-900 text-white rounded p-3 text-sm mb-4 overflow-x-auto">
          <strong>Webhook Details</strong>
          <pre className="mt-2">
{`Webhook URL: http://localhost:8000/webhooks/971511ec-82bb-47ca-a290-e80fd390dfd8
Secret: welcome123
Method: POST`}
          </pre>
        </div>

        <p className="mb-2"><strong>Example curl command</strong> (use this to trigger the webhook):</p>
        <div className="bg-zinc-900 text-white rounded p-3 text-sm mb-4 overflow-x-auto">
          <pre>
{`curl -X POST \\
  http://localhost:8000/webhooks/971511ec-82bb-47ca-a290-e80fd390dfd8 \\
  -H "Content-Type: application/json" \\
  -H "Authorization: welcome123" \\
  -d '{"name": "John", "email": "john@example.com"}'`}
          </pre>
        </div>

        <h3 className="text-lg font-semibold mb-2">Node setup walkthrough</h3>

        <ol className="list-decimal pl-6 space-y-3">
          <li>
            <strong>Gemini (node1)</strong> — select Gemini credential, then set the prompt. Example prompt:
            <div className="rounded p-2 mt-2 mb-2 bg-white/5 text-sm">
{`Write a personalized welcome email for {{ $json.body.name }}. They are interested in {{ $json.body.interest }} and enjoy {{ $json.body.hobbies }}. The email should be warm and based on this prompt: {{ $json.body.prompt }}. Return a JSON object with fields: subject, body.`}
            </div>
            <p className={textMuted}>
              Note: <code>{"{{ $json.body.* }}"}</code> values come from the webhook body. When hitting the webhook (POST), include these fields in the JSON body or the workflow will lack input and may fail.
            </p>
          </li>

          <li>
            <strong>ResendEmail (node2)</strong> — choose Resend credentials, then map fields:
            <ul className="list-disc pl-6 mt-2">
              <li>To: <code>{`{{ $json.body.email }}`}</code></li>
              <li>Subject: <code>{`{{ $node.node1.text.subject }}`}</code></li>
              <li>Body: <code>{`{{ $node.node1.text.body }}`}</code></li>
            </ul>
            <p className={textMuted}>Here <code>{`$node.node1.text.subject`}</code> and <code>{`$node.node1.text.body`}</code> are values returned by Gemini (node1).</p>
          </li>

          <li>
            <strong>Telegram (node3)</strong> — choose Telegram credentials and set the message. Example message:
            <div className="rounded p-2 mt-2 mb-2 bg-white/5 text-sm">
{`📩 Sent welcome email to {{ $json.body.name }} ({{ $json.body.email }})

👤 Details:
- Interest: {{ $json.body.interest }}
- Hobbies: {{ $json.body.hobbies }}

✉️ Email Subject: {{ $node.node1.text.subject }}

📜 Email Body:
{{ $node.node1.text.body }}`}
            </div>
          </li>
        </ol>

        <p className="mt-4">
          <strong>Important:</strong> use the exact variable forms:
        </p>
        <ul className="list-disc pl-6 mt-2">
          <li>
            <code>{`{{ $json.body.<field> }}`}</code> — fields from the webhook JSON body.
          </li>
          <li>
            <code>{`{{ $node.<nodeId>.text }}`}</code> or <code>{`{{ $node.<nodeId>.text.<field> }}`}</code> — outputs returned by a node (Gemini returns structured JSON in <code>text</code> in this example).
          </li>
        </ul>

        <div className="mt-6 text-sm text-zinc-400">
          <p><strong>Images & node references</strong> (for visual reference):</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
            <img src="https://pbs.twimg.com/media/G1E6J32WAAAg5pI?format=jpg&name=medium" alt="node example" className="rounded shadow-md" />
            <img src="https://pbs.twimg.com/media/G1E3u_oXQAANljt?format=jpg&name=medium" alt="node setup detailed" className="rounded shadow-md" />
          </div>
        </div>
      </section>


      <section className={`rounded-xl p-6 mb-8 ${cardBg} border ${isDark ? "border-zinc-700" : "border-zinc-200"}`}>
        <h2 className="text-2xl font-semibold mb-3">Example — Manual Try Two Way1</h2>

        <p className="mb-2">
          Workflow name: <strong>Manual Try Two Way1</strong> — Type: <strong>Manual</strong>
        </p>

        <p className="mb-2">Nodes & configuration (step-by-step):</p>

        <ol className="list-decimal pl-6 space-y-3">
          <li>
            <strong>Node 1 — Telegram</strong>
            <div className="rounded p-2 mt-2 bg-white/5 text-sm">
{`Message: Hello I am telegram`}
            </div>
          </li>

          <li>
            <strong>Node 2 — ResendEmail</strong>
            <div className="rounded p-2 mt-2 bg-white/5 text-sm">
{`Credential: <select your credential>
To: <yourmail>@gmail.com
Subject: Hello Mail 1
Body: Message : {{ $node.node1.message }}`}
            </div>
          </li>

          <li>
            <strong>Node 3 — ResendEmail (separate)</strong>
            <div className="rounded p-2 mt-2 bg-white/5 text-sm">
{`Credential: <select your credential>
To: <youremail>@gmail.com
Subject: Hello mail2
Body: Message: {{ $node.node1.message }}`}
            </div>
            <p className={textMuted}>Note: Node3 is connected to node1, not node2.</p>
          </li>

          <li>
            <strong>Node 4 — Telegram</strong>
            <div className="rounded p-2 mt-2 bg-white/5 text-sm">
{`Message:
Mail received from gmail 1: {{ $node.node2.body }}

Mail received from gmail 2: {{ $node.node3.body }}`}
            </div>
          </li>
        </ol>

        <div className="mt-4">
          <img src="https://pbs.twimg.com/media/G1E8HbkWYAAVbgd?format=jpg&name=medium" alt="two way workflow" className="rounded shadow-md w-full" />
        </div>
      </section>

  
      <section className={`rounded-xl p-6 mb-8 ${subtleBg} border ${isDark ? "border-zinc-700" : "border-zinc-200"}`}>
        <h2 className="text-2xl font-semibold mb-3">Gemini → Telegram examples</h2>

        <h3 className="text-lg font-semibold mb-2">1) Math example (manual)</h3>
        <div className="rounded p-3 mb-3 bg-white/5 text-sm">
{`Gemini prompt:
First calculate 3 + 4, then multiply the result by 2, then raise it to the power of 2. Return a json object with field ans.`}
        </div>
        <div className="rounded p-2 bg-white/5 text-sm">
{`Telegram message mapping:
Query: {{ $node.node1.query }}
Response: {{ $node.node1.text.ans }}`}
        </div>

        <h3 className="text-lg font-semibold mt-4 mb-2">2) Story example (manual)</h3>
        <div className="rounded p-3 mb-3 bg-white/5 text-sm">
{`Gemini prompt:
Generate a small story based on kids.`}
        </div>
        <div className="rounded p-2 bg-white/5 text-sm">
{`Telegram message:
Story: {{ $node.node1.text }}`}
        </div>
      </section>

     
      <section className={`rounded-xl p-6 mb-8 ${cardBg} border ${isDark ? "border-zinc-700" : "border-zinc-200"}`}>
        <h2 className="text-2xl font-semibold mb-3">Webhook → Email → Telegram (signup alert)</h2>
        <p className="mb-2">Node mapping example:</p>

        <div className="rounded p-3 bg-white/5 text-sm mb-3">
{`ResendEmail (node1)
To: rssmp120@gmail.com
Subject: New signup alert
Body: New signup: {{ $json.body.email }}` }
        </div>

        <div className="rounded p-3 bg-white/5 text-sm">
{`Telegram (node2)
Message: Email sent to {{ $node.node1.to }}`}
        </div>
      </section>

      <section className={`rounded-xl p-6 mb-8 ${subtleBg} border ${isDark ? "border-zinc-700" : "border-zinc-200"}`}>
        <h2 className="text-2xl font-semibold mb-3">Memory-enabled Gemini workflow (webhook)</h2>

        <p className="mb-2">
          Gemini can recall recent conversation history (if memory is enabled), up to the last 25 conversations for that workflow.
        </p>

        <div className="rounded p-3 bg-white/5 text-sm">
{`Gemini configuration:
Prompt: {{ $json.body.prompt }}
Enable Memory: (toggle on) — Gemini will utilize up to last 25 conversations.

Telegram:
Message: Gemini Response: {{ $node.node1.text }}`}
        </div>

        <div className="mt-4">
          <img src="https://pbs.twimg.com/media/G1FBGLZWgAAIlxG?format=jpg&name=medium" alt="memory workflow" className="rounded shadow-md w-full" />
        </div>
      </section>

  
      <section className={`rounded-xl p-6 mb-8 ${cardBg} border ${isDark ? "border-zinc-700" : "border-zinc-200"}`}>
        <h2 className="text-2xl font-semibold mb-3">Troubleshooting & notes</h2>

        <h3 className="font-semibold mb-2">Telegram — getting chatId</h3>
        <p className="mb-2">
          If you are using Telegram and you can't find the <code>chatId</code>:
        </p>
        <ol className="list-decimal pl-6 space-y-2">
          <li>
            Create a bot using <strong>BotFather</strong> — send <code>/newbot</code>, choose a name & username, then copy the <code>botToken</code>.
          </li>
          <li>
            Send a message to your bot (open the bot, click Start, or message it in a group).
          </li>
          <li>
            Call the bot updates endpoint:
            <div className="rounded p-2 mt-2 bg-white/5 text-sm overflow-x-auto">
              <pre>{`https://api.telegram.org/bot<botToken>/getUpdates`}</pre>
            </div>
            The response contains an object with <code>chat</code> data — the <code>id</code> value is the chatId.
          </li>
          <li>
            If <code>chatId</code> does not appear:
            <ul className="list-disc pl-6 mt-1">
              <li>Ensure you sent a message to the bot first (the bot only receives updates after being messaged).</li>
              <li>If you used a group, make sure the bot is added to the group and the group has at least one message after bot addition.</li>
              <li>Try sending <code>/start</code> to the bot directly in a 1:1 chat to produce updates.</li>
              <li>As an alternative, use a quick test endpoint or a small script to fetch updates until you see the chat object.</li>
            </ul>
          </li>
        </ol>

        <h3 className="font-semibold mt-4 mb-2">Variable/access patterns quick reference</h3>
        <ul className="list-disc pl-6 space-y-2">
          <li><code>{`{{ $json.body.<field> }}`}</code> — access webhook input fields sent in POST body.</li>
          <li><code>{`{{ $node.<nodeId>.<field> }}`}</code> — access raw node-level fields.</li>
          <li><code>{`{{ $node.<nodeId>.text }}`}</code> — common for Gemini/text outputs (JSON or string).</li>
        </ul>

        <p className="mt-4 text-sm text-zinc-400">
          <strong>Tip:</strong> when composing prompts or templates, test with a small webhook POST (or manual run) and inspect execution logs to confirm which exact field names appear in outputs — that helps determine whether to use <code>.text</code> or direct fields.
        </p>
      </section>

      <footer className="text-sm text-zinc-500 mt-6">
        <p>
          That’s everything — full step-by-step instructions, examples, images, and variable mapping patterns.
          If you want I can also:
        </p>
        <ul className="list-disc pl-6 mt-2 text-sm">
          <li>Make the curl/example blocks copyable with your <code>CopyBox</code> component.</li>
          <li>Turn example flows into downloadable JSON that can be imported into the canvas.</li>
          <li>Add small interactive demos (mock API) for testing without a backend.</li>
        </ul>
      </footer>
    </div>
  );
}
