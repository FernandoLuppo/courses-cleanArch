type User = {
  email: string
  password: string
  id: string
}

type TestData = {
  id: string
  cookies: {
    accessToken: { Name: string; Value: string }[]
    refreshToken: { Name: string; Value: string }[]
  }
}

type GetUserResponse = {
  success: boolean
  data?: {
    email: string
  }
}

type LoginResponse = {
  success: boolean
  data?: {
    email: string
  }
}

export { User, TestData, GetUserResponse, LoginResponse }
