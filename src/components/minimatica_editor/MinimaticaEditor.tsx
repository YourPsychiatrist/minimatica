import * as React from "react";
import { Console } from "../../minimatica/Console";
import MinimaticaText from "../minimatica_text/MinimaticaText";
import MinimaticaConsole from "../minimatica_console/MinimaticaConsole";
import { Parser } from "../../minimatica/Parser";

import "./MinimaticaEditor.sass";

const DEFAULT_SOURCE = "# function literals\n" +
  "var f1 := [x] -> x^(3) - 2x^(2) + x;\n" +
  "print(f1);\n" +
  "print(f1(3));\n" +
  "\n" +
  "# derive functions\n" +
  "var fder := derive(f1);\n" +
  "print(fder);\n" +
  "print(fder(3));\n" +
  "\n" +
  "# integrate functions\n" +
  "var fint := integrate(f1);\n" +
  "print(fint);\n" +
  "print(fint(3));\n" +
  "\n" +
  "# matrices\n" +
  "var mat1 := mat<2, 2>(1, 0, \n" +
  "                   0, 1);\n" +
  "var mat2 := mat<2, 2>(3, -2,\n" +
  "                      5,  1);\n" +
  "print(mat1);\n" +
  "print(mat1 * mat2);\n" +
  "\n" +
  "# basic math functions\n" +
  "print(fact(5)); # 5! = 120\n" +
  "print(binomial(10, 8)); # 10 choose 8\n" +
  "print(cos(90)); # cos(90) = 0 using degrees";

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
