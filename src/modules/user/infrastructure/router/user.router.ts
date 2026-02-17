import type { FastifyPluginAsync } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import { signInController } from "../controllers/sign-in/sign-in.controller";
import { signUpController } from "../controllers/sign-up/sign-up.controller";
import { signInUserSchema, signUpUserSchema } from "../schemas/user.schema";

export const userRoutes: FastifyPluginAsync = async (fastify) => {
  const typedFastify = fastify.withTypeProvider<ZodTypeProvider>();

  typedFastify.post(
    "/user",
    {
      schema: {
        tags: ["User"],
        summary: "Registrar un nuevo usuario",
        description: "Crea un usuario en el sistema",
        body: signUpUserSchema,
        response: {
          201: z
            .object({ message: z.string() })
            .describe("Usuario creado exitosamente"),
          400: z
            .object({ message: z.string() })
            .describe("Error de validación"),
          409: z
            .object({ message: z.string() })
            .describe("El usuario ya existe"),
          500: z
            .object({ message: z.string() })
            .describe("Error interno del servidor"),
        },
      },
    },
    signUpController,
  );

  typedFastify.post(
    "/user/sign-in",
    {
      schema: {
        tags: ["User"],
        summary: "Iniciar sesión",
        description: "Autentica a un usuario y retorna un token JWT",
        body: signInUserSchema,
        response: {
          200: z
            .object({ token: z.string() })
            .describe("Autenticación exitosa"),
          400: z
            .object({ message: z.string() })
            .describe("Error de validación"),
          401: z
            .object({ message: z.string() })
            .describe("Credenciales inválidas"),
          500: z
            .object({ message: z.string() })
            .describe("Error interno del servidor"),
        },
      },
    },
    signInController,
  );
};
