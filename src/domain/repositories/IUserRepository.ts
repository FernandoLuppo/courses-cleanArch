import { User } from "../entities/User"

export interface IUserRepository {
  create(user: User): Promise<boolean>
  update(user: User): Promise<void>
  deleteByEmail(email: string): Promise<boolean>
  findByEmail(email: string): Promise<User | null>
}
