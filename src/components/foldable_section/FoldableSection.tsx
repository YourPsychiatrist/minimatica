import * as React from "react";
import { FoldableSectionItem, RawSectionItem } from "../foldable_section_item/FoldableSectionItem";
import { withOptionalStyles } from "../../utils";
import "./FoldableSection.sass";

/**
 * A section as exported from JSON
 */
export interface RawSection {
  /**
   * The section header.
   */
  category: string;

  /**
   * The content of the section.
   */
  content: RawSectionItem[];
}

interface FoldableSectionState {
  /**
   * Whether the section's contents are shown.
   */
  expanded: boolean;
}

interface FoldableSectionProps {
  /**
   * The section header.
   */
  header: string;

  /**
   * The section items.
   */
  // @ts-ignore
  children: FoldableSectionItem[];
}

/**
 * A section which consists of sub-sections.
 */
export class FoldableSection extends React.Component<FoldableSectionProps, FoldableSectionState> {

  state = {
    expanded: false
  };

  private toggle = (): void => {
    this.setState({
      expanded: !this.state.expanded
    });
  };

  render() {
    const { header, children } = this.props;
    const { expanded } = this.state;

    const className = withOptionalStyles("foldable-section",
      expanded ? "foldable-section--expanded" : "");
    return (<section className={ className }>
      <h2 className="foldable-section__header" onClick={ this.toggle }>{ header }</h2>
      {/* This div is hidden if the section is not expanded */ }
      <div className="foldable-section__content">
        { children }
      </div>
    </section>);
  }
}
