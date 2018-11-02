import * as React from "react";
import "./FoldableSectionItem.sass";

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
 * The props interface is mostly semantics. all of the props
 * are RawSectionItem members. Though, should I need to pass additional
 * props to the FoldableSectionItem, I am prepared!
 */
interface FoldableSectionItemProps extends RawSectionItem { }

export function FoldableSectionItem(props: FoldableSectionItemProps): JSX.Element {
  const { name, signature, description } = props;
  return (<div className="foldable-section-item">
    <h3>{name}</h3>
    <pre><code>{signature}</code></pre>
    <p>{description}</p>
  </div>);
}
