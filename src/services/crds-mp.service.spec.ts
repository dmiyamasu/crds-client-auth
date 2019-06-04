import { CrdsMpService } from './crds-mp.service';
import { Utilities } from '../utility/cookie';
import { CrdsMpTokens } from '../models/crds-token.mp';

describe("CrdsMpService", function () {
    let service: CrdsMpService;
    let accessTokenCookie = "access_token";
    let refreshTokenCookie = "refresh_token";

    beforeEach(() => {
        service = new CrdsMpService(accessTokenCookie, refreshTokenCookie);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    describe('Authenticated Tests', () => {
        it('tokens in cookies, should return tokens', () => {
            let mUtilities = spyOn(Utilities, 'getCookie');
            mUtilities.and.returnValue("token1");

            let tokens;
            service.authenticated().subscribe(t => {
                tokens = t;
            });

            setTimeout(() => {
                expect(tokens).toEqual(CrdsMpTokens.From({ access_token: 'token1', refresh_token: 'token1' }));
            }, 1);
        });

        it('tokens not in cookies, should return null', () => {
            let mUtilities = spyOn(Utilities, 'getCookie');
            mUtilities.and.returnValue(null);

            let tokens;
            service.authenticated().subscribe(t => {
                tokens = t;
            });
            
            setTimeout(() => {
                expect(tokens).toEqual(null);
            }, 1);
        });
    });

    describe ('Signout Tests', () => {
        it ('tokens in cookies, return true', () => {
            let mUtilities = spyOn(Utilities, 'getCookie');
            mUtilities.and.returnValue("token1");

            let success;
            service.signOut().subscribe(s => {
                success = s;
            });

            setTimeout(() => {
                expect(success).toBe(true);
            }, 1);
        });

        it ('tokens not in cookies, return false', () => {
            let mUtilities = spyOn(Utilities, 'getCookie');
            mUtilities.and.returnValue(null);

            let success;
            service.signOut().subscribe(s => {
                success = s;
            });

            setTimeout(() => {
                expect(success).toBe(false);
            }, 1);
        });
    });
});