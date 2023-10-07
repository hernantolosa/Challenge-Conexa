import { UserRole } from "../enums/roles.enum";

export interface User {
  userId: number;
  username: string;
  role: UserRole;
}
