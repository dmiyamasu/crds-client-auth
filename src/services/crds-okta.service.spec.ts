import { CrdsOktaService } from "./crds-okta.service";
import { CrdsLoggerService } from "./crds-logger.service";
import { CrdsOktaTokens } from "../models/crds-token.okta";



describe('CrdsOktaService', () => {
    let mokta, mockLoggerService;
    let service: CrdsOktaService;
    beforeEach(() => {
        mockLoggerService = jasmine.createSpyObj<CrdsLoggerService>('log', ['Log', 'Error']);
        mokta = jasmine.createSpyObj('okta', ['signOut']);

        mokta.session = jasmine.createSpyObj('session', ['exists']);
        mokta.token = jasmine.createSpyObj('token', ['getWithoutPrompt']);
        mokta.tokenManager = jasmine.createSpyObj('tokenManager', ['add', 'get', 'clear']);

        service = new CrdsOktaService(mokta, mockLoggerService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    describe('Authenticated Tests', () => {
        it(
            'tokens in dictionary, session exists, should return tokens', () => {
                mokta.tokenManager.get.and.returnValues(Promise.resolve('token2'), Promise.resolve('token1'));
                let tokens;
                service.authenticated().subscribe(t => {
                    tokens = t;
                });
                setTimeout(() => {
                    expect(tokens).toEqual(CrdsOktaTokens.From({ access_token: 'token1', id_token: 'token2' }));
                    expect(mokta.session.exists).not.toHaveBeenCalled();
                    expect(mokta.tokenManager.get).toHaveBeenCalled();
                }, 100);

            });

        it(
            'tokens not in dictionary, session exists, should return tokens', () => {
                mokta.tokenManager.get.and.returnValues(Promise.resolve(null), Promise.resolve(null));
                mokta.session.exists.and.returnValues(Promise.resolve(true));
                mokta.token.getWithoutPrompt.and.returnValue(Promise.resolve(['id_token', 'access_token']));
                let tokens;
                service.authenticated().subscribe(t => {
                    tokens = t;
                });
                setTimeout(() => {
                    expect(tokens).toEqual(CrdsOktaTokens.From({ id_token: 'id_token', access_token: 'access_token' }));
                    expect(mokta.session.exists).toHaveBeenCalled();
                }, 100);
            });

        it(
            'tokens not in dictionary, session doesnt exists, should return null', () => {
                mokta.session.exists.and.returnValue(Promise.resolve(false));
                mokta.tokenManager.get.and.returnValues(Promise.resolve(null), Promise.resolve(null));
                let tokens;
                service.authenticated().subscribe(t => {
                    tokens = t;
                });
                setTimeout(() => {
                    expect(tokens).toEqual(null);
                    expect(mokta.token.getWithoutPrompt).not.toHaveBeenCalled();
                    expect(mokta.session.exists).toHaveBeenCalled();
                }, 100);
            });
    });

    describe('Signout Tests', () => {
        it('signout success', () => {
            mokta.signOut.and.returnValue(Promise.resolve(null));

            let res;
            service.signOut().subscribe(result => {
                res = result;
            });

            setTimeout(() => {
                expect(res).toEqual(true);
                expect(mokta.tokenManager.clear).toHaveBeenCalled();
            }, 100);
        });

        it('signout failed', () => {
            mokta.signOut.and.returnValue(Promise.reject(null));

            let res;
            service.signOut().subscribe(result => {
                res = result;
            });

            setTimeout(() => {
                expect(res).toEqual(false);
                expect(mokta.tokenManager.clear).not.toHaveBeenCalled();
                expect(mockLoggerService.Error).toHaveBeenCalled();
            }, 100);
        });
    });
});