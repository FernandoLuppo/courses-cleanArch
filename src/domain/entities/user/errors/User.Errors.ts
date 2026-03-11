export const UserErrors = {
  USER_NOT_FOUND: "USER_NOT_FOUND",
  EMAIL_ALREADY_EXISTS: "EMAIL_ALREADY_EXISTS",
  INVALID_PASSWORD: "INVALID_PASSWORD",
  DEFAULT: "DEFAULT"
} as const

export type UserError = (typeof UserErrors)[keyof typeof UserErrors]
