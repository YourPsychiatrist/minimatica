/* ***** BEGIN LICENSE BLOCK *****
 * Distributed under the BSD license:
 *
 * Copyright (c) 2010, Ajax.org B.V.
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *     * Redistributions of source code must retain the above copyright
 *       notice, this list of conditions and the following disclaimer.
 *     * Redistributions in binary form must reproduce the above copyright
 *       notice, this list of conditions and the following disclaimer in the
 *       documentation and/or other materials provided with the distribution.
 *     * Neither the name of Ajax.org B.V. nor the
 *       names of its contributors may be used to endorse or promote products
 *       derived from this software without specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
 * ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
 * WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED. IN NO EVENT SHALL AJAX.ORG B.V. BE LIABLE FOR ANY
 * DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
 * (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
 * LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
 * ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
 * SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 *
 * ***** END LICENSE BLOCK ***** */

ace.define('ace/mode/minimatica_highlight_rules', function(require, exports, module) {
  "use strict";

  var oop = require("../lib/oop");
  var DocCommentHighlightRules = require("./doc_comment_highlight_rules").DocCommentHighlightRules;
  var TextHighlightRules = require("./text_highlight_rules").TextHighlightRules;

// TODO: Unicode escape sequences
  var identifierRe = "[a-zA-Z\\$_\u00a1-\uffff][a-zA-Z\\d\\$_\u00a1-\uffff]*";

  function comments(next) {
    return [
      {
        token : "comment", // multi line comment
        regex : /\/\*/,
        next: [
          DocCommentHighlightRules.getTagRule(),
          {token : "comment", regex : "\\*\\/", next : next || "pop"},
          {defaultToken : "comment", caseInsensitive: true}
        ]
      }, {
        token : "comment",
        regex : "\\/\\/",
        next: [
          DocCommentHighlightRules.getTagRule(),
          {token : "comment", regex : "$|^", next : next || "pop"},
          {defaultToken : "comment", caseInsensitive: true}
        ]
      }
    ];
  }

  var MinimaticaHighlightRules = function(options) {
    // see: https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects
    var keywordMapper = this.createKeywordMapper({
      "variable.language":
        "mat|vec|integrate|derive|cos|sin|tan|binomial|fact",
      "keyword":
        "",
      "storage.type":
        "var",
      "constant.language":
        "",
      "support.function":
        "print",
      "constant.language.boolean": ""
    }, "identifier");

    // regexp must not have capturing parentheses. Use (?:) instead.
    // regexps are ordered -> the first match is used

    this.$rules = {
      "no_regex" : [
        DocCommentHighlightRules.getStartRule("doc-start"),
        comments("no_regex"),
        {
          token : "constant.numeric", // decimal integers and floats
          regex : /(?:\d\d*(?:\.\d*)?|\.\d+)(?:[eE][+-]?\d+\b)?/
        }, {
          // from "module-path" (this is the only case where 'from' should be a keyword)
          token : "keyword",
          regex : "from(?=\\s*('|\"))"
        }, {
          token : ["support.constant"],
          regex : /that\b/
        }, {
          token : keywordMapper,
          regex : identifierRe
        }, {
          token : "punctuation.operator",
          regex : /[.](?![.])/,
          next  : "property"
        }, {
          token : "storage.type",
          regex : /=>/,
          next  : "start"
        }, {
          token : "keyword.operator",
          regex : /->?|\+|:=|\*\/%|\^/,
          next  : "start"
        },{
          token : "paren.lparen",
          regex : /[\[({]/,
          next  : "start"
        }, {
          token : "paren.rparen",
          regex : /[\])}]/
        }, {
          token: "comment",
          regex: /#.*$/
        }
      ],
      property: [{
        token : "identifier",
        regex : identifierRe
      }, {
        regex: "",
        token: "empty",
        next: "no_regex"
      }
      ],
      // regular expressions are only allowed after certain tokens. This
      // makes sure we don't mix up regexps with the divison operator
      "start": [
        DocCommentHighlightRules.getStartRule("doc-start"),
        comments("start"),
        {
          // immediately return to the start mode without matching
          // anything
          token: "empty",
          regex: "",
          next: "no_regex"
        }
      ]
    };

    this.embedRules(DocCommentHighlightRules, "doc-",
      [ DocCommentHighlightRules.getEndRule("no_regex") ]);

    this.normalizeRules();
  };

  oop.inherits(MinimaticaHighlightRules, TextHighlightRules);

  exports.MinimaticaHighlightRules = MinimaticaHighlightRules;
});

ace.define('ace/mode/minimatica', function(require, exports, module) {

  var oop = require("../lib/oop");
  var TextMode = require("./text").Mode;
  var MinimaticaHighlighter = require("./minimatica_highlight_rules").MinimaticaHighlighter;

  var Mode = function() {
    this.HighlightRules = MinimaticaHighlighter;
  };
  oop.inherits(Mode, TextMode);

  (function() {
    // Extra logic goes here. (see below)
  }).call(Mode.prototype);

  exports.Mode = Mode;
});