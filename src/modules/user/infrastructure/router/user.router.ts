import type { FastifyPluginAsync } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import { validationErrorSchema } from "../../../shared/infrastructure/schemas/validation.schema";
import { signInController } from "../controllers/sign-in/sign-in.controller";
import { signUpController } from "../controllers/sign-up/sign-up.controller";
import { updateAvatarController } from "../controllers/update-avatar/update-avatar.controller";
import { signInUserSchema, signUpUserSchema } from "../schemas/user.schema";

export const userRoutes: FastifyPluginAsync = async (fastify) => {
  const typedFastify = fastify.withTypeProvider<ZodTypeProvider>();

  typedFastify.patch(
    "/user/avatar",
    {
      schema: {
        tags: ["User"],
        summary: "Actualizar Avatar",
        description:
          "Sube una imagen para actualizar el avatar del usuario. Requiere Header Authorization.",
        security: [{ bearerAuth: [] }],
        consumes: ["multipart/form-data"],
        response: {
          200: z
            .object({ avatarUrl: z.string() })
            .describe("Avatar subido exitosamente"),
          400: z
            .object({ message: z.string() })
            .describe("Error en la solicitud"),
          401: z.object({ message: z.string() }).describe("No autorizado"),
          500: z.object({ message: z.string() }).describe("Error interno"),
        },
      },
    },
    updateAvatarController,
  );

  typedFastify.post(
    "/user",
    {
      schema: {
        tags: ["User"],
        summary: "Registrar un nuevo usuario",
        description:
          "Crea un usuario en el sistema validando que el username y el email sean únicos.",
        body: signUpUserSchema,
        response: {
          201: z
            .object({ message: z.string() })
            .describe("Usuario creado exitosamente"),
          400: validationErrorSchema,
          409: z
            .object({ message: z.string() })
            .describe("Conflicto: El nombre de usuario o correo ya existen"),
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
          400: validationErrorSchema,
          401: z
            .object({ message: z.string() })
            .describe(
              "Credenciales inválidas (Usuario no encontrado o contraseña incorrecta)",
            ),
          500: z
            .object({ message: z.string() })
            .describe("Error interno del servidor"),
        },
      },
    },
    signInController,
  );
};
