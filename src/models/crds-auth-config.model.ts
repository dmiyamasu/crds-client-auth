import { CrdsAuthenticationProviders } from './crds-token.interface'

export interface CrdsAuthConfig {
  oktaConfig: CrdsOktaConfig;
  mpConfig: CrdsMpConfig;
  logging: boolean;
  providerPreference: CrdsAuthenticationProviders[];
}

export interface CrdsOktaConfig {
  url?: string;
  clientId: string;
  redirectUri?: string;
  idps?: { type: string; id: string }[];
  issuer: string,

  // TokenManager config
  tokenManager: {
    storage: string
  },
}

export interface CrdsMpConfig {
  accessTokenCookie: string;
  refreshTokenCookie: string;
}