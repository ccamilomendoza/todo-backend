import jwt from "jsonwebtoken";
import type {
  GenerateTokenService,
  VerifyTokenService,
} from "../../domain/services/token.service";

export const generateTokenService: GenerateTokenService = (
  payload: Record<string, unknown>,
): string => {
  const secret = process.env.JWT_SECRET || "default_secret_change_me";

  return jwt.sign(payload, secret, { expiresIn: "1h" });
};

export const verifyTokenService: VerifyTokenService = (
  token: string,
): Record<string, unknown> => {
  const secret = process.env.JWT_SECRET || "default_secret_change_me";
  return jwt.verify(token, secret) as Record<string, unknown>;
};
