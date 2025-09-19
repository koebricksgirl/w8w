export function validateFormFields(fields: any[]) {
  const keys = fields.map(f => f.key?.trim());
  const duplicates = keys.filter((k, i) => keys.indexOf(k) !== i);

  if (duplicates.length > 0) {
    return `Duplicate keys found in form fields: ${duplicates.join(", ")}`;
  }
  return null;
}
