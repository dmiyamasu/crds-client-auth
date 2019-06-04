import { Utilities } from './cookie'

describe("Cookie Utilities", function () {

    describe("should get a cookie", function () {
        var url = "https://www.crossroads.net?coolparam=testit";

        // it("when the cookie is first", function () {
        //     document.cookie = `redirect_url=${url};anotherstring=string`;
            
        //     const result = Utilities.getCookie("redirect_url");
        //     expect(result).toEqual(url);
        // });

        // it("when the cookie is in the middle", function () {
        //     document.cookie = `someotherkey=someotherparam;redirect_url=${url};anotherstring=string`;

        //     const result = Utilities.getCookie("redirect_url");
        //     expect(result).toEqual(url);
        // });

        // it("when the cookie is last", function () {
        //     document.cookie = `anotherstring=string;redirect_url=${url}`;

        //     const result = Utilities.getCookie("redirect_url");
        //     expect(result).toEqual(url);
        // });
    });
});
