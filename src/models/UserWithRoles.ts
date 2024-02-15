import { User } from './admin/User';
export interface UserWithRoles{
    user:User,
    roles:string[]
}