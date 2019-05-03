export enum AuthenticationProviders {
  Mp = 1,
  Okta
}

export interface ICRDSTokens {
  access_token: any;
  id_token?: any;
  refresh_token?: string;
  provider: AuthenticationProviders;
}