import * as React from "react";
import * as Reference from "../../res/reference.json";
import { FoldableSection, RawSection } from "../foldable_section/FoldableSection";
import { FoldableSectionItem, RawSectionItem } from "../foldable_section_item/FoldableSectionItem";

/**
 * Returns a section item element created from
 * the supplied raw data.
 * @param item The raw section item data.
 */
function SectionItem(item: RawSectionItem): JSX.Element {
  return (<FoldableSectionItem key={ item.name } { ...item } />);
}

/**
 * Returns a section element created from the
 * supplied raw data.
 * @param section The raw section data.
 */
function Section(section: RawSection): JSX.Element {
  return (<FoldableSection
    key={ section.category }
    header={ section.category }>
    { section.content.map(SectionItem) }
  </FoldableSection>);
}

/**
 * A reference for all data types, functions and constants available in Minimatica.
 */
export function MinimaticaReference(): JSX.Element {
  return (<React.Fragment>
    {/* Load and display all sections from the reference json file */ }
    { Reference.data.map(Section) }
  </React.Fragment>);
}
