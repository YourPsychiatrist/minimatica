import * as React from "react";
import "./SplitView.sass";

interface SplitViewProps {
  left: JSX.Element;
  right: JSX.Element;
}

interface SplitViewState {
}

class SplitView extends React.Component<SplitViewProps, SplitViewState> {
  render() {
    const { left, right } = this.props;
    return (<div className="main--2-cols">
      <section>{left}</section>
      <section>{right}</section>
    </div>);
  }
}

export default SplitView;