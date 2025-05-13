import * as d3 from "d3";

/**
 * Creates and styles an x-axis for a D3 plot.
 * @param svgElement - The D3 selection of the SVG element.
 * @param x - The D3 scale for the x-axis.
 * @param innerHeight - The height of the inner plot area.
 * @param colorPalette - An array of colors for the tick labels.
 */
export function createXAxis(
  svgElement: d3.Selection<SVGGElement, unknown, null, undefined>,
  x: d3.ScaleBand<string>,
  innerHeight: number,
  colorPalette: string[]
): void {
  const xAxis = svgElement.append("g")
    .attr("transform", `translate(0,${innerHeight})`)
    .call(d3.axisBottom(x));

  xAxis.select(".domain").remove();

  xAxis.selectAll("text")
    .style("font-size", "14px")
    .style("font-family", "sans-serif")
    .style("font-weight", "bold");

  xAxis.selectAll(".tick")
    .each(function (d, i) {
      const tick = d3.select(this);
      const text = tick.select("text");

      const bbox = (text.node() as SVGTextElement).getBBox(); // get actual rendered size

      const squareSize = 16;
      const padding = 4;

      tick.insert("rect", "text")
        .attr("x", bbox.x - squareSize - padding) // 4px gap before label
        .attr("y", bbox.y + (bbox.height - squareSize) / 2) // vertically center
        .attr("width", squareSize)
        .attr("height", squareSize)
        .attr("fill", colorPalette[i] ?? "gray");
    });
}

/**
 * Creates and styles an x-axis for a D3 plot.
 * @param svgElement - The D3 selection of the SVG element.
 * @param y - The D3 scale for the x-axis.
 * @param innerWidth - The width of the inner plot area.
 * @param colorPalette - An array of colors for the tick labels.
 */
export function createYAxis(
  svgElement: d3.Selection<SVGGElement, unknown, null, undefined>,
  y: d3.ScaleBand<string>,
  innerWidth: number,
  colorPalette: string[]
): void {
  const yAxis = svgElement.append("g")
    .call(d3.axisLeft(y));

  yAxis.select(".domain").remove();

  yAxis.selectAll("text")
    .style("font-size", "14px")
    .style("font-family", "sans-serif")
    .style("font-weight", "bold");

  yAxis.selectAll(".tick")
    .each(function (d, i) {
      const tick = d3.select(this);
      const text = tick.select("text");

      const bbox = (text.node() as SVGTextElement).getBBox(); // get actual rendered size

      const squareSize = 16;
      const padding = 4;

      tick.insert("rect", "text")
        .attr("x", bbox.x - squareSize - padding) // 4px gap before label
        .attr("y", bbox.y + (bbox.height - squareSize) / 2) // vertically center
        .attr("width", squareSize)
        .attr("height", squareSize)
        .attr("fill", colorPalette[i] ?? "gray");
    });
}