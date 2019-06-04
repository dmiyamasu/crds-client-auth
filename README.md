
# Crossroads Auth Typescript Library

crds-client-auth will enable your product to:

- check authentication status
- get updates on authentication status changes

## Installing

### Install via NPM with

```bash
npm install --save @crds_npm/crds-client-auth
```
### Build the config json and create instance of auth service
```typescript
import { 
CrdsAuthenticationService, 
CrdsLoggerService, 
CrdsAuthConfig, 
CrdsOktaConfig, 
CrdsMpConfig, 
CrdsAuthenticationProviders } from  '@crds_npm/crds-client-auth';
  
let  oktaConfig:  CrdsOktaConfig  = {
	clientId:  'CLIENT_ID',
	issuer:  '{OKTA_URL}/oauth2/default',
	redirectUri: 'REDIRECT_URI', //This one is a bit tricky. There are two parts. 1. This should be the fully qualified base url where your app is hosted. Maybe that's https://int.crossroads.net, https://media.crossroads.net, https://www.crossroads.net. 2. The url must be registered in the okta portal under the application redirectUri settings.
	tokenManager: {
		storage:  'cookie'
	},
}

let  mpConfig:  CrdsMpConfig  = {
	accessTokenCookie:  'ACCESS_TOKEN_COOKIE_NAME',
	refreshTokenCookie:  'REFRESH_TOKEN_COOKIE_NAME',
}

let  authConfig:  CrdsAuthConfig  = {
	oktaConfig:  oktaConfig,
	mpConfig:  mpConfig,
	logging: false, //Do you want to log debug info to the web console?
	providerPreference: [
		// Put these in the order you want the library to check for auth status
		CrdsAuthenticationProviders.Okta,
		CrdsAuthenticationProviders.Mp
	]
}

let authService = new CrdsAuthenticationService(authConfig);

authService.authenticated().subscribe(tokens  => {
	if (tokens) {
		console.log('logged in');
	}
	else {
		console.log('not logged in');
	}
})
```
## API

### Documentation
---

#### ***`CrdsAuthenticationService`***

---

>Basic service used to interact with Auth Status

**`function`: authenticated(): Observable\<[CrdsTokens](#CrdsTokens)\>**

>Returns an observable that contains either the tokens for the user (if logged in), or null if not logged in. This function will check the (local) token manager first to see if there is a session, and if there is no local session, it will check the server for an active session, and set it in the (local) token manager if one exists.

```typescript
authenticated().subscribe((tokens: CrdsTokens) => {
	if (tokens != null) {
		console.log('user logged in', tokens);
	} else {
		console.log('user is NOT logged in');
	}
}
```

**`function`: signOut(): Observable\<boolean\>**

> Returns an observable that contains whether the signout action was successful or not.

```typescript
signOut().subscribe(success  => {
	if (success) {
		console.log('log out worked')
	} else {
		console.log('log out failed')
	}
});
```
---
#### ***`CrdsTokens`***
---
> Interface and class for containing tokens.

```typescript
{
	access_token:  any; // Both will have an access token
	id_token?:  any; // Optional as only Okta auth has id_token
	refresh_token?:  string; // Optional as only Mp auth has refresh token
	provider:  CrdsAuthenticationProviders; // Mp or Okta enum
}
```

### Building

>  -  `npm i`

>  -  `npm run build` - this will run a build and will watch to rebuild when changes happen  

### Running the tests

>  -  `npm run test`

### Deployment

> CI/CD is set up through TeamCity
> Pull requests against the master branch will be built and tested automatically.
> Merges into master will be built and published to npm.
> To deploy to npm:

### Run Locally

>  -  [checkout `npm link`](https://docs.npmjs.com/cli/link.html)

>  - run `npm link`

>  - in the local project consuming the this library, run `npm link @crds_npm/crds-client-auth`

>  - this creates a symlink to the dist of the local library