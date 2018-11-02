import * as React from "react";
import "./FoldableSection.sass";
import {FoldableSectionItem, RawSectionItem} from "../foldable_section_item/FoldableSectionItem";
import {withOptionalStyles} from "../../react_utils";

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

interface FoldableSectionProps {
  /**
   * The section header.
   */
  header: string;

  /**
   * Whether the section's content
   * should be displayed or not.
   */
  expanded: boolean;

  /**
   * The callback for header clicks.
   */
  onSelect: () => any;

  /**
   * The section items.
   */
  children: FoldableSectionItem[];
}

export function FoldableSection(props: FoldableSectionProps) {
  const { header, expanded, onSelect, children } = props;
  const expandedClass = expanded ? "expanded" : "";
  return (<div className={withOptionalStyles("foldable-section", expandedClass)}>
    <h2 onClick={onSelect}>{header}</h2>
    {/* This div is hidden if the section is not expanded */}
    <div className="foldable-section-content">
      {children}
    </div>
  </div>);
}
