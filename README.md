# crds-client-auth

Client side library for managing auth

# Crossroads Okta Angular Library

Crds-okta-auth will enable your product to:

- authenticate through okta
- check authentication status
- protect routes
- append access tokens to requests to predefined origins

## Installing

### Install via NPM with

```bash
npm install --save @crds_npm/crds-okta-auth
```

### Build the config json and add crds-okta-auth module as a dependency

```typescript
import {
  CrdsOktaAuthModule,
  CRDSOktaConfig,
  AuthenticatedGuard,
  CRDSTokenInjectorInterceptor
} from '@crds_npm/crds-okta-auth';

const authConfig: CRDSOktaConfig = {
  oktaBase: {
    url: 'INSERT URL',
    clientId: 'INSERT CLIENT ID',
    redirectUri: 'URL TO REDIRECT TO AFTER AUTHENTICATION',
    idps: [{ type: 'FACEBOOK', id: 'FACEBOOK IDP ID' }, { type: 'GOOGLE', id: 'GOOGLE IDP ID' }]
  },
  tokenInjectorDomains: ['ARRAY OF DOMAINS TO APPEND TOKEN INTO HEADER ON REQUESTS'],
  logging: true
};

@NgModule({
  declarations: [
    ...
  ],
  imports: [
    ...
    CrdsOktaAuthModule.forRoot(authConfig)
    ...
  ],
  providers: [
    ...
    { provide: HTTP_INTERCEPTORS, useClass: CRDSTokenInjectorInterceptor, multi: true }
    ...
    ]
})
```

## API

---

### Table of Contents

| Modules                                   | Services                                                | Interceptors                                                  | Guards                                    | Directives                                              | Classes                               |
| ----------------------------------------- | ------------------------------------------------------- | ------------------------------------------------------------- | ----------------------------------------- | ------------------------------------------------------- | ------------------------------------- |
| [CrdsOktaAuthModule](#CrdsOktaAuthModule) | [CrdsAuthenticationService](#CrdsAuthenticationService) | [CrdsTokenInjectorInterceptor](#CrdsTokenInjectorInterceptor) | [AuthenticatedGuard](#AuthenticatedGuard) | [CRDSSignInWidgetDirective](#CRDSSignInWidgetDirective) | [CRDSOktaConfig](#CRDSOktaConfig)      |
| &nbsp;                                    | [CrdsSigninService](#CrdsSigninService)                 | &nbsp;                                                        | [CanLoginGuard](#CanLoginGuard)           | &nbsp;                                                  | [CRDSTokens\ICRDSTokens](#CRDSTokens) |

### Documentation

---

#### ***`CrdsOktaAuthModule`***

---

> Base angular module for providing CRDS-OKTA-AUTH for your application.

**`function`: forRoot(config: CRDSOktaConfig): ModuleWithProviders**

> Requires an instance of [`CRDSOktaConfig`](#CRDSOktaConfig) to instantiate.  Provided in the `import` section of your Core Module.

```typescript
import { CrdsOktaAuthModule, CRDSOktaConfig} from '@crds_npm/crds-okta-auth';

const authConfig: CRDSOktaConfig = {...};

@NgModule({
  declarations: [...],
  imports: [CrdsOktaAuthModule.forRoot(authConfig)
    ...
  ],
  providers: [...]
})
```

---

#### ***`CrdsAuthenticationService`***

---

>Basic service used to interact with Okta Auth Status

**`function`: authenticated(): Observable\<[CRDSTokens](#CRDSTokens)\>**

>Returns an observable that contains either the tokens for the user (if logged in), or null if not logged in.  This function will check the (local) token manager first to see if there is a session, and if there is no local session, it will check the server for an active session, and set it in the (local) token manager if one exists. 

```typescript
  authenticated().subscribe((tokens: CRDSTokens) => {
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
    signOut().subscribe(success => {
      if (success) {
        console.log('log out worked')
      } else {
        console.log('log out failed')
      }
    });
```

---