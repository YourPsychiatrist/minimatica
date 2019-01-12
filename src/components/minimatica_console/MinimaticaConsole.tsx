import * as React from "react";
import { Console } from "../../minimatica/Console";
import { Function } from "../../minimatica/stdlib/Function";
import { FunctionDisplay } from "../function_display/FunctionDisplay";
import { withOptionalStyles } from "../../utils";
import "./MinimaticaConsole.sass";

interface MinimaticaConsoleProps {
  /**
   * The console object from which to fetch logs and errors.
   */
  console: Console;
}

/**
 * A visualization of the console supplied as prop.
 */
export class MinimaticaConsole extends React.Component<MinimaticaConsoleProps, {}> {

  constructor(props: MinimaticaConsoleProps) {
    super(props);
    // "subscribe" to console updates
    props.console.onLog = () => {
      this.forceUpdate();
    };
    props.console.onError = () => {
      this.forceUpdate();
    };
  }

  /**
   * Constructs a default entry to the console.
   * @param obj The object to display.
   * @param index The index of the object within the console's list of logs.
   */
  private ConsoleEntry = (obj: any, index: number): JSX.Element => {
    let element = null;
    if (obj instanceof Function) {
      element = (<FunctionDisplay f={ obj } />);
    } else {
      let lines = 0;
      element = obj.toString().split("\n")
        .map((str) => <div key={ lines++ }>{ str }</div>);
    }
    return (<li className="mm-console__item" key={ index }>{ element }</li>);
  };

  /**
   * Constructs an error entry for the console.
   * @param str The message to display as error.
   */
  private ConsoleError = (str: string): JSX.Element => {
    const className = "mm-console__item mm-console__item--error";
    return (<li className={ className } key={ str }>{ str }</li>);
  };

  // prevent the source code change triggering a console update
  shouldComponentUpdate(nextProps: Readonly<MinimaticaConsoleProps>,
                        nextState: Readonly<{}>,
                        nextContext: any): boolean {
    return this.props.console.logs !== nextProps.console.logs;
  }

  render() {
    const { console } = this.props;

    const className = withOptionalStyles("mm-console",
      console.errors.length === 0 && console.logs.length === 0 ? "empty" : "");
    return (<ul className={ className }>
      { console.errors.length === 0 && console.logs.map(this.ConsoleEntry) }
      { console.errors.map(this.ConsoleError) }
    </ul>);
  }

}
