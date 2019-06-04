import { CrdsOktaConfig, CrdsMpConfig, CrdsAuthConfig, CrdsAuthenticationProviders, CrdsAuthenticationService } from '..';
import 'jasmine';

describe('my passing test', function () {
	it('passes', function () {
		let oktaConfig: CrdsOktaConfig = {
			url: 'https://testurl.com',
			clientId: 'nonsenseid',
			issuer: 'default',

			// TokenManager config
			tokenManager: {
				storage: 'cookie'
			},
		}

		let mpConfig: CrdsMpConfig = {
			accessTokenCookie: 'intsessionId',
			refreshTokenCookie: 'intrefreshToken',
		}

		let authConfig: CrdsAuthConfig = {
			oktaConfig: oktaConfig,
			mpConfig: mpConfig,
			logging: true,
			providerPreference: [
				CrdsAuthenticationProviders.Okta,
				CrdsAuthenticationProviders.Mp
			]
		}

		let authService = new CrdsAuthenticationService(authConfig);

		expect(authService).toBeTruthy();
	});
});