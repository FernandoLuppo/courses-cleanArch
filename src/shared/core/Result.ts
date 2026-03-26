export const Result = {
  ok<T>(data: T): Result<T> {
    return { success: true, data }
  },

  okVoid(): Result<void> {
    return { success: true, data: undefined }
  },

  fail(error: ResultError): Result<never> {
    return { success: false, error }
  }
}

type ResultError = {
  code: string
  message: string
}

export type Result<T> =
  | { success: true; data: T }
  | { success: false; error: ResultError }
