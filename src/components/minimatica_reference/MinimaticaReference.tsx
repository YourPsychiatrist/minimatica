import * as React from "react";
import * as Reference from "../../res/reference.json";
import "./MinimaticaReference.sass";
import { FoldableSection, RawSection } from "../foldable_section/FoldableSection";
import { FoldableSectionItem, RawSectionItem } from "../foldable_section_item/FoldableSectionItem";

interface MinimaticaReferenceState {
  /**
   * The index of the currently expanded
   * reference section.
   */
  expandedIndex: number;
}

class MinimaticaReference extends React.Component<{}, MinimaticaReferenceState> {

  state = {
    expandedIndex: 0
  }

  /**
   * @param index The index of the section
   *              to expand.
   */
  switchSection = (index: number) => {
    this.setState({expandedIndex: index});
  }

  /**
   * Returns a section item element created from
   * the supplied raw data.
   * @param item The raw section item data.
   */
  generateSectionItem = (item: RawSectionItem) => {
    return (<FoldableSectionItem {...item} />);
  }

  /**
   * Returns a section element created from the
   * supplied raw data.
   * @param section The raw section data.
   * @param index The index at which this section
   *              will be mounted in its parent.
   */
  generateSection = (section: RawSection, index: number) => {
    return (<FoldableSection
      key={section.category}
      header={section.category}
      expanded={index == this.state.expandedIndex}
      onSelect={() => this.switchSection(index)}>
      {section.content.map(this.generateSectionItem)}
    </FoldableSection>);
  }

  render() {
    const { expandedIndex } = this.state;
    return (<div className="foldable-section-list">
      {/* Load and display all sections from the reference json file */}
      {Reference.data.map((section: RawSection, currentIndex: number) => {
        return this.generateSection(section, currentIndex);
      })}
    </div>);
  }
}

export default MinimaticaReference;
