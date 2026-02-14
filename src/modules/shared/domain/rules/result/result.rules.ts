import type { Result } from "../../types/result.type";

export const fail = <Error>(error: Error): Result<never, Error> => ({
  success: false,
  error,
});

export const ok = <Value>(value: Value): Result<Value, never> => ({
  success: true,
  value,
});
