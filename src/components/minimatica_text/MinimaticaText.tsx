import * as React from "react";
import "./MinimaticaText.sass";

interface MinimaticaTextProps {
  sourceText: string;
  onSourceEdit: (sourceText: string) => void;
}

interface MinimaticaTextState {
}

class MinimaticaText extends React.Component<MinimaticaTextProps, MinimaticaTextState> {

  state = {};

  render() {
    const { sourceText } = this.props;
    return (<div className="minimatica-text">
      <textarea
          onChange={(event) => this.props.onSourceEdit(event.target.value)}
          value={sourceText}>
      </textarea>
    </div>);
  }

}

export default MinimaticaText;
