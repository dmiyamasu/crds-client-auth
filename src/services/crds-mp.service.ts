import { Observable, of } from "rxjs";

import { CrdsMpTokens } from "../models/crds-token.mp";
import { Utilities } from "../utility/cookie";

export class CrdsMpService {
  constructor(private accessTokenCookie: string, private refreshTokenCookie: string) { }

  public authenticated(): Observable<CrdsMpTokens> {
    // Just check for the presence of a cookie
    let accessToken = Utilities.getCookie(this.accessTokenCookie);
    let refreshToken = Utilities.getCookie(this.refreshTokenCookie);

    if (accessToken)
      return of(CrdsMpTokens.From({ access_token: { 'access_token': accessToken}, refresh_token: refreshToken }));
    else
      return of(null);
  }

  public signOut(): Observable<boolean> {
    let accessToken = Utilities.getCookie(this.accessTokenCookie);

    if (accessToken) {
      // clear both the access and refresh tokens
      Utilities.deleteCookie(this.accessTokenCookie, '.crossroads.net');
      Utilities.deleteCookie(this.refreshTokenCookie, '.crossroads.net');

      return of(true);
    }
    else {
      return of(false);
    }
  }
}