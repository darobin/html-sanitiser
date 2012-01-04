
var san = require("../");

describe("HTML", function () {
    describe("comments", function () {
        it("should remove comments", function () {
            san.sanitiseHTML("<html><!-- hi there --></html>").should.equal("<html></html>");
            san.sanitiseHTML("<html><!--\nhi\nthere\n-->\n</html>").should.equal("<html></html>");
        });
    });
});

