
var san = require("../");

describe("HTML", function () {
    describe("comments", function () {
        it("should remove comments", function () {
            san.sanitiseHTML("<p><!-- hi there --></p>")
               .should.equal("<p></p>");
            san.sanitiseHTML("<p><!--\nhi\nthere\n-->\n</p>")
               .should.equal("<p></p>");
        });
    });
    describe("elements", function () {
        it("should remove forbidden elements", function () {
            san.sanitiseHTML("<p><h2>Hello</h2><script>something</script></p><script><p></p></script>")
               .should.equal("<p><h2>Hello</h2></p>");
        });
        it("should respect allowedElements", function () {
            san.sanitiseHTML("<p></p><foo></foo><script></script>", { allowedElements: ["foo", "script"]})
               .should.equal("<foo></foo><script></script>");
        });
    });
    describe("attributes", function () {
        it("should remove forbidden attributes", function () {
            san.sanitiseHTML("<p onload='aaa' id='foo' onclick='bar'></p>")
               .should.equal('<p id="foo"></p>');
        });
        it("should remove forbidden protocols", function () {
            san.sanitiseHTML('<a href="http://berjon.com/"></a><a href="index.html"></a><a href="evil://source"></a>')
               .should.equal('<a href="http://berjon.com/"></a><a href="index.html"></a><a></a>');
        });
        it("should respect allowedAttributes", function () {
            san.sanitiseHTML("<p id='foo' onload='test' smurf='bar'></p>", { allowedAttributes: ["onload", "smurf"]})
               .should.equal('<p onload="test" smurf="bar"></p>');
        });
        it("should respect uriAttributes", function () {
            san.sanitiseHTML('<a href="evil://source" foo="evil://source"></a>', { uriAttributes: ["foo"]})
               .should.equal('<a href="evil://source"></a>');
        });
        it("should respect allowedProtocols", function () {
            san.sanitiseHTML('<a href="evil://source"></a><a href="http://berjon.com/"></a>', { allowedProtocols: ["evil"]})
               .should.equal('<a href="evil://source"></a><a></a>');
        });
    });
    describe("style attribute", function () {
        it("should remove forbidden properties", function () {
            san.sanitiseHTML('<p style="background: #fff; behavior: something"></p>')
               .should.equal('<p style="background: #fff; "></p>');
        });
        it("should remove url()", function () {
            san.sanitiseHTML('<p style="background: url(http://berjon.com/) #fff;"></p>')
               .should.equal('<p style="background: #fff; "></p>');
        });
        it("should remove unknown keywords", function () {
            san.sanitiseHTML('<p style="background: whatever;"></p>')
               .should.equal('<p style=""></p>');
        });
        it("should support !important", function () {
            san.sanitiseHTML('<p style="display: none !important;"></p>')
               .should.equal('<p style="display: none !important; "></p>');
        });
        it("should respec allowedProperties", function () {
            san.sanitiseHTML('<p style="display: none; behavior: something"></p>', { allowedProperties: ["behavior"]})
               .should.equal('<p style="behavior: something; "></p>');
        });
        it("should respec allowedKeywords", function () {
            san.sanitiseHTML('<p style="background: red;"></p><p style="background: foo;"></p>', { allowedKeywords: ["foo"]})
               .should.equal('<p style=""></p><p style="background: foo; "></p>');
        });
        it("should respec shorthandProperties", function () {
            san.sanitiseHTML('<p style="foo-bar: red;"></p><p style="background: foo;"></p>', { shorthandProperties: ["foo"]})
               .should.equal('<p style="foo-bar: red; "></p><p style=""></p>');
        });
    });
});
