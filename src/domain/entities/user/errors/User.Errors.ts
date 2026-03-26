export const UserErrors = {
  USER_NOT_FOUND: {
    code: "USER_NOT_FOUND",
    message: "User not found"
  },
  EMAIL_ALREADY_EXISTS: {
    code: "EMAIL_ALREADY_EXISTS",
    message: "Email already exists"
  },
  INVALID_PASSWORD: {
    code: "INVALID_PASSWORD",
    message: "Invalid password"
  },
  DEFAULT: {
    code: "DEFAULT",
    message: "Default error"
  },
  UNAUTHORIZED: {
    code: "UNAUTHORIZED",
    message: "Unauthorized"
  },
  BAD_REQUEST: {
    code: "BAD_REQUEST",
    message: "Bad request"
  }
} as const

export type UserError = (typeof UserErrors)[keyof typeof UserErrors]
