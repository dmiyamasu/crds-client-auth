import { ICRDSTokens, AuthenticationProviders } from "./crds-token.interface";

export class MpTokens implements ICRDSTokens {
  public access_token: any;
  public refresh_token: string;
  public provider = AuthenticationProviders.Mp;

  constructor(accessToken: any = null, refreshToken: any = null) {
    if (accessToken != null) {
      this.access_token = accessToken;
    }
    if (refreshToken != null) {
      this.refresh_token = refreshToken;
    }
  }

  public static From(inc: Partial<ICRDSTokens>): MpTokens {
    const { access_token, refresh_token } = inc;
    return new MpTokens(access_token, refresh_token);
  }
}