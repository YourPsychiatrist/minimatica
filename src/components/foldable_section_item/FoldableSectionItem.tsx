import * as React from "react";
import "./FoldableSectionItem.sass";

/**
 * A section item as exported from JSON.
 */
export interface RawSectionItem {
  /**
   * The name of the subsection.
   */
  name: string;

  /**
   * A small monospaced code display.
   */
  signature: string;

  /**
   * Moar text!! Nomnom.
   */
  description: string;
}

/**
 * The props interface is mostly about semantics. all of the props
 * are RawSectionItem members. However, should I need to pass additional
 * props to the FoldableSectionItem, I am prepared!
 */
interface FoldableSectionItemProps extends RawSectionItem {
}

export function FoldableSectionItem(props: FoldableSectionItemProps): JSX.Element {
  const { name, signature, description } = props;

  return (<div className="foldable-section__item">
    <h3>{ name }</h3>
    <pre><code>{ signature }</code></pre>
    <p>{ description }</p>
  </div>);
}
