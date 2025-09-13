import { useState } from "react";
import type { Platform } from "@w8w/db";
import { PLATFORM_FIELDS, PLATFORM_OPTIONS } from "../../utils/platforms";
import type { Credential } from "../../types/credential";

export function CredentialEditBody({
  credential,
  onSave,
  onCancel,
}: {
  credential: Credential;
  onSave: (updated: Credential) => void;
  onCancel: () => void;
}) {
  const [title, setTitle] = useState(credential.title);
  const [platform, setPlatform] = useState<Platform>(credential.platform as Platform);

  const initialData = Object.fromEntries(
    (PLATFORM_FIELDS[platform] || []).map(f => [f.key, credential.data?.[f.key] ?? ""])
  );
  const [data, setData] = useState<{ [key: string]: string }>(initialData);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const handlePlatformChange = (newPlatform: Platform) => {
    setPlatform(newPlatform);
    const newFields = PLATFORM_FIELDS[newPlatform] || [];
    setData(Object.fromEntries(newFields.map(f => [f.key, ""])));
    setErrors({});
  };

  const handleFieldChange = (key: string, value: string) => {
    setData(prev => ({ ...prev, [key]: value }));
    setErrors(prev => ({ ...prev, [key]: "" }));
  };

  const validate = () => {
    const fields = PLATFORM_FIELDS[platform] || [];
    const newErrors: { [key: string]: string } = {};
    fields.forEach(f => {
      const val = data[f.key] ?? "";
      if (f.required && !val) {
        newErrors[f.key] = `${f.label} is required`;
      }
      if (f.pattern && val && !f.pattern.test(val)) {
        newErrors[f.key] = `Invalid ${f.label}`;
      }
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (!validate()) return;
    onSave({
      ...(credential.id ? { id: credential.id } : {}),
      title,
      platform,
      data,
      ...(credential.createdAt !== undefined ? { createdAt: credential.createdAt } : { createdAt: "" }),
    });
  };

  return (
    <form
      className="space-y-4"
      onSubmit={e => {
        e.preventDefault();
        handleSave();
      }}
    >
      <div>
        <label className="block font-semibold mb-1">Title</label>
        <input
          className="w-full border rounded px-2 py-1"
          value={title}
          onChange={e => setTitle(e.target.value)}
          required
        />
      </div>
      <div>
        <label className="block font-semibold mb-1">Platform</label>
        <select
          className="w-full border rounded px-2 py-1"
          value={platform}
          onChange={e => handlePlatformChange(e.target.value as Platform)}
          required
        >
          {PLATFORM_OPTIONS.map(opt => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>
      </div>
      <div>
        <label className="block font-semibold mb-1">Details</label>
        <div className="space-y-2">
          {(PLATFORM_FIELDS[platform] || []).map(field => (
            <div key={field.key}>
              <input
                className="border rounded px-2 py-1 w-full"
                value={data[field.key] ?? ""}
                placeholder={field.placeholder || field.label}
                onChange={e => handleFieldChange(field.key, e.target.value)}
                required={field.required}
                type={field.type || "text"}
              />
              {errors[field.key] && (
                <div className="text-red-500 text-xs mt-1">{errors[field.key]}</div>
              )}
            </div>
          ))}
        </div>
      </div>
      <div className="flex gap-2 justify-end">
        <button
          type="button"
          className="px-4 py-2 rounded bg-zinc-200 dark:bg-zinc-700"
          onClick={onCancel}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
        >
          Save
        </button>
      </div>
    </form>
  );
}
