import { Result } from "../../../shared/core/Result"
import { HttpAdapterContract } from "../contracts/HttpAdapter.Contract"
import { ErrorMapper } from "../mappers/Error.Mapper"

export abstract class BaseController {
  protected handleResult<T>(
    result: Result<T>,
    httpAdapter: HttpAdapterContract,
    successStatus = 200
  ): void {
    if (result.success) {
      return httpAdapter.send(successStatus, {
        success: true,
        data: result.data
      })
    }

    const status = ErrorMapper.toHttpStatus(result.error.code)

    return httpAdapter.send(status, {
      success: false,
      error: result.error,
      message: result.error.message
    })
  }
}
