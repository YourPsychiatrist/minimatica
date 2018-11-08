import "brace/mode/text";

export class CustomMinimaticaHighlightRules
  extends window.ace.acequire("ace/mode/text_highlight_rules").TextHighlightRules {
  constructor () {
    super();

    const keywordMapper = this.createKeywordMapper({
      "variable.language":
        "mat|vec|integrate|derive|cos|sin|tan|binomial|fact|pow|sqrt|random|floor|ceiling|round",
      "keyword":
        "",
      "storage.type":
        "var",
      "constant.language":
        "pi|e",
      "support.function":
        "print",
      "constant.language.boolean": ""
    }, "identifier");

    const identifierRe = "[a-zA-Z\\$_\u00a1-\uffff][a-zA-Z\\d\\$_\u00a1-\uffff]*";

    this.$rules = {
      "no_regex" : [
        //DocCommentHighlightRules.getStartRule("doc-start"),
        //comments("no_regex"),
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
        //DocCommentHighlightRules.getStartRule("doc-start"),
        //comments("start"),
        {
          // immediately return to the start mode without matching
          // anything
          token: "empty",
          regex: "",
          next: "no_regex"
        }
      ]
    };

    this.normalizeRules();
  }
}

export default class CustomMinimaticaMode extends window.ace.acequire("ace/mode/text").Mode {
  constructor() {
    super();
    this.HighlightRules = CustomMinimaticaHighlightRules;
  }
}