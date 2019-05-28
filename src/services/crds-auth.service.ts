import { Observable, of, BehaviorSubject } from 'rxjs';
import { CrdsTokens, CrdsAuthenticationProviders } from '../models/crds-token.interface';
import { CrdsAuthConfig } from '../models/crds-auth-config.model';
import { CrdsOktaService } from './crds-okta.service';
import { CrdsMpService } from './crds-mp.service';
import { first, switchMap, tap, map } from 'rxjs/operators';
import { CrdsLoggerService } from './crds-logger.service';

export class CrdsAuthenticationService {
  providerServiceKVP: { [key: string]: any } = {};

  private authenticationStatus$: BehaviorSubject<CrdsTokens | null>;
  private logService: CrdsLoggerService;

  constructor(private crdsAuthConfig: CrdsAuthConfig) {
    this.authenticationStatus$ = new BehaviorSubject<CrdsTokens | null>(null);
    this.logService = new CrdsLoggerService(crdsAuthConfig.logging);

    let oktaService = new CrdsOktaService(this.crdsAuthConfig.oktaConfig, this.logService);

    oktaService.subscribeToTokenExpiration(() => {
      this.authenticate().pipe(first()).subscribe(); //Force a token update
    });

    oktaService.subscribeToTokenRenewed(() => {

    });

    oktaService.subscribeToTokenError(() => {
      this.authenticationStatus$.next(null);
    });

    var hidden, visibilityChange;
    if (typeof document.hidden !== "undefined") { // Opera 12.10 and Firefox 18 and later support
      hidden = "hidden";
      visibilityChange = "visibilitychange";
    } else if (typeof (document as any).mozHidden !== "undefined") {
      hidden = "mozHidden";
      visibilityChange = "mozvisibilitychange";
    } else if (typeof (document as any).msHidden !== "undefined") {
      hidden = "msHidden";
      visibilityChange = "msvisibilitychange";
    } else if (typeof (document as any).webkitHidden !== "undefined") {
      hidden = "webkitHidden";
      visibilityChange = "webkitvisibilitychange";
    }

    document.addEventListener(visibilityChange, () => {
      if (document.visibilityState === 'visible'){
        this.authenticate().pipe(first()).subscribe();
      }
    });

    this.providerServiceKVP[CrdsAuthenticationProviders.Okta] = new CrdsOktaService(crdsAuthConfig.oktaConfig, this.logService);
    this.providerServiceKVP[CrdsAuthenticationProviders.Mp] = new CrdsMpService(crdsAuthConfig.mpConfig.accessTokenCookie, crdsAuthConfig.mpConfig.refreshTokenCookie);
  }

  public authenticated(): Observable<CrdsTokens | null> {
    if (this.authenticationStatus$.value) {
      return this.authenticationStatus$.asObservable();
    }
    else {
      return this.authenticate().pipe(
        first(),
        tap(tokens => {
          this.authenticationStatus$.next(tokens);
        }),
        switchMap((tokens) => {
            return this.authenticationStatus$.asObservable();
        })
      );
    }
  }

  private authenticate(): Observable<CrdsTokens | null> {
    return this.AuthenticateByProvider(0).pipe(
      first(),
      tap(tokens => {
        this.authenticationStatus$.next(tokens);
      }),
      map(tokens => {
        return tokens;
      })
    );
  }

  private AuthenticateByProvider(iterator: number): Observable<CrdsTokens | null> {
    if (iterator >= Object.keys(this.providerServiceKVP).length) return of(null);
    return this.providerServiceKVP[this.crdsAuthConfig.providerPreference[iterator]].authenticated().pipe(
      first(),
      switchMap(tokens => {
        if (tokens != null) {
          return of(tokens);
        } else {
          return this.AuthenticateByProvider(++iterator);
        }
      }))
  }

  public signOut(): Observable<boolean> {
    return this.SignOutByProvider(0);
  }

  private SignOutByProvider(iterator: number): Observable<boolean> {
    if (iterator >= Object.keys(this.providerServiceKVP).length) return of(false);
    let provider = this.crdsAuthConfig.providerPreference[iterator];
    return this.providerServiceKVP[provider].signOut().pipe(
      first(),
      switchMap(success => {
        if (success) {
          this.authenticationStatus$.next(null);
          return of(success);
        } else {
          return this.SignOutByProvider(++iterator);
        }
      }))
  }
}
