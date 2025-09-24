import { useEffect, useState } from "react";
import type { Field, FormNodeConfigProps } from "../../types/node";
import { FRONTEND_URL } from "../../utils/config";
import { CopyBox } from "../CopyBox";
import { useCloseForm, useOpenForm, useUpdateFormSecret } from "../../hooks/useForms";
import { useNavigate } from "react-router-dom";

export default function FormNodeConfig({ initialFields, onSave, formEntry }: FormNodeConfigProps) {
    const [mode, setMode] = useState<"builder" | "json">("builder");
    const [fields, setFields] = useState<Field[]>(initialFields || []);
    const [rawJson, setRawJson] = useState(
        JSON.stringify(initialFields || [], null, 2)
    );
    const [active, setActive] = useState<boolean>(formEntry?.isActive ?? true);
    const [secretValue, setSecretValue] = useState(formEntry?.secret || "");

    const { mutate: openForm } = useOpenForm();
    const { mutate: closeForm } = useCloseForm();
    const { mutate: updateSecret } = useUpdateFormSecret();
    
    const navigate = useNavigate();

    useEffect(() => {
  setSecretValue(formEntry?.secret || "");
}, [formEntry?.secret]);


    const addField = () => {
        setFields([...fields, { label: "", key: "", type: "text", required: false }]);
    }

    const removeField = (index: number) => {
        setFields(fields.filter((_, i) => i !== index));
    }

    const updateField = (index: number, key: keyof Field, value: any) => {
        const updated = [...fields];
        (updated[index] as any)[key] = value;
        setFields(updated);
    };

    const addOption = (fieldIndex: number) => {
        const updated = [...fields];
        if (!updated[fieldIndex].options) updated[fieldIndex].options = [];
        updated[fieldIndex].options.push("");
        setFields(updated);
    };


    const updateOption = (fieldIndex: number, optionIndex: number, value: string) => {
        const updated = [...fields];
        if (updated[fieldIndex].options) {
            updated[fieldIndex].options![optionIndex] = value;
        }
        setFields(updated);
    };

    const removeOption = (fieldIndex: number, optionIndex: number) => {
        const updated = [...fields];
        if (updated[fieldIndex].options) {
            updated[fieldIndex].options = updated[fieldIndex].options!.filter(
                (_, i) => i !== optionIndex
            );
        }
        setFields(updated);
    };

    const handleSave = () => {
        const finalFields = mode === "builder" ? fields : JSON.parse(rawJson || "[]");

        const keys = finalFields.map((f: Field) => f.key.trim());
        const duplicates = keys.filter((k: string, i: number) => keys.indexOf(k) !== i);


        if (duplicates.length > 0) {
            alert(`Duplicate keys found: ${duplicates.join(", ")}`);
            return;
        }
        onSave(finalFields);
        alert("save fields")
    };


    return (
        <div className="space-y-4">
            <div className="flex gap-2">
                <button
                    className={`px-3 py-1 rounded ${mode === "builder" ? "bg-blue-500 text-white" : "bg-gray-600 border border-white"}`}
                    onClick={() => setMode("builder")}
                >
                    Builder
                </button>
                <button
                    className={`px-3 py-1 rounded ${mode === "json" ? "bg-blue-500 text-white" : "bg-gray-600 border border-white"}`}
                    onClick={() => setMode("json")}
                >
                    JSON
                </button>
            </div>

            {mode === "builder" && (
                <div className="space-y-4">
                    {fields.map((f, idx) => (
                        <div key={idx} className="border p-2 rounded space-y-1">
                            <input
                                type="text"
                                value={f.key || ""}
                                placeholder="Field Key (e.g. 'name')"
                                onChange={(e) => updateField(idx, "key", e.target.value)}
                                className="w-full border p-1 rounded"
                            />
                            <input
                                type="text"
                                value={f.label}
                                placeholder="Field Label"
                                onChange={(e) => updateField(idx, "label", e.target.value)}
                                className="w-full border p-1 rounded"
                            />
                            <select
                                value={f.type}
                                onChange={(e) => updateField(idx, "type", e.target.value)}
                                className="w-full border p-1 rounded"
                            >
                                <option value="text">Text</option>
                                <option value="email">Email</option>
                                <option value="password">Password</option>
                                <option value="number">Number</option>
                                <option value="textarea">Textarea</option>
                                <option value="select">Select</option>
                                <option value="radio">Radio</option>
                            </select>
                            {(f.type === "text" ||
                                f.type === "email" ||
                                f.type === "password" ||
                                f.type === "number" ||
                                f.type === "textarea") && (
                                    <input
                                        type="text"
                                        value={f.placeholder || ""}
                                        placeholder="Placeholder"
                                        onChange={(e) => updateField(idx, "placeholder", e.target.value)}
                                        className="w-full border p-1 rounded"
                                    />
                                )}

                            <label className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    checked={f.required || false}
                                    onChange={(e) => updateField(idx, "required", e.target.checked)}
                                />
                                Required
                            </label>

                            {(f.type === "select" || f.type === "radio") && (
                                <div className="space-y-2">
                                    <p className="text-sm font-medium">Options:</p>
                                    {f.options?.map((opt, i) => (
                                        <div key={i} className="flex gap-2">
                                            <input
                                                type="text"
                                                value={opt}
                                                onChange={(e) => updateOption(idx, i, e.target.value)}
                                                className="flex-1 border p-1 rounded"
                                            />
                                            <button
                                                className="px-2 py-1 bg-red-500 text-white rounded"
                                                onClick={() => removeOption(idx, i)}
                                            >
                                                X
                                            </button>
                                        </div>
                                    ))}
                                    <button
                                        className="px-2 py-1 bg-green-500 text-white rounded"
                                        onClick={() => addOption(idx)}
                                    >
                                        + Add Option
                                    </button>
                                </div>
                            )}

                            <button
                                className="px-2 py-1 bg-red-500 text-white rounded"
                                onClick={() => removeField(idx)}
                            >
                                Remove Field
                            </button>
                        </div>
                    ))}
                    <button
                        className="px-3 py-1 bg-green-500 text-white rounded"
                        onClick={addField}
                    >
                        + Add Field
                    </button>
                </div>
            )}

            <div className="flex justify-end">
                <button
                    className="px-4 py-2 bg-blue-500 text-white rounded"
                    onClick={handleSave}
                >
                    Save Fields
                </button>
            </div>


            {mode === "json" && (
                <textarea
                    value={rawJson}
                    onChange={(e) => setRawJson(e.target.value)}
                    className="w-full border rounded p-2 min-h-[150px]"
                />
            )}

            <div className={`p-2 rounded-lg bg-zinc-100 dark:bg-zinc-800`}>
                <h4 className="font-medium mb-2">Form URL</h4>
                {formEntry ? (
                    <div className="space-y-2">
                        <span>{formEntry.title || "Untitled Form"}</span>
                        <div className="flex items-center justify-between">
                            <CopyBox className="block p-2 rounded bg-black text-white overflow-x-hidden" text={`${FRONTEND_URL}/forms/${formEntry.id}`} />
                        </div>
                        <div>
                            <h3
                            className="text-yellow-600 cursor-pointer mb-2"
                            onClick={() => {
                                navigate(`/form/${formEntry.id}/responses`)
                            }}
                            >Form Responses</h3>
                             <CopyBox className="block p-2 rounded bg-black text-white overflow-x-hidden" text={`${FRONTEND_URL}/form/${formEntry.id}/responses`} />
                        </div>
                    </div>
                ) : (
                    <p className="text-sm text-zinc-500">Form not yet created. Save workflow first.</p>
                )}

                {formEntry && (
                    <div className="p-2 rounded-lg bg-zinc-100 dark:bg-zinc-800 space-y-4">
                        <h4 className="font-medium">Form Controls</h4>
                        <div className="flex items-center justify-between">
                            <span className="text-sm">Form Active</span>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    className="sr-only peer"
                                    checked={active}
                                    onChange={async (e) => {
                                        try {
                                             setActive(e.target.checked); 

                                            if (e.target.checked) {
                                                openForm(formEntry.id, {
                                                    onSuccess: () => alert("Form opened"),
                                                    onError: () => {
                                                        setActive(false); 
                                                        alert("Failed to open form");
                                                    }
                                                });

                                            } else {
                                                closeForm(formEntry.id, {
                                                    onSuccess: () => alert("Form closed"),
                                                    onError: () => {
                                                        setActive(true);
                                                        alert("Failed to close form")
                                                    }
                                                });

                                            }
                                        } catch (err) {
                                            console.error(err);
                                            alert("Failed to toggle form");
                                        }
                                    }}
                                />
                                <div className="w-11 h-6 bg-gray-300 rounded-full peer peer-checked:bg-green-500 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full" />
                            </label>
                        </div>

                        <div>
                            <label className="block text-sm mb-1">Form Secret</label>
                            <input
                                type="text"
                                defaultValue={formEntry.secret || ""}
                                placeholder="Enter secret (optional)"
                                className="w-full border px-2 py-1 rounded"
                                onChange={(e) => setSecretValue(e.target.value)}
                                onBlur={async () => {
                                    try {
                                        updateSecret(
                                            { formId: formEntry.id, secret: secretValue }, 
                                            {
                                                onSuccess: () => alert("secret updated"),
                                                onError: () => alert("Failed to update secret"),
                                            }
                                        );

                                    } catch (err) {
                                        console.error(err);
                                        alert("Failed to update secret");
                                    }
                                }}
                            />
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
}
