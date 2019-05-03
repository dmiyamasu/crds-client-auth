import { ICRDSTokens, AuthenticationProviders } from "./crds-token.interface";

export class OktaTokens implements ICRDSTokens {
  public access_token: any;
  public id_token: any;
  public provider = AuthenticationProviders.Okta;

  constructor(accessToken: any = null, idToken: any = null) {
    if (accessToken != null) {
      this.access_token = accessToken;
    }
    if (idToken != null) {
      this.id_token = idToken;
    }
  }

  public static From(inc: Partial<ICRDSTokens>): OktaTokens {
    const { access_token, id_token } = inc;
    return new OktaTokens(access_token, id_token);
  }
}