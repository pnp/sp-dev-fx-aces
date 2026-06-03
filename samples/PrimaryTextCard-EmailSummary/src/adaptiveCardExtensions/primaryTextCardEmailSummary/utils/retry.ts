const TRANSIENT_STATUS_CODES: ReadonlySet<number> = new Set<number>([429, 503, 504]);

function wait(delayMs: number): Promise<void> {
  return new Promise((resolve: () => void) => {
    setTimeout(resolve, delayMs);
  });
}

export async function withRetry<T>(
  operation: () => Promise<T>,
  maxAttempts: number = 3,
  baseDelayMs: number = 500
): Promise<T> {
  let lastError: unknown;

  for (let attempt: number = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await operation();
    } catch (error: unknown) {
      lastError = error;
      const status: number | undefined = (error as { status?: number }).status;
      const shouldRetry: boolean = attempt < maxAttempts && status !== undefined && TRANSIENT_STATUS_CODES.has(status);

      if (!shouldRetry) {
        throw error;
      }

      const delayMs: number = Math.pow(2, attempt - 1) * baseDelayMs;
      await wait(delayMs);
    }
  }

  throw lastError;
}
