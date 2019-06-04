import { Utilities } from './cookie'

describe("Cookie Utilities", function () {

    beforeEach(function(done) {
        setTimeout(function() {
          done();
        }, 500);
      });

    describe("should get a cookie", function () {
        var url = "https://www.crossroads.net?coolparam=testit";

        it("when the cookie is first", function () {
            spyOnProperty(document, 'cookie', 'get').and.returnValue(`redirect_url=${url};anotherstring=string`);
            
            const result = Utilities.getCookie("redirect_url");
            expect(result).toEqual(url);
        });

        it("when the cookie is in the middle", function () {
            spyOnProperty(document, 'cookie', 'get').and.returnValue(`someotherkey=someotherparam;redirect_url=${url};anotherstring=string`);

            const result = Utilities.getCookie("redirect_url");
            expect(result).toEqual(url);
        });

        it("when the cookie is last", function () {
            spyOnProperty(document, 'cookie', 'get').and.returnValue(`anotherstring=string;redirect_url=${url}`);

            const result = Utilities.getCookie("redirect_url");
            expect(result).toEqual(url);
        });
    });
});
