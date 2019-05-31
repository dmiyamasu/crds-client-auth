import { Observable, of, from, forkJoin } from 'rxjs';
import { switchMap, first, map, catchError, tap } from 'rxjs/operators';
import OktaAuth from '@okta/okta-auth-js';
import { CrdsOktaConfig } from '../models/crds-auth-config.model';
import { CrdsOktaTokens } from '../models/crds-token.okta';
import { CrdsLoggerService } from './crds-logger.service';

export class CrdsOktaService {

    private oktaAuthClient: OktaAuth;

    constructor(oktaConfig: CrdsOktaConfig, private log: CrdsLoggerService) {
        this.oktaAuthClient = new OktaAuth(oktaConfig);
    }

    public authenticated(): Observable<CrdsOktaTokens> {
        return this.getTokenDictionary().pipe(
            switchMap(tokens => {
                if (!!tokens) {
                    return of(tokens);
                } else {
                    return this.getTokensFromSession();
                }
            })
        );
    }

    public signOut(): Observable<boolean> {
        return from(this.oktaAuthClient.signOut()).pipe(
            first(),
            map(() => {
                this.oktaAuthClient.tokenManager.clear();
                this.log.Log('successfully logged out');
                return true;
            }),
            catchError(err => {
                this.log.Error('AUTHENTICATION SERICE: okta signout function returned error', err);
                return of(false);
            })
        );
    }

    public subscribeToTokenExpiration(callback: Function) {
        this.oktaAuthClient.tokenManager.on('expired', callback);
    }

    public subscribeToTokenRenewed(callback: Function) {
        this.oktaAuthClient.tokenManager.on('renewed', callback);
    }

    public subscribeToTokenError(callback: Function) {
        this.oktaAuthClient.tokenManager.on('error', callback);
    }

    private getTokenDictionary(): Observable<CrdsOktaTokens> {
        const idToken$ = from(this.oktaAuthClient.tokenManager.get('id_token'));
        const accessToken$ = from(this.oktaAuthClient.tokenManager.get('access_token'));
        return forkJoin([idToken$, accessToken$]).pipe(
            first(),
            map(([id, access]) => {
                if (!!id && !!access) {
                    return CrdsOktaTokens.From({ id_token: id, access_token: access });
                } else {
                    return null;
                }
            }),
            catchError(err => {
                this.log.Error('AUTHENTICATION SERICE: okta tokenManager get function returned error', err);
                return of(null);
            })
        );
    }

    private getTokensFromSession() {
        return from(this.oktaAuthClient.session.exists()).pipe(
            first(),
            switchMap(exists => {
                if (exists) {
                    return from(
                        this.oktaAuthClient.token.getWithoutPrompt({
                            scopes: ['openid', 'profile', 'email'],
                            responseType: ['id_token', 'token']
                        })
                    ).pipe(
                        first(),
                        tap((tokens: any) => {
                            this.oktaAuthClient.tokenManager.add('id_token', tokens[0]);
                            this.oktaAuthClient.tokenManager.add('access_token', tokens[1]);
                        }),
                        map(tokens => {
                            return CrdsOktaTokens.From({ id_token: tokens[0], access_token: tokens[1] });
                        }),
                        catchError(err => {
                            this.log.Error('AUTHENTICATION SERICE: okta get without prompt function returned error', err);
                            return of(null);
                        })
                    );
                } else {
                    return of(null);
                }
            }),
            catchError(err => {
                this.log.Error('AUTHENTICATION SERICE: okta session exists function returned error', err);
                return of(null);
            })
        );
    }
}