import * as React from "react";
import { withOptionalStyles } from "../../utils";
import "./TabbedComponent.sass";

interface TabbedComponentProps {
  /**
   * The label to display to the right of the tabs.
   */
  label: JSX.Element

  /**
   * The list of tabs managed by the TabbedComponent.
   */
  tabs: {
    /**
     * The title of the tab.
     */
    title: string,
    /**
     * The component associated with a tab title.
     */
    component: JSX.Element
  } [];
}

interface TabbedComponentState {
  /**
   * The index of the currently selected (/displayed) tab.
   */
  currentTabIndex: number;
}

/**
 * A component managing multiple sub-components at once by providing
 * a dedicated tab for each of them.
 */
export class TabbedComponent extends React.Component<TabbedComponentProps, TabbedComponentState> {

  state = {
    currentTabIndex: 0
  };

  /**
   * Constructs a clickable tab which displays it's associated
   * component upon clicking.
   * @param title The title of the tab.
   * @param index The index of the tab within the containers list.
   */
  private NavTab = (title: string, index: number): JSX.Element => {
    const updateTabIndex = () => this.setState({
      currentTabIndex: index
    });

    const classNames = withOptionalStyles("tabbed-container__navbar__tab",
      index == this.state.currentTabIndex ? "tabbed-container__navbar__tab--selected" : "");

    return (<span
      key={ title }
      className={ classNames }
      onClick={ updateTabIndex }>
        { title }
    </span>);
  };

  render() {
    const { label, tabs } = this.props;
    const { currentTabIndex } = this.state;

    const currentComponent = tabs[currentTabIndex].component;
    return (<div className="tabbed-container">
      <header>
        <h2 className="tabbed-container__label">{ label }</h2>
        <nav className="tabbed-container__navbar">
          { tabs.map((tab) => tab.title).map(this.NavTab) }
        </nav>
      </header>
      <div className="tabbed-container__component">
        { currentComponent }
      </div>
    </div>);
  }
}