export function getEnv(key: string): string | undefined {
  const g = globalThis as unknown as Record<string, unknown>;
  const nitroEnv = g["__env__"] as Record<string, unknown> | undefined;
  const env = g["env"] as Record<string, unknown> | undefined;
  const proc = g["process"] as { env?: Record<string, unknown> } | undefined;

  return (
    (nitroEnv?.[key] as string) ||
    (env?.[key] as string) ||
    (proc?.env?.[key] as string) ||
    undefined
  );
}
