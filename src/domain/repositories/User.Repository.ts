import { User } from "../entities/user/User.Entity"

export interface IUserRepository {
  create(user: User): Promise<User | null>
  update(user: User): Promise<User | null>
  delete(id: string): Promise<boolean>
  findById(id: string): Promise<User | null>
  findByEmail(email: string): Promise<User | null>
}
