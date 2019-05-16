import { CrdsTokens, CrdsAuthenticationProviders } from "./crds-token.interface";

export class CrdsMpTokens implements CrdsTokens {
  public access_token: any;
  public refresh_token: string;
  public provider = CrdsAuthenticationProviders.Mp;

  constructor(accessToken: any = null, refreshToken: any = null) {
    if (accessToken != null) {
      this.access_token = accessToken;
    }
    if (refreshToken != null) {
      this.refresh_token = refreshToken;
    }
  }

  public static From(inc: Partial<CrdsTokens>): CrdsMpTokens {
    const { access_token, refresh_token } = inc;
    return new CrdsMpTokens(access_token, refresh_token);
  }
}