import * as React from "react";
import { Function } from "../../minimatica/stdlib/Function";

interface FunctionDisplayProps {
  f: Function;
}

function FunctionDisplay (props: FunctionDisplayProps) {
  // todo draw canvas here
  return props.f.toString();
}

export default FunctionDisplay;
