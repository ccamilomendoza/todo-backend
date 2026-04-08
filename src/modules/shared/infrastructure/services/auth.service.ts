import type { FastifyRequest } from "fastify";
import { fail, ok } from "../../domain/rules/result/result.rules";
import type { Result } from "../../domain/types/result.type";
import type { TokenPayload } from "../../domain/types/token.type";
import { verifyTokenService } from "./jwt.service";

export const getAuthenticatedUser = (
  request: FastifyRequest,
): Result<TokenPayload, string> => {
  const authHeader = request.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer")) {
    return fail("Token requerido o formato inválido");
  }

  try {
    const token = authHeader.split(" ")[1];

    const user = verifyTokenService(token);

    return ok(user);
  } catch (_error) {
    return fail("Token inválido, malformado o expirado");
  }
};
