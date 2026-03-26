import z from "zod"
import { DefaultSchema } from "../Default.Schema"

export const loginSchema = z
  .object()
  .merge(DefaultSchema)
  .pick({ email: true, password: true })
  .required()
