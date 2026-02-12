export type GenerateTokenService = (payload: Record<string, unknown>) => string;

export type VerifyTokenService = (toke: string) => Record<string, unknown>;
