import { sign, verify } from "jsonwebtoken";
import type {
  GenerateTokenService,
  VerifyTokenService,
} from "../../../shared/domain/services/token.service";
import { jwtPayloadSchema } from "../schemas/token.schemta";

export const generateTokenService: GenerateTokenService = (payload): string => {
  const secret = process.env.JWT_SECRET || "default_secret_change_me";

  return sign(payload, secret, { expiresIn: "1h" });
};

export const verifyTokenService: VerifyTokenService = (token: string) => {
  const secret = process.env.JWT_SECRET || "default_secret_change_me";

  const decoded = verify(token, secret);

  return jwtPayloadSchema.parse(decoded);
};
