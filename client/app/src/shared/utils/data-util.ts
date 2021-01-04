export function applyIf<T>(target: T, source: Record<string, unknown>): T {
  const t = target as Record<string, unknown>;
  Object.keys(target).forEach((key: string) => {
    if (source.hasOwnProperty(key)) {
      t[key] = source[key];
    }
  });
  return target;
}
