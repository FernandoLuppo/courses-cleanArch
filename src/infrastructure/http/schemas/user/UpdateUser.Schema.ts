import z from "zod"
import { DefaultSchema } from "../Default.Schema"

export const updatedUserSchema = z
  .object({
    name: z.string().min(3, "Name is too short").max(255, "Name is too long")
  })
  .merge(DefaultSchema)
  .strict()
