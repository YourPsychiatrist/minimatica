import * as React from "react";
import "./MinimaticaText.sass";
// // import * as ace from "ace-builds/src-noconflict/ace";
//
import * as ace from "brace";
import AceEditor from "react-ace";
import CustomMinimaticaMode from "./ace_mode/CustomMinimaticaMode";
import "brace/theme/tomorrow";
import {RefObject} from "react";

interface MinimaticaTextProps {
  sourceText: string;
  onSourceEdit: (sourceText: string) => void;
}

interface MinimaticaTextState {
}

// onChange={(event) => this.props.onSourceEdit("Hello")}
class MinimaticaText extends React.Component<MinimaticaTextProps, MinimaticaTextState> {

  state = {};

  // @ts-ignore
  reference: RefObject<ace>;

  constructor(props: MinimaticaTextProps) {
    super(props);
    this.reference = React.createRef();
  }

  componentDidMount(): void {
    this.reference.current.editor.getSession().setMode(new CustomMinimaticaMode());
  }

  render() {
    const Style = {
      lineHeight: "20px",
      fontFamily: "Fira Mono"
    };
    const { sourceText, onSourceEdit } = this.props;
    // return (<textarea
    //   className="minimatica-editor"
    //   defaultValue={sourceText}
    //   onChange={(e) => onSourceEdit(e.target.value)} />);
    return (<AceEditor
      onChange={(text, action) => onSourceEdit(text)}
      className="minimatica-editor"
      mode="text"
      theme="tomorrow"
      ref={this.reference}
      fontSize={13}
      style={Style}
      value={sourceText}
      name="minimatica-editor"
      editorProps={{ $blockScrolling: true }}/>);
  }

}

export default MinimaticaText;
