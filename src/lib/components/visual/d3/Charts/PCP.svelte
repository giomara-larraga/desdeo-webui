<!--@component
  Creates a parallel axis chart using the ECharts library.
  
  @param {number[][]} values - The values for each axis. Outside arrays are the lines and inside arrays are the values of the line.
  @param {boolean[]} [lowerIsBetter=[]] - An array of boolean values that indicate whether each axis should be minimized.
  @param {boolean} [showIndicators=false] - A boolean value that indicates whether to show the min/max indicators on the chart.
  @param {Ranges[]} [ranges=undefined] - An array of Ranges -objects that define the ranges for each axis.
  @param {string[]} [names=[]] - An array of strings that define the names of each axis.
  @param {number[]} [selectedIndices=[]] - An array of indices that define the selected data points (lines) on the chart.
  @param {number} [highlightedIndex=undefined] - An index of the highlighted data point (line) on the chart.
  @param {boolean} [disableInteraction=false] - A boolean value that indicates whether the user can interact with the chart.
  @param {Ranges} [brushInterval=undefined] - A Ranges -object that defines the latest brush interval. 
  @param {Ranges[]} [BrushIntervalPerAxis=[]] - An array of Ranges -objects that define the brush interval for each axis. 
  @param {EChartOption} [newOptions=undefined] - An EChartOption -object that defines the new options for the parallel coordinate plot.
  @param {number} [maxSelections=undefined] - The maximum number of selections allowed.
  @param {string[]} [colors=[]] - An array of strings that define the colors to use for the chart.
  @param {boolean} [disableAnimation=undefined] - A boolean value that indicates whether to disable animation for the chart.
  @param {string} [aspect="aspect-[5/3]"] - The aspect ratio of the chart container.
  @param {string} [customStyle=undefined] - Custom CSS styles to apply to the chart container.
  @param {EChartsType} [chart=undefined] - The ECharts instance of the chart.

-->
<!-- TODO: min/max text should show also when names given manually -->

<script lang="ts">
  import * as d3 from "d3";
  import { onMount } from "svelte";

  import {
    colorPalette,
    selectedLineStyle,
  } from "$lib/components/visual/constants";

  // Props for this component:
  /** The values to display on the plot. */
  export let solutions: Solution[] = [];

  /** Whether a lower value is better for each axis. */
  export let lowerIsBetter: boolean[] = [];

  /** The names for each axis. */
  export let names: string[];

  /** The indices of the selected values. */
  export let selectedIndices: number[] = [];

  /** The lower bounds for each objective */
  export let lowerBounds: number[] = [];

  /** The upper bounds for each objective */
  export let upperBounds: number[] = [];
  /** The index of the highlighted value. */
  export let highlightedIndex: number | undefined = undefined;

  /** The colors to use for the plot. */
  export let colors: string[] = [colorPalette[0]];

  let svg: SVGSVGElement;
  let margin = { top: 30, right: 50, bottom: 30, left: 50 };
  let width = 800 - margin.left - margin.right;
  let height = 400 - margin.top - margin.bottom;
  // Scales for axes
  let xScale: d3.ScalePoint<string>;
  let yScales: d3.ScaleLinear<number, number>[];
  let selectedPath: d3.Selection<
    SVGPathElement,
    any,
    SVGGElement,
    undefined
  > | null = null;

  onMount(() => {
    generateChart();
  });

  // Reactive statement to update the chart when `values`, `names`, or `ranges` change
  $: {
    if (svg && solutions.length > 0 && names.length > 0) {
      generateChart();
    }
  }
  /** Initialize the parallel coordinates chart. */
  function generateChart() {
    const container = d3.select(svg);
    container.selectAll("*").remove(); // Clear previous content

    const g = container
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    xScale = d3.scalePoint().domain(names).range([0, width]);

    // Set y scales based on provided ranges or dynamically calculate them.
    yScales = names.map((_, i) =>
      d3
        .scaleLinear()
        .domain([lowerBounds[i], upperBounds[i]])
        .range([height, 0])
    );

    // Draw the lines for the solutions
    solutions.forEach((d, i) => {
      const path = g
        .append("path")
        .datum(d.objective_values)
        .attr("d", lineGenerator(i))
        .attr("fill", "none")
        .attr("stroke", colors[i % colors.length])
        .attr("stroke-width", i === highlightedIndex ? 2 : 1)
        .attr("data-index", i); // Store the index as a custom attribute

      // Append a second, invisible path for easier clicking
      const hitArea = g
        .append("path")
        .datum(d.objective_values)
        .attr("d", lineGenerator(i))
        .attr("fill", "none")
        .attr("stroke", "transparent") // Invisible stroke
        .attr("stroke-width", 10) // Larger stroke width for the clickable area
        .on("click", function (event, data) {
          // Deselect the previously selected path if it exists
          if (selectedPath) {
            const prevIndex = selectedPath.attr("data-index");
            selectedPath
              .attr("stroke-width", 1) // Reset almost default stroke-width
              .attr("stroke", colors[prevIndex % colors.length]); // Reset to original color
          }

          // Select the newly clicked path
          selectedPath = path;

          // Apply highlight to the selected path
          selectedPath
            .attr("stroke", "#094277") // Highlight the stroke color
            .attr("stroke-width", 3); // Increase stroke width to highlight

          console.log("Path clicked:", i, data);
        });
    });

    // Draw lines for reference points
    solutions.forEach((d, i) => {
      const path = g
        .append("path")
        .datum(d.reference_point)
        .attr("d", lineGenerator(i))
        .attr("fill", "none")
        .attr("stroke", "#C00000")
        .attr("stroke-width", i === highlightedIndex ? 4 : 2);
    });

    // Draw the axes
    names.forEach((name, i) => {
      const axisGroup = g
        .append("g")
        .attr("transform", `translate(${xScale(name)}, 0)`);
      const axis = d3.axisLeft(yScales[i]);
      axisGroup.call(axis);
      axisGroup
        .append("text")
        .style("text-anchor", "middle")
        .attr("y", -10)
        .text((name += lowerIsBetter[i] ? "\n (min)" : "\n (max)"))
        .style("fill", "black");
    });
  }

  /** Generates the line path for each series. */
  function lineGenerator(i: number) {
    return d3
      .line<number>()
      .x((_: any, j: number) => xScale(names[j]) as number)
      .y((d: any, j: number) => yScales[j](d) as number);
  }
</script>

<svg bind:this={svg} />
