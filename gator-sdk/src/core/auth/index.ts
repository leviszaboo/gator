import { Base } from "../base";
import { User } from "../user";

export class Auth extends Base {
  protected currentUser: User | null = null;

  constructor(gatorConfig: any) {
    super(gatorConfig);
  }

  createUser(email: string, password: string) {}

  loginUser(email: string, password: string) {}

  logoutUser() {}
}
