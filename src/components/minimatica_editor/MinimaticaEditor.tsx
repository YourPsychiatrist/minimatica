import * as React from "react";
import { Console } from "../../minimatica/Console";
import MinimaticaText from "../minimatica_text/MinimaticaText";
import MinimaticaConsole from "../minimatica_console/MinimaticaConsole";
import { Parser } from "../../minimatica/Parser";

const DEFAULT_SOURCE = "print(integrate([x] -> x^(2) + x));\n" +
    "print(vec<3>(3, 10, -5));";

interface MinimaticaEditorProps {
}

interface MinimaticaEditorState {
  sourceText: string;
  console: Console;
  runs: number;
}

class MinimaticaEditor extends React.Component<MinimaticaEditorProps, MinimaticaEditorState> {

  state = {
    sourceText: DEFAULT_SOURCE,
    console: new Console(),
    runs: 0
  };

  onSourceEdit = (sourceText: string) => {
    this.setState({ sourceText });
  };

  interpret = () => {
    this.state.console.clear();
    const parser = new Parser(this.state.sourceText, this.state.console);
    parser.parse();
    this.setState({ runs: this.state.runs + 1 });
  };

  render() {
    const { sourceText, console, runs } = this.state;
    return (<div className="minimatica-editor">
      <MinimaticaText
          sourceText={sourceText}
          onSourceEdit={this.onSourceEdit} />
      <br />
      <button onClick={this.interpret}>Run</button>
      <MinimaticaConsole console={console} />
    </div>);
  }

}

export default MinimaticaEditor;
