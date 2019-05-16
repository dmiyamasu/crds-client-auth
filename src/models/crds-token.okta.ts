import { CrdsTokens, CrdsAuthenticationProviders } from "./crds-token.interface";

export class CrdsOktaTokens implements CrdsTokens {
  public access_token: any;
  public id_token: any;
  public provider = CrdsAuthenticationProviders.Okta;

  constructor(accessToken: any = null, idToken: any = null) {
    if (accessToken != null) {
      this.access_token = accessToken;
    }
    if (idToken != null) {
      this.id_token = idToken;
    }
  }

  public static From(inc: Partial<CrdsTokens>): CrdsOktaTokens {
    const { access_token, id_token } = inc;
    return new CrdsOktaTokens(access_token, id_token);
  }
}