import { z } from "zod/v4";

export const jwtPayloadSchema = z.object({
  id: z.string(),
  username: z.string(),
  email: z.string(),
});
