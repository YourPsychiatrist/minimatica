import * as React from "react";
import { MinimaticaEditor } from "../minimatica_editor/MinimaticaEditor";
import { TabbedComponent } from "../tabbed_component/TabbedComponent";
import { MinimaticaReference } from "../minimatica_reference/MinimaticaReference";
import { Updates } from "../updates/Updates";
import { Banner } from "../banner/Banner";
import { About } from "../about/About";
import "./App.sass";

/**
 * The root component of the Minimatica Web-App.
 */
export function App(): JSX.Element {
  return (<TabbedComponent
    label={ <Banner /> }
    tabs={ [
      {
        title: 'Editor',
        component: <MinimaticaEditor />
      },
      {
        title: 'Reference',
        component: <MinimaticaReference />
      },
      {
        title: "About",
        component: <About />
      },
      {
        title: 'Updates',
        component: <Updates />
      }
    ] } />);
}
