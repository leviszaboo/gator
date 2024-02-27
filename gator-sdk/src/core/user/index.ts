export class User {
  protected id: string;
  protected email: string;
  protected emailVerified: boolean;
  protected accessToken: string;
  protected refreshToken: string;

  constructor(
    id: string,
    email: string,
    emailVerified: boolean,
    accessToken: string,
    refreshToken: string,
  ) {
    this.id = id;
    this.email = email;
    this.emailVerified = emailVerified;
    this.accessToken = accessToken;
    this.refreshToken = refreshToken;
  }
}
