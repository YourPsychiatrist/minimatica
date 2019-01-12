import * as React from "react";
import "./Updates.sass";

export function Updates(): JSX.Element {
  return (<footer>
    <h3>Updates</h3>
    <section>
      <h4>Beta Update</h4>
      <p>The previous versions also allowed to define, derive, integrate and apply functions consisting of
        polynomials with a minimum degree of 1. This limitation has been removed so that you can now use
        additive constants (polynomials with degree of 0!). <br />
        Additionally, the console now provides error messages if the interpretation of your script failed.
      </p>
    </section>
    <section>
      <h4>Alpha Update</h4>
      <p>
        Minimatica now has the following functions:
      </p>
      <ul>
        <li>pow</li>
        <li>sqrt</li>
        <li>random</li>
        <li>floor</li>
        <li>ceiling</li>
        <li>round</li>
      </ul>
      <p>
        You can find their documentation in the tab "Misc. Functions". <br />
        I also introduced globally defined constants (docs in the "Constants" tab!):
      </p>
      <ul>
        <li>e</li>
        <li>pi</li>
      </ul>
    </section>
  </footer>);
}
