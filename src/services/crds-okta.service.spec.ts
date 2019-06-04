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
            'tokens in dictionary, session exists, should return tokens', function() {
                mokta.tokenManager.get.and.returnValues(Promise.resolve('token2'), Promise.resolve('token1'));
                let tokens;
                service.authenticated().subscribe(t => {
                    tokens = t;

                    expect(tokens).toEqual(CrdsOktaTokens.From({ access_token: 'token1', id_token: 'token2' }));
                    expect(mokta.session.exists).not.toHaveBeenCalled();
                    expect(mokta.tokenManager.get).toHaveBeenCalled();
                });
            });

        it(
            'tokens not in dictionary, session exists, should return tokens', function() {
                mokta.tokenManager.get.and.returnValues(Promise.resolve(null), Promise.resolve(null));
                mokta.session.exists.and.returnValues(Promise.resolve(true));
                mokta.token.getWithoutPrompt.and.returnValue(Promise.resolve(['id_token', 'access_token']));
                let tokens;
                service.authenticated().subscribe(t => {
                    tokens = t;

                    expect(tokens).toEqual(CrdsOktaTokens.From({ id_token: 'id_token', access_token: 'access_token' }));
                    expect(mokta.session.exists).toHaveBeenCalled();
                });
            });

        it(
            'tokens not in dictionary, session doesnt exists, should return null', function() {
                mokta.session.exists.and.returnValue(Promise.resolve(false));
                mokta.tokenManager.get.and.returnValues(Promise.resolve(null), Promise.resolve(null));
                let tokens;
                service.authenticated().subscribe(t => {
                    tokens = t;

                    expect(tokens).toEqual(null);
                    expect(mokta.token.getWithoutPrompt).not.toHaveBeenCalled();
                    expect(mokta.session.exists).toHaveBeenCalled();
                });
            });
    });

    describe('Signout Tests', () => {
        it('signout success', function() {
            mokta.signOut.and.returnValue(Promise.resolve(null));

            let res;
            service.signOut().subscribe(result => {
                res = result;

                expect(res).toEqual(true);
                expect(mokta.tokenManager.clear).toHaveBeenCalled();
            });
        });

        it('signout failed', function() {
            mokta.signOut.and.returnValue(Promise.reject(null));

            let res;
            service.signOut().subscribe(result => {
                res = result;

                expect(res).toEqual(false);
                expect(mokta.tokenManager.clear).not.toHaveBeenCalled();
                expect(mockLoggerService.Error).toHaveBeenCalled();
            });
        });
    });
});