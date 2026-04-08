import type { TokenPayload } from "../types/token.type";

export type GenerateTokenService = (payload: TokenPayload) => string;

export type VerifyTokenService = (toke: string) => TokenPayload;
