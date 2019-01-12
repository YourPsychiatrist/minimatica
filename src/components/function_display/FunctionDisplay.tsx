import * as React from "react";
import { Function } from "../../minimatica/stdlib/Function";

interface FunctionDisplayProps {
  /**
   * The function to display.
   */
  f: Function;
}

/**
 * An iterator over the set of real numbers.
 */
interface NextFunction {
  (x: number): number;
}

interface Point2D {
  x: number;
  y: number;
}

/**
 * Displays the polynomial form of a function along with
 * a visualization using the canvas element.
 */
export class FunctionDisplay extends React.Component<FunctionDisplayProps, {}> {

  /**
   * The width of the canvas viewport.
   */
  private static readonly _WIDTH = 150;

  /**
   * The height of the canvas viewport.
   */
  private static readonly _HEIGHT = 150;

  /**
   * The number of segments (/divisions) within the viewport.
   */
  private static readonly _SEGMENTS = 6;

  /**
   * The absolute number of pixels between horizontal segments.
   */
  private static readonly _HORIZONTAL_STRIDE = FunctionDisplay._WIDTH / FunctionDisplay._SEGMENTS;

  /**
   * The absolute number of pixel between vertical segments.
   */
  private static readonly _VERTICAL_STRIDE = FunctionDisplay._HEIGHT / FunctionDisplay._SEGMENTS;

  /**
   * The step size of the arguments supplied to the function that should be displayed.
   * This directly determines the smoothness of the drawn curve.
   */
  private static readonly _PRECISION = 0.1;

  /**
   * All canvas elements need a unique ID so the FunctionDisplay class
   * keeps track off the number of instances produced, using it as a
   * suffix for new IDs.
   */
  private static _instanceCounter: number = 0;

  /**
   * The ID of the canvas used for drawing this object's function.
   */
  private readonly _canvasId: string;

  /**
   * Scales x and y so they correspond with the cartesian coordinate
   * system displayed on the canvas.
   * @param x The x-coordinate to scale.
   * @param y The y-coordinate to scale.
   * @return A point which correctly maps to the drawn coordinate system.
   */
  private static mapToViewport = (x: number, y: number): Point2D => {
    return {
      x: FunctionDisplay._WIDTH / 2 + FunctionDisplay._HORIZONTAL_STRIDE * x,
      y: FunctionDisplay._HEIGHT / 2 - FunctionDisplay._VERTICAL_STRIDE * y
    };
  };

  /**
   * @param point The point to check.
   * @return True if the supplied point would appear on the canvas if plotted.
   */
  private static isWithinViewport = (point: Point2D): boolean => {
    const x = Math.abs(point.x);
    const y = Math.abs(point.y);
    const segmentsPerQuadrant = FunctionDisplay._SEGMENTS / 2;
    return y < segmentsPerQuadrant && y >= 0 &&
      x < segmentsPerQuadrant && x >= 0;
  };

  constructor(props: FunctionDisplayProps) {
    super(props);
    FunctionDisplay._instanceCounter += 1;
    this._canvasId = "function-graph-" + FunctionDisplay._instanceCounter;
  }

  /**
   * Draws coordinate system guides to the canvas.
   * @param context The rendering context to use.
   */
  private drawCoordinateGrid = (context: CanvasRenderingContext2D): void => {
    const oldStrokeStyle = context.strokeStyle;
    const oldFillStyle = context.fillStyle;

    // "clear" whole canvas
    context.fillStyle = "#fff";
    context.fillRect(0, 0, FunctionDisplay._WIDTH, FunctionDisplay._HEIGHT);

    // start drawing the grid
    context.strokeStyle = "rgb(235, 235, 235)";
    context.beginPath();

    // draw one line per segment
    for (let i = 1; i < FunctionDisplay._SEGMENTS; ++i) {
      const oldLineWidth = context.lineWidth;

      // draw the center coordinate system guide  a bit thicker
      if (i * 2 === FunctionDisplay._SEGMENTS) {
        context.lineWidth = 2;
      }

      // vertical grid
      context.moveTo(i * FunctionDisplay._HORIZONTAL_STRIDE, 0);
      context.lineTo(i * FunctionDisplay._HORIZONTAL_STRIDE, FunctionDisplay._HEIGHT);

      // horizontal grid
      context.moveTo(0, i * FunctionDisplay._VERTICAL_STRIDE);
      context.lineTo(FunctionDisplay._WIDTH, i * FunctionDisplay._VERTICAL_STRIDE);

      // draw
      context.stroke();
      // restart
      context.beginPath();
      context.lineWidth = oldLineWidth;
    }

    context.strokeStyle = oldStrokeStyle;
    context.fillStyle = oldFillStyle;
  };

  /**
   * Draws a graph corresponding to the supplied data points.
   * @param context The rendering context to use.
   * @param dataPoints The data points to plot.
   */
  private drawGraph = (context: CanvasRenderingContext2D, dataPoints: Point2D[]): void => {
    if (dataPoints.length === 0) {
      return;
    }
    
    const oldStrokeStyle = context.strokeStyle;
    const oldLineWidth = context.lineWidth;

    context.strokeStyle = "rgb(0, 148, 204)";
    context.lineWidth = 2;
    context.beginPath();

    const first = FunctionDisplay.mapToViewport(dataPoints[0].x, dataPoints[0].y);
    context.moveTo(first.x, first.y);

    for (let i = 1; i < dataPoints.length; ++i) {
      // now draw line along remaining data points
      const curr: Point2D = FunctionDisplay.mapToViewport(dataPoints[i].x, dataPoints[i].y);
      context.lineTo(curr.x, curr.y);
    }

    context.stroke();
    context.strokeStyle = oldStrokeStyle;
    context.lineWidth = oldLineWidth;
  };

  /**
   * Recursively calculates relevant data points for the graph.
   * In this context "relevant" means that they are within the bounds
   * of the canvas element.
   * @param x The current argument the displayed function will be applied to.
   * @param next A function returning the next data point to calculate.
   */
  private calculateDatapoints = (x: number, next: NextFunction): Point2D[] => {
    const result: Point2D = {
      x: x,
      y: this.props.f.apply(x)
    };

    if (!FunctionDisplay.isWithinViewport(result)) {
      // if the result is out of bounds for the viewport,
      // discard it and end recursion
      return [];
    } else {
      // otherwise store point and calculate next one
      return [result, ...this.calculateDatapoints(next(x), next)];
    }
  };

  /**
   * Draws the integer labels for the coordinate grid.
   * @param context The rendering context to use.
   */
  private drawAxisLabels = (context: CanvasRenderingContext2D): void => {
    const oldStyle = context.fillStyle;
    context.fillStyle = "#555";

    for (let i = 1; i < FunctionDisplay._SEGMENTS; ++i) {
      const segment = i - (FunctionDisplay._SEGMENTS / 2);
      // x axis
      context.fillText(segment.toString(),
        i * FunctionDisplay._HORIZONTAL_STRIDE,
        FunctionDisplay._HEIGHT - 10);

      // y axis
      context.fillText(segment.toString(),
        10,
        FunctionDisplay._HEIGHT - (i * FunctionDisplay._HORIZONTAL_STRIDE) + 4);
    }

    context.fillStyle = oldStyle;
  };

  /**
   * Renders the function which was supplied as prop to the canvas element.
   */
  private drawDisplay = (): void => {
    // prepare canvas and context
    const canvas: any = document.getElementById(this._canvasId);
    if (!canvas.getContext) {
      return;
    }
    const context = canvas.getContext("2d");

    const points: Point2D[] = [
      // use every point but first one to avoid the duplicate for x=0
      ...this.calculateDatapoints(0, (x: number) => x - FunctionDisplay._PRECISION).slice(1).reverse(),
      ...this.calculateDatapoints(0, (x: number) => x + FunctionDisplay._PRECISION)
    ];
    this.drawCoordinateGrid(context);
    this.drawGraph(context, points);
    this.drawAxisLabels(context);
  };

  // redraw on function update
  componentDidUpdate(prevProps: Readonly<FunctionDisplayProps>, prevState: Readonly<{}>, snapshot?: any): void {
    this.drawDisplay();
  }

  // draw as soon as component has mounted
  componentDidMount(): void {
    this.drawDisplay();
  }

  render() {
    const { f } = this.props;

    return (<React.Fragment>
      <span style={ { display: "block" } }>{ f.toString() }</span>
      <canvas
        id={ this._canvasId }
        width={ FunctionDisplay._WIDTH }
        height={ FunctionDisplay._HEIGHT }>
        Your browser does not support the canvas element.
      </canvas>
    </React.Fragment>);
  }
}
