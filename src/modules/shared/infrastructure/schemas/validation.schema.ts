import { z } from "zod/v4";

export const validationErrorSchema = z
  .object({
    message: z.string(),
    details: z
      .array(
        z.object({
          field: z.string(),
          issue: z.string(),
        }),
      )
      .optional(),
  })
  .describe("Error de validación en los datos enviados");
