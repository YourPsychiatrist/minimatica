import * as React from "react";
import { Console } from "../../minimatica/Console";

import "./MinimaticaConsole.sass";

interface MinimaticaConsoleProps {
  console: Console;
}

interface MinimaticaConsoleState {
}

class MinimaticaConsole extends React.Component<MinimaticaConsoleProps, MinimaticaConsoleState> {

  constructor(props: MinimaticaConsoleProps) {
    super(props);
    props.console.onLog = (obj: any) => { this.forceUpdate(); };
  }

  ConsoleEntry = (obj: any) => {
    return <li key={(Math.random() * 100).toString()}>{">  " + obj.toString()}</li>
  };

  // prevent the source text triggering a console update
  shouldComponentUpdate(nextProps: Readonly<MinimaticaConsoleProps>,
                        nextState: Readonly<MinimaticaConsoleState>,
                        nextContext: any): boolean {
    return this.props.console.messages !== nextProps.console.messages;
  }

  render() {
    const { console } = this.props;
    return <ul className="console">
      {console.messages.map(this.ConsoleEntry)}
    </ul>;
  }

}

export default MinimaticaConsole;
