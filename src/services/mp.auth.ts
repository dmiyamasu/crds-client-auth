import { Observable, of } from "rxjs";

import { MpTokens } from "../models/crds-token.mp";

export class CrdsMpService {
  constructor(private accessTokenCookie: string, private refreshTokenCookie: string) { }

  public authenticated(): Observable<MpTokens> {
    // Just check for the presence of a cookie
    let accessToken = this.getCookie(this.accessTokenCookie);
    let refreshToken = this.getCookie(this.refreshTokenCookie);

    if (accessToken)
      return of(MpTokens.From({ access_token: accessToken, refresh_token: refreshToken }));
    else
      return of(null);
  }

  private getCookie(cname) {
    var name = cname + '=';
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for (var i = 0; i < ca.length; i++) {
      var c = ca[i];
      while (c.charAt(0) == ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
      }
    }
    return '';
  }

  private deleteCookie(cname: string)
  {
    document.cookie = cname + '=; Max-Age=-99999999;';
  }

  public signOut(): Observable<boolean> {
    let accessToken = this.getCookie(this.accessTokenCookie);

    if (accessToken) {
      // clear both the access and refresh tokens
      this.deleteCookie(this.accessTokenCookie);
      this.deleteCookie(this.refreshTokenCookie);
    }
    else {
      return of(false);
    }
  }
}