// Exclude keys from model
export function exclude(data: any, keys: string[]) {
  return Object.fromEntries(
    Object.entries(data).filter(([key]) => !keys.includes(key)),
  );
}
