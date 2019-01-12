import * as React from "react";
import { Console } from "../../minimatica/Console";
import MinimaticaText from "../minimatica_text/MinimaticaText";
import { MinimaticaConsole } from "../minimatica_console/MinimaticaConsole";
import { Parser } from "../../minimatica/Parser";
import { StdLib } from "../../minimatica/StdLib";
import { MMStorage } from "../../utils";
import "./MinimaticaEditor.sass";
import * as ExampleSource from "../../res/example.json";

interface MinimaticaEditorState {
  /**
   * The text within the editor.
   */
  sourceCode: string;

  /**
   * The console to log messages and errors to.
   */
  console: Console;
}

/**
 * An Ace-Editor along with controls and a visual console.
 */
export class MinimaticaEditor extends React.Component<{}, MinimaticaEditorState> {

  state = {
    sourceCode: "",
    console: new Console(),
  };

  constructor(props: {}) {
    super(props);
    StdLib.console = this.state.console;
  }

  /**
   * Callback for changes on the source code.
   * @param sourceCode The new source code.
   */
  private onSourceEdit = (sourceCode: string) => {
    this.setState({ sourceCode });
  };

  /**
   * Runs the minimatica parser on the source code in the editor.
   */
  private parse = () => {
    this.state.console.clear();
    const parser = new Parser(this.state.sourceCode);
    try {
      parser.parse();
    } catch (exc) {
      this.state.console.error(exc.toString());
    }
  };

  /**
   * Clears the editor.
   */
  private clear = () => {
    this.setState({ sourceCode: "" });
  };

  // load cached code on editor mount
  componentDidMount(): void {
    let sourceCode = ExampleSource.code;
    try {
      sourceCode = MMStorage.loadSourceCodeFromCache();
    } catch (_) { /* nothing to do; just load default source */
    }
    this.setState({ sourceCode });
  }

  // cache code on source code change (state update!)
  componentDidUpdate(prevProps: Readonly<{}>, prevState: Readonly<MinimaticaEditorState>, snapshot?: any): void {
    MMStorage.cacheSourceCode(this.state.sourceCode);
  }

  render() {
    const { sourceCode, console } = this.state;

    return (<div className="minimatica-editor">
      <MinimaticaText
        sourceCode={ sourceCode }
        onSourceEdit={ this.onSourceEdit } />

      <MinimaticaConsole console={ console } />

      <div className="minimatica-editor__controls">
        <button onClick={ this.parse }>Run</button>
        <button onClick={ this.clear }>Clear</button>
      </div>
    </div>);
  }

}
