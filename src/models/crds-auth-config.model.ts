import { AuthenticationProviders } from './crds-token.interface'

export interface CRDSAuthConfig {
  oktaConfig: OktaConfig;
  mpConfig: MpConfig;
  tokenInjectorDomains: string[];
  logging: boolean;
  providerPreference: AuthenticationProviders[];
}

export interface OktaConfig {
  url: string;
  clientId: string;
  redirectUri: string;
  idps: { type: string; id: string }[];
  issuer: 'default',

  // TokenManager config
  tokenManager: {
    storage: 'cookie'
  },
}

export interface MpConfig {
  accessTokenCookie: string;
  refreshTokenCookie: string;
}