import type { WorkflowCredential } from "../../types/workflow";

export function CredentialViewBody({ credential }: { credential: WorkflowCredential }) {
    return (
        <div className="space-y-4">
            <div>
                <span className="font-semibold">Title:</span> {credential.title}
            </div>
            <div>
                <span className="font-semibold">Platform:</span> {credential.platform}
            </div>
            <div>
                <span className="font-semibold">Details:</span>
                <table className="mt-2 w-full text-sm border border-zinc-700 rounded">
                    <tbody>
                        {Object.entries(credential.data).map(([key, value]) => (
                            <tr key={key} className="border-b border-zinc-700 last:border-b-0">
                                <td className="py-1 px-2 font-medium text-zinc-400">{key}</td>
                                <td className="py-1 px-2 break-all">{String(value)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
