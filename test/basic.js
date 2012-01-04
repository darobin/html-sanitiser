
var san = require("../");

describe("HTML", function () {
    describe("comments", function () {
        it("should remove comments", function () {
            san.sanitiseHTML("<p><!-- hi there --></p>").should.equal("<p></p>");
            san.sanitiseHTML("<p><!--\nhi\nthere\n-->\n</p>").should.equal("<p></p>");
        });
    });
});

