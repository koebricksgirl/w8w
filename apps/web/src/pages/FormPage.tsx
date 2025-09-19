import { useParams } from "react-router-dom";
import { useState } from "react";
import { useForm, useSubmitForm } from "../hooks/useForms";
import { nodeIcons } from "../lib/nodeIcons";
import { useThemeStore } from "../store/useThemeStore";

export default function FormPage() {
    const { formId } = useParams<{ formId: string }>();
    const [secret, setSecret] = useState("");
    const [enteredSecret, setEnteredSecret] = useState<string | null>(null);
    const { theme } = useThemeStore();
    const isDark = theme === 'dark';

    const { data, error, isLoading } = useForm(formId!, enteredSecret || undefined);
    const submitForm = useSubmitForm(formId!);

    if (isLoading) return <p className="p-4">Loading form...</p>;
    if (error) return <p className="p-4 text-red-500">Error loading form</p>;

    if (data?.form?.secret && !enteredSecret) {
        return (
            <div className="p-6 max-w-md mx-auto space-y-4 border border-white">
                <h2 className="text-xl font-bold">This form is protected</h2>
                <input
                    type="password"
                    placeholder="Enter form secret"
                    value={secret}
                    onChange={(e) => setSecret(e.target.value)}
                    className="w-full border px-3 py-2 rounded"
                />
                <button
                    onClick={() => setEnteredSecret(secret)}
                    className="px-4 py-2 bg-blue-500 text-white rounded"
                >
                    Unlock
                </button>
            </div>
        );
    }

    const form = data?.form;
    if (!form) return <p className="p-4">Form not found or inactive</p>;

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formElement = e.currentTarget;
        const formData = new FormData(formElement);
        const values: Record<string, any> = {};
        formData.forEach((v, k) => (values[k] = v));

        const missingFields = form.fields.filter(f => f.required && !values[f.key]).map(f => f.label);

        if (missingFields.length > 0) {
            alert(`Please fill all required fields: ${missingFields.join(", ")}`);
            return;
        }

        try {
            const res = await submitForm.mutateAsync(values);
            console.log("Submit result:", res);
            if (res?.message === "Form Submitted") {
                alert("Form submitted successfully!");
                formElement.reset();
            } else {
                alert("Something went wrong: " + (res?.message || "Unknown error"));
            }
        } catch (err: any) {
            console.error(err);
            alert("Failed to submit form: " + (err?.message || "Unknown error"));
        }

    };

    return (
        <div className={`min-h-[80vh] max-w-lg mx-auto my-4 p-6 space-y-6 border ${isDark ? "border-white rounded-md" : "border-black rounded-md"}`}>
            <h1 className="flex gap-4 text-2xl font-bold">
                <img src={nodeIcons["Workflow"]} className="h-5 w-5 mt-2" alt="Workflow" />
                {form.title}
            </h1>
            <form onSubmit={handleSubmit} className="space-y-4">
                {form.fields.map((field, idx) => {
                    switch (field.type) {
                        case "text":
                        case "email":
                        case "password":
                        case "number":
                            return (
                                <div key={idx}>
                                    <label className="block mb-1">{field.label} {field.required ? <span className="text-red-400 mt-1">*</span> : "(Optional)"}</label>
                                    <input
                                        type={field.type}
                                        name={field.key}
                                        placeholder={field.placeholder || ""}
                                        required={field.required}
                                        className="w-full border px-3 py-2 rounded"
                                    />
                                </div>
                            );
                        case "textarea":
                            return (
                                <div key={idx}>
                                    <label className="block mb-1">{field.label} {field.required ? <span className="text-red-400 mt-1">*</span> : "(Optional)"}</label>
                                    <textarea
                                        name={field.key}
                                        placeholder={field.placeholder || ""}
                                        required={field.required}
                                        className="w-full border px-3 py-2 rounded"
                                    />
                                </div>
                            );
                        case "select":
                            return (
                                <div key={idx}>
                                    <label className="block mb-1">{field.label} {field.required ? <span className="text-red-400 mt-1">*</span> : "(Optional)"}</label>
                                    <select
                                        name={field.key}
                                        required={field.required}
                                        className="w-full border px-3 py-2 rounded"
                                    >
                                        {field.options?.map((opt: string, i: number) => (
                                            <option key={i} value={opt}>
                                                {opt}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            );
                        case "radio":
                            return (
                                <div key={idx}>
                                    <label className="block mb-1">{field.label} {field.required ? <span className="text-red-400 mt-1">*</span> : "(Optional)"}</label>
                                    <div className="space-y-1">
                                        {field.options?.map((opt: string, i: number) => (
                                            <label key={i} className="flex items-center gap-2">
                                                <input
                                                    type="radio"
                                                    name={field.key}
                                                    value={opt}
                                                    required={field.required}
                                                />
                                                {opt}
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            );
                        default:
                            return null;
                    }
                })}
                <button
                    type="submit"
                    disabled={submitForm.isPending}
                    className="px-4 py-2 bg-green-500 text-white rounded"
                >
                    {submitForm.isPending ? "Submitting..." : "Submit"}
                </button>
            </form>
        </div>
    );
}
