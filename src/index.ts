import cors from "@fastify/cors";
import fastifyMultipart from "@fastify/multipart";
import fastifySwagger from "@fastify/swagger";
import fastifySwaggerUi from "@fastify/swagger-ui";
import Fastify from "fastify";
import {
  hasZodFastifySchemaValidationErrors,
  jsonSchemaTransform,
  serializerCompiler,
  validatorCompiler,
  type ZodTypeProvider,
} from "fastify-type-provider-zod";
import { userRoutes } from "./modules/user/infrastructure/router/user.router";

const fastify = Fastify({
  logger: true,
}).withTypeProvider<ZodTypeProvider>();

fastify.setValidatorCompiler(validatorCompiler);
fastify.setSerializerCompiler(serializerCompiler);

const start = async () => {
  try {
    await fastify.register(cors, {
      origin: "*",
    });

    await fastify.register(fastifyMultipart, {
      limits: { fileSize: 5 * 1024 * 1024 },
    });

    fastify.setErrorHandler((error, request, reply) => {
      if (hasZodFastifySchemaValidationErrors(error)) {
        return reply.status(400).send({
          message: "Datos de entrada inválidos",
          details: error.validation.map((err) => ({
            field: err.instancePath,
            issue: err.message,
          })),
        });
      }

      request.log.error(error);
      return reply.status(500).send({
        message: "Error interno del servidor",
      });
    });

    await fastify.register(fastifySwagger, {
      openapi: {
        info: {
          title: "Todo Backend API",
          description: "API de gestión de tareas con Arquitectura Hexagonal",
          version: "1.0.0",
        },
        components: {
          securitySchemes: {
            bearerAuth: {
              type: "http",
              scheme: "bearer",
              bearerFormat: "JWT",
            },
          },
        },
      },
      transform: jsonSchemaTransform,
    });

    await fastify.register(fastifySwaggerUi, {
      routePrefix: "/docs",
    });

    await fastify.register(userRoutes);

    await fastify.listen({ port: 3000 });
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
