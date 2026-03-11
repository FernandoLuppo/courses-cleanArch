export type Result<T, E> =
  | { success: true; data: T }
  | { success: false; error: E }

export const Result = {
  ok<T>(data: T): Result<T, never> {
    return { success: true, data }
  },

  okVoid(): Result<void, never> {
    return { success: true, data: undefined }
  },

  fail<E>(error: E): Result<never, E> {
    return { success: false, error }
  }
}
