import * as React from "react";
import "./MinimaticaText.sass";
// // import * as ace from "ace-builds/src-noconflict/ace";
//
// import AceEditor from "react-ace";
// import "./ace_mode/mode-minimatica";
// // import "brace/mode/minimatica";
// import "brace/theme/monokai";

interface MinimaticaTextProps {
  sourceText: string;
  onSourceEdit: (sourceText: string) => void;
}

interface MinimaticaTextState {
}
// onChange={(event) => this.props.onSourceEdit("Hello")}
class MinimaticaText extends React.Component<MinimaticaTextProps, MinimaticaTextState> {

  state = {};

  render() {
    const Style = {
      lineHeight: "20px",
      fontFamily: "Fira Mono"
    };
    const { sourceText } = this.props;
    return (<textarea  className="minimatica-editor" defaultValue={sourceText} />);
    // return (<AceEditor
    //   mode="minimatica"
    //   theme="monokai"
    //   fontSize={13}
    //   style={Style}
    //   value={sourceText}
    //   name="minimatica-editor"/>);
  }

}

export default MinimaticaText;
