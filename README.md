
## Overview

html-sanitiser is a simple and straightforward HTML sanitiser. It includes whitelists
for elements, attributes, protocols in certain URI attributes, as well as of CSS
properties (and in some cases values) inside the style attribute.

I make no claims as to how secure it is. If you plan on using this in a critical
situation, please ensure that you have properly tested it first.

For the most part it is a port of the 
[sanitiser that ships with Rails](https://github.com/rails/rails/blob/master/actionpack/lib/action_controller/vendor/html-scanner/html/sanitizer.rb)
though naturally bugs may have been introduced in the port.

## Example

    var san = require("html-sanitiser");
    var saneHTML = san.sanitiseHTML(dirtyHTML);

## Installation

    $ npm install html-sanitiser

## Interface

This module exports two methods, sanitiseHTML() and sanitiseCSS(). You're only ever
likely to need the former, but sanitiseHTML() calls sanitiseCSS() in order to clean up
the CSS properties in style attributes, and as such it accepts the same options that it
then passes on.

sanitiseHTML() takes a string of dirty HTML and optionally a literal object of options
that can modify its behaviour. It returns a string of presumably sane HTML. It accepts
the following options (look at the source for the default values, they're right at the
top):

- allowedElements: an array of lowercase element names that are allowed to appear in the
HTML content.
- allowedAttributes: an array of lowercase attributes names that are allowed to appear on
elements.
- uriAttributes: an array of lowercase attributes names that contain URIs. These are checked to
ensure that they only point to allowed protocols.
- allowedProtocols: an array of lowercase URI schemes that are allowed in URI attributes.
- anything allowed by sanitiseCSS()

sanitiseCSS() takes a string of dirty CSS properties as they would appear in a style attribute
and optionally a literal object of options that can modify its behaviour. It returns a presumably 
sane string of CSS properties.  It accepts the following options (look at the source for the 
default values, they're right at the top):

- allowedProperties: a list of lowercase property names that are allowed. Note that this is
not the entire list since properties listed as shorthand properties are also allowed. Keep that
well in mind if you wish to exercise control over this aspect.
- shorthandProperties: a list of lowercase property names that are also shorthand for other
properties. For instance, this may list "background" or "border" which would enable "background-color"
and "background-opacity" or "border-size" and "border-style". Note that just because a CSS property
can be a shorthand property does not mean that it has to be listed here. For instance, font and its
expanded properties are listed in allowedProperties because we do not want the keyword checking
that operates on shorthand properties.
- allowedKeywords: a list of keywords that are accepted on shorthand properties on top of the usual
numerical, colour, etc. values.

## Performance

Under the hood this currently uses the jsdom module in order to properly parse the HTML 
and manipulate it before serialising it anew. This is not necessarily the fastest approach
on Earth, but in my experience it hasn't proved to be a problem. YMMV though, and if this
becomes an issue it's entirely possible to look at alternative approaches.

## License 

(The MIT License)

Copyright (c) 2011-2012 Robin Berjon &lt;robin@berjon.com&gt;

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
'Software'), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
