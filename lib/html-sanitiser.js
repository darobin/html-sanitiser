
var jsdom = require("jsdom")
;

exports.allowedElements = ("strong em b i p code pre tt samp kbd var sub q sup dfn cite big small address hr " +
                           "br div span h1 h2 h3 h4 h5 h6 ul ol li dl dt dd abbr acronym a img blockquote del " +
                           "ins table caption tbody tfoot thead tr th td article aside canvas details figcaption " +
                           "figure footer header hgroup menu nav section summary time mark").split(" ");
exports.allowedProperties = ("azimuth background-color border-bottom-color border-collapse border-color " +
                             "border-left-color border-right-color border-top-color clear color cursor direction " +
                             "display elevation float font font-family font-size font-style font-variant font-weight " +
                             "height letter-spacing line-height overflow pause pause-after pause-before pitch " +
                             "pitch-range richness speak speak-header speak-numeral speak-punctuation speech-rate " +
                             "stress text-align text-decoration text-indent unicode-bidi vertical-align voice-family " +
                             "volume white-space width").split(" ");
exports.allowedKeywords = ("auto aqua black block blue bold both bottom brown center collapse dashed dotted " +
                           "fuchsia gray green !important italic left lime maroon medium none navy normal nowrap " +
                           "olive pointer purple red right solid silver teal top transparent underline white yellow").split(" ");
exports.shorthandProperties = ("background border margin padding").split(" ");
exports.allowedAttributes = ("href src width height alt cite datetime title class name xml:lang abbr style").split(" ");
exports.uriAttributes = ("href src cite action longdesc xlink:href lowsrc").split(" ");
exports.allowedProtocols = ("ed2k ftp http https irc mailto news gopher nntp telnet webcal xmpp callto feed svn " +
                            "urn aim rsync tag ssh sftp rtsp afs tel smsto mmsto").split(" ");

function mapArray (arr) {var res = {};
    for (var i = 0, n = arr.length; i < n; i++) res[arr[i]] = true;
    return res;
}

// rules based on
// https://github.com/rails/rails/blob/master/actionpack/lib/action_controller/vendor/html-scanner/html/sanitizer.rb
exports.sanitiseHTML = function (html, options) {
    if (html == null || !html.length) return "";
    var options = options || {}
    ,   allowedElements = mapArray(options.allowedElements || exports.allowedElements)
    ,   allowedAttributes = mapArray(options.allowedAttributes || exports.allowedAttributes)
    ,   uriAttributes = mapArray(options.uriAttributes || exports.uriAttributes)
    ,   allowedProtocols = mapArray(options.allowedProtocols || exports.allowedProtocols)
    ;
    // strip comments
    html = html.replace(/<!--(?:.*?)-->[\n]?/gm, "");
    // parse without processing anything
    var doc = jsdom.jsdom(html, null, {
                                        features: {
                                            FetchExternalResources:     []
                                        ,   ProcessExternalResources:   []
                                        }
    });
    // process elements
    var els = doc.getElementsByTagName("*");
    for (var i = 0, n = els.length; i < n; i++) {
        var el = els[i];
        // remove elements that aren't on the whitelist
        if (!allowedElements[el.tagName.toLowerCase()]) {
            el.parentNode.removeChild(el);
            continue;
        }
        
        // remove attributes that aren't on the whitelist
        for (var j = 0, m = el.attributes.length; j < m; j++) {
            var att = el.attributes[j]
            ,   an = att.nodeName.toLowerCase()
            ;
            if (!allowedAttributes[an]) el.removeAttribute(att.nodeName);
            // only allowed protocols
            if (uriAttributes[an]) {
                if (/(^[^\/:]*):|(&#0*58)|(&#x70)|(%|&#37;)3A/.test(att.nodeValue) &&
                    !allowedProtocols[att.nodeValue.split(/:|(&#0*58)|(&#x70)|(%|&#37;)3A/)[0].toLowerCase()]) {
                        el.removeAttribute(att.nodeName);
                }
            }
        }
        
        // handle style
        if (el.hasAttribute("style")) el.setAttribute("style", exports.sanitiseCSS(el.getAttribute("style"), options));
    }
    return doc.innerHTML;
};

exports.sanitiseCSS = function (css, options) {
    var options = options || {}
    ,   allowedProperties = mapArray(options.allowedProperties || exports.allowedProperties)
    ,   allowedKeywords = mapArray(options.allowedKeywords || exports.allowedKeywords)
    ,   shorthandProperties = mapArray(options.shorthandProperties || exports.shorthandProperties)
    ;
    
    // kill URIs
    css = css.replace(/url\s*\(\s*[^\s)]+?\s*\)\s*/gi, "");
    
    // gauntlet
    if (!/^([:,;#%.\sa-zA-Z0-9!]|\w-\w|\'[\s\w]+\'|\"[\s\w]+\"|\([\d,\s]+\))*$/.test(css) ||
        !/^(\s*[-\w]+\s*:\s*[^:;]*(;|$)\s*)*$/.test(css)) return "";
    
    var clean = "";
    css.replace(/([-\w]+)\s*:\s*([^:;]*)/g, function (str, prop, val) {
        if (allowedProperties[prop.toLowerCase()]) clean += prop + ": " + val + "; ";
        else if (shorthandProperties[prop.split("-")[0].toLowerCase()]) {
            var keywords = val.trim().split(" ");
            for (var i = 0, n = keywords.length; i < n; i++) {
                var kw = keywords[i];
                if (!allowedKeywords[kw.toLowerCase()] && 
                    !/^(#[0-9a-f]+|rgb\(\d+%?,\d*%?,?\d*%?\)?|\d{0,2}\.?\d{0,2}(cm|em|ex|in|mm|pc|pt|px|%|,|\))?)$/.test(kw)) {
                        continue;
                }
                clean += prop + ": " + val + "; ";
            }
        }
    });
    return clean;
};
