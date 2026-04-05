import { ZodSchema } from "zod"
import { MiddlewareContract } from "../contracts/Middleware.Contract"
import { HttpAdapterContract } from "../contracts/HttpAdapter.Contract"

export class ValidateMiddleware implements MiddlewareContract {
  constructor(private readonly schema: ZodSchema) {}

  public async handle(httpAdapter: HttpAdapterContract): Promise<void> {
    const result = this.schema.safeParse(httpAdapter.body())

    if (!result.success) {
      return httpAdapter.send(400, {
        success: false,
        message: "Validation failed",
        error: result.error.flatten()
      })
    }

    httpAdapter.setBody(result.data)
    return httpAdapter.next()
  }
}
