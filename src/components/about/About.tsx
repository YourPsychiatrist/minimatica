import * as React from "react";
import { Banner } from "../banner/Banner";
import "./About.sass";

/**
 * A short description of Minimatica.
 */
export function About(): JSX.Element {
  return (<section id="about">
    <Banner />
    <p>is a minimalistic interpreted language for mathematical computations. It is open
      source and available on <a href="https://github.com/YourPsychiatrist/minimatica.git">github.com</a>. It is
      intended to be a small but advanced calculator for common computations such as binomial coefficients and
      the multiplication of matrices - it is by no means an exhaustive tool.</p>
    <p>
      You can find a full reference in the respective tab at the top. The reference tells you what data types,
      operations and constants are available. The "Updates" tab provides an overview of recently added features.</p>
  </section>);
}
