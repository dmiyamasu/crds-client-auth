export enum CrdsAuthenticationProviders {
  Mp = 1,
  Okta
}

export interface CrdsTokens {
  access_token: any;
  id_token?: any;
  refresh_token?: string;
  provider: CrdsAuthenticationProviders;
}