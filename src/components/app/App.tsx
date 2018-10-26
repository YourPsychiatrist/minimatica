import * as React from "react";
import MinimaticaEditor from "../minimatica_editor/MinimaticaEditor";


interface AppState {
}

class App extends React.Component<{}, AppState> {

  state = {};

  render() { // use resizable view for mini reference to the right of the editor
    return (<MinimaticaEditor />);
  }

}

export default App;
