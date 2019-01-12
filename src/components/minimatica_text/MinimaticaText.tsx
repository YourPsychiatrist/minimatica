import * as React from "react";
import * as ace from "brace";
import AceEditor from "react-ace";
import CustomMinimaticaMode from "./ace_mode/CustomMinimaticaMode";
import "brace/theme/tomorrow";
import "./MinimaticaText.sass";

interface MinimaticaTextProps {
  /**
   * The code to supply to the ace editor.
   */
  sourceCode: string;

  /**
   * The callback to invoke when the text within the
   * editor changes.
   * @param sourceText
   */
  onSourceEdit: (sourceText: string) => void;
}

/**
 * The container mounting the actual Ace editor
 */
class MinimaticaText extends React.Component<MinimaticaTextProps> {

  // @ts-ignore
  reference: React.RefObject<ace>;

  constructor(props: MinimaticaTextProps) {
    super(props);
    this.reference = React.createRef();
  }

  componentDidMount(): void {
    const editor = this.reference.current.editor;
    editor.getSession().setMode(new CustomMinimaticaMode());
    // noinspection TypeScriptValidateJSTypes
    editor.setOption("showPrintMargin", false);
  }

  render() {
    const { sourceCode, onSourceEdit } = this.props;

    const Style = {
      lineHeight: "20px",
      fontFamily: "Fira Mono"
    };
    return (<AceEditor
      onChange={ onSourceEdit }
      className="minimatica-text"
      mode="text"
      theme="tomorrow"
      ref={ this.reference }
      fontSize={ 14 }
      style={ Style }
      value={ sourceCode }
      name="minimatica-editor"
      editorProps={ { $blockScrolling: true } } />);
  }

}

export default MinimaticaText;
