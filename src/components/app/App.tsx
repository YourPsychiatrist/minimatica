import * as React from "react";
import MinimaticaEditor from "../minimatica_editor/MinimaticaEditor";
import MinimaticaReference from "../minimatica_reference/MinimaticaReference";
import SplitView from "../split_view/SplitView";
import "./App.sass";

export function App(): JSX.Element {
  return (<React.Fragment>
    <header>
      <div className="header-content--wrapper">
        <h1><span>M</span>ini<span>M</span>atica</h1>
        <p>
          Minimatica is a minimalistic interpreted language for mathematical computations. It is open
          source and available on <a href="https://github.com/YourPsychiatrist/minimatica.git">github.com</a>.
          You can run your scripts in the editor to the right and if you want to know what Minimatica is
          capable of, check out the reference to the left.
        </p>
      </div>
    </header>
    <SplitView
      left={<MinimaticaReference/>}
      right={<MinimaticaEditor/>}/>
  </React.Fragment>);
}
