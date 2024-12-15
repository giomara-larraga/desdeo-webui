<!--@component
    @description Makes a mini bar chart, which looks like NIMBUS classification component using the ECharts library.
-->
<script lang="ts">
  import * as d3 from "d3";
  import { onMount } from "svelte";
  import {
    colorPalette,
    selectedLineStyle,
  } from "$lib/components/visual/constants";
  import PuzzlePiece from "~icons/heroicons/puzzle-piece";

  import type { Ranges } from "$lib/components/visual/types";

  /** The colors to use for the chart. */
  export let colors: string[] = [];

  /** The values to use for the chart. */
  export let values: number[];
  export let ranges: Ranges[] | undefined = undefined;
  export let names: string[] = [];
  export let referencePoint: number[] = [];
  export let multipliers: number[] = [0.1, 0.5, 0.1, 0.2, 0.3]; // Array representing the impact of each objective

  /** The lower bounds for each objective */
  export let lowerBounds: number[] = [];

  /** The upper bounds for each objective */
  export let upperBounds: number[] = [];

  export let isSelected: boolean = false;

  /**
   * The aspect ratio as a tailwind class for the div container, which contains
   * the chart.
   *
   * @example
   *   aspect - [5 / 3];
   */
  export let aspect: string | undefined = "1";

  /**
   * An array of boolean values indicating whether lower values are better for
   * each data point (In MOO if the objective is to be minimized or maximized).
   */
  export let lowerIsBetter: boolean[] | undefined = undefined;

  export let to_impair: boolean[] = Array(referencePoint.length).fill(false);
  export let to_improve: boolean[] = Array(referencePoint.length).fill(false);

  export let show_explanations: boolean = false;

  let width = 350;
  let height = 200;

  let svg: SVGSVGElement;

  if (colors === undefined || colors.length === 0) {
    colors = colorPalette;
  }

  function handleSelectButton(index: number) {
    if (isSelected) {
      if (to_improve[index]) {
        to_improve[index] = false;
      } else {
        to_impair = Array(referencePoint.length).fill(false);
        to_improve = Array(referencePoint.length).fill(false);

        to_improve[index] = true;
        //show_explanations = true;
      }
    }
  }
  function drawPlot() {
    if (names.length === 0 || values.length === 0) return;

    const margin = { top: 10, right: 30, bottom: 10, left: 100 };
    const barHeight = (height - margin.top - margin.bottom) / names.length;
    //const ticknessBar = 20;
    //const positionMarker = ticknessBar / 2;

    console.log("draw");
    // Clear existing plot
    d3.select(svg).selectAll("*").remove();

    const svgElement = d3
      .select(svg)
      .attr("width", width)
      .attr("height", height);

    // Add a border around the bar group
    svgElement
      .append("rect")
      .attr("x", margin.left)
      .attr("y", margin.top)
      .attr("width", width - margin.left - margin.right)
      .attr("height", height - margin.top - margin.bottom)
      .attr("fill", "#fff")
      .attr("stroke", "#000");

    // Scale to map values to [0, 1]
    const xScale = d3
      .scaleLinear()
      .domain([0, 1])
      .range([margin.left, width - margin.right]);

    // Group for bars
    const barGroup = svgElement
      .append("g")
      .attr("transform", `translate(0, ${margin.top})`);

    // Add name for each objective

    // Add x-axes and bars
    values.forEach((value, i) => {
      const normalizedValue =
        (value - lowerBounds[i]) / (upperBounds[i] - lowerBounds[i]);
      const isLowerBetter = lowerIsBetter ? lowerIsBetter[i] : true;

      // Define colors for the two segments of the bar
      const lowerColor = isLowerBetter ? colors[i] : "#ffffff00";
      const upperColor = isLowerBetter ? "#ffffff00" : colors[i];

      // Add the lower part of the bar
      barGroup
        .append("rect")
        .attr("x", xScale(0))
        .attr("y", i * barHeight)
        .attr("width", xScale(normalizedValue) - xScale(0))
        .attr("height", barHeight - 2) // Adding spacing between bars
        .attr("fill", lowerColor);

      // Add the upper part of the bar
      barGroup
        .append("rect")
        .attr("x", xScale(normalizedValue))
        .attr("y", i * barHeight)
        .attr("width", xScale(1) - xScale(normalizedValue))
        .attr("height", barHeight - 2)
        .attr("fill", upperColor);

      // Add a label with the bar's name on the y-axis
      svgElement
        .append("text")
        .attr("x", margin.left - 10)
        .attr("y", i * barHeight + barHeight / 2 + margin.top)
        .attr("dy", "0.35em")
        .attr("text-anchor", "end")
        .text(names[i] || `Obj ${i + 1}`);

      // Add a label with the numerical value inside the bar
      const labelX = xScale(normalizedValue) - 5;
      const adjustedLabelX = Math.max(
        margin.left + 12,
        Math.min(labelX, width - margin.right)
      );

      barGroup
        .append("text")
        .attr("x", adjustedLabelX)
        .attr("y", i * barHeight + barHeight / 2)
        .attr("dy", "0.35em")
        .attr("text-anchor", labelX === adjustedLabelX ? "end" : "middle")
        .attr("fill", "#000")
        .text(value.toFixed(2));

      // Add a button on the right side of the bar
      if (isSelected) {
        const button = svgElement
          .append("circle")
          .attr("cx", width - margin.right + 20) // Position outside the border
          .attr("cy", i * barHeight + barHeight / 2 + margin.top)
          .attr("r", 10)
          .attr("fill", to_improve[i] && isSelected ? "#000" : "#ccc")
          .attr("stroke", "#000")
          .attr("stroke-width", 1)
          .style("cursor", "pointer")
          .on("click", () => handleSelectButton(i));
        // Add a zigzag arrow icon to the button
        // Add a zigzag arrow icon to the button
        svgElement
          .append("text")
          .attr("x", width - margin.right + 20)
          .attr("y", i * barHeight + barHeight / 2 + margin.top)
          .attr("dy", "0.35em")
          .attr("text-anchor", "middle")
          .attr("fill", to_improve[i] && isSelected ? "#fff" : "#000")
          .text("↗") // Example icon, can be replaced
          .on("click", () => handleSelectButton(i));
      }
    });

    referencePoint.forEach((value, i) => {
      const normalizedValue =
        (value - lowerBounds[i]) / (upperBounds[i] - lowerBounds[i]);

      svgElement
        .append("circle")
        .attr("cy", i * barHeight + barHeight / 2 + 8)
        .attr("cx", xScale(normalizedValue))
        .attr("r", 6)
        .attr("fill", "black");
    });
  }
  // Redraw plot if input data or selection changes
  $: if (values.length > 0 || names.length > 0) {
    drawPlot(); // Redraw whenever any input changes
  }

  onMount(() => {
    to_impair = Array(referencePoint.length).fill(false);
    to_improve = Array(referencePoint.length).fill(false);
    drawPlot(); // Initial plot drawing
  });
</script>

<svg bind:this={svg} />
