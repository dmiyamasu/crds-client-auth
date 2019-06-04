import { CrdsLoggerService } from "./crds-logger.service";

describe('LoggerService', () => {
    let service: CrdsLoggerService;

    describe('Logging On', () => {
        beforeEach(() => {
            service = new CrdsLoggerService(true);
        });

        it('should be created', () => {
            expect(service).toBeTruthy();
        });

        it('should console.error', () => {
            spyOn(console, 'error');

            service.Error('test')

            expect(console.error).toHaveBeenCalled();
        });

        it('should console.warn', () => {
            spyOn(console, 'warn');

            service.Warn('test')

            expect(console.warn).toHaveBeenCalled();
        });

        it('should console.info', () => {
            spyOn(console, 'info');

            service.Info('test')

            expect(console.info).toHaveBeenCalled();
        });

        it('should console.log', () => {
            spyOn(console, 'log');

            service.Log('test')

            expect(console.log).toHaveBeenCalled();
        });
    });
    describe('Logging Off', () => {
        beforeEach(() => {
            service = new CrdsLoggerService(false);
        });

        it('should be created', () => {
            expect(service).toBeTruthy();
        });

        it('should not console.error', () => {
            spyOn(console, 'error');

            service.Error('test')

            expect(console.error).not.toHaveBeenCalled();
        });

        it('should not console.warn', () => {
            spyOn(console, 'warn');

            service.Warn('test')

            expect(console.warn).not.toHaveBeenCalled();
        });

        it('should not console.info', () => {
            spyOn(console, 'info');

            service.Info('test')

            expect(console.info).not.toHaveBeenCalled();
        });

        it('should not console.log', () => {
            spyOn(console, 'log');

            service.Log('test')

            expect(console.log).not.toHaveBeenCalled();
        });
    });
});