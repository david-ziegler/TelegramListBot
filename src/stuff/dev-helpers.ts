export function pretty(object: unknown): string {
  return JSON.stringify(object, null, 2);
}

export async function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}