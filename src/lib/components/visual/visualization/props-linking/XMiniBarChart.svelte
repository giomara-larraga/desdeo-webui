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

  import type { Ranges } from "$lib/components/visual/types";
  import { compute_tradeoffs } from "$lib/api";

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
  let objective_to_improve: number = -1;
  let tolerance = 0.009

  /**
   * An array of boolean values indicating whether lower values are better for
   * each data point (In MOO if the objective is to be minimized or maximized).
   */
  export let lowerIsBetter: boolean[] | undefined = undefined;

  export let to_impair: boolean[] = Array(referencePoint.length).fill(false);
  export let to_improve: boolean[] = Array(referencePoint.length).fill(false);

  export let show_explanations: boolean = false;

  const tradeoffs = compute_tradeoffs(values, multipliers, ranges);

  const totalImpact = d3.sum(multipliers);

  const impactBarHeight = 20; // Height of the impact bar

  let selected_tradeoffs: number[] = [];

  let width = 300;
  let height = 200;

  let svg: SVGSVGElement;

  if (colors === undefined || colors.length === 0) {
    colors = colorPalette;
  }

  function showTooltip(event: any, content: string) {
    // Tooltip container setup
    const tooltip = d3
      .select(".tooltip")
      .style("display", "block")
      .style("word-wrap", "break-word")
      .style("left", event.pageX +5 + "px")
      .style("top", event.pageY+5 + "px")
      .style("pointer-events", "auto");

    // Clear existing content
    tooltip.html("");

    // Add explanatory text
    tooltip
      .append("div")
      .text(content);
  }

  function hideTooltip(event: any) {
    const tooltip = d3.select(".tooltip");    
    tooltip.style("display", "none");
  }

  function getSignificantIndices(arr: number[]): number[] {
    const sortedIndices = arr
      .map((val, idx) => ({ val, idx }))
      .sort((a, b) => b.val - a.val);

    const significant = [];
    for (let i = 0; i < sortedIndices.length - 1; i++) {
      const diff = sortedIndices[i].val / sortedIndices[i + 1].val;
      if (diff > 2) significant.push(sortedIndices[i].idx); // Adjust "2" as a significance ratio
    }

    return significant;
  }
  function handleSelectButton(index: number) {
    if (isSelected) {
      if (to_improve[index]) {
        to_improve[index] = false;
        objective_to_improve = -1;
        selected_tradeoffs = [];
      } else {
        to_impair = Array(referencePoint.length).fill(false);
        to_improve = Array(referencePoint.length).fill(false);
        selected_tradeoffs = [];
        for (
          let index_tradeoff = 0;
          index_tradeoff < tradeoffs.length;
          index_tradeoff++
        ) {
          selected_tradeoffs.push(Math.abs(tradeoffs[index_tradeoff][index]));
        }
        const significant_values = getSignificantIndices(selected_tradeoffs);
        significant_values.forEach((index) => {
          to_impair![index] = true;
        });
        to_improve[index] = true;
        objective_to_improve = index;
        show_explanations = true;
      }
    } else {
      objective_to_improve = -1;
      show_explanations = false;
    }
    //drawPlot();
  }
  function drawPlot() {
    if (names.length === 0 || values.length === 0) return;

    const margin = { top: 10, right: 30, bottom: 50, left: 10 };
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

    referencePoint.forEach((value, i) => {
      const normalizedValue =
        (value - lowerBounds[i]) / (upperBounds[i] - lowerBounds[i]);

      svgElement
        .append("circle")
        .attr("cy", i * barHeight + barHeight / 2 + 8)
        .attr("cx", xScale(normalizedValue))
        .attr("r", 6)
        .attr("fill", "black")
        .attr("fill-opacity", 0.5); // Adjust transparency (0.5 = 50% transparent)

    });

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
      /*svgElement
        .append("text")
        .attr("x", margin.left - 10)
        .attr("y", i * barHeight + barHeight / 2 + margin.top)
        .attr("dy", "0.35em")
        .attr("text-anchor", "end")
        .text(names[i] || `Obj ${i + 1}`);*/

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
        const difference_with_upperbound = Math.abs(upperBounds[i] - value);
        const can_be_improved = difference_with_upperbound > tolerance? true: false;
        const button = svgElement
          .append("circle")
          .attr("cx", width - margin.right + 20) // Position outside the border
          .attr("cy", i * barHeight + barHeight / 2 + margin.top)
          .attr("r", 10)
          .attr("fill", to_improve[i] && isSelected ? "#000" : "#ccc")
          .attr("stroke", "#000")
          .attr("stroke-width", 1)
          .style("cursor", "pointer")
          .on("click", () => handleSelectButton(i))
          .on("mouseover", function (event) {showTooltip(event,can_be_improved?"How to improve this value?":"This is the best value for this objective and cannot be improved more.")})
          .on("mousemove", function (event) {showTooltip(event,can_be_improved?"How to improve this value?":"This is the best value for this objective and cannot be improved more")})
          .on("mouseout", function (event) {hideTooltip(event)});

        // Add arrow icon to the button
        svgElement
          .append("text")
          .attr("x", width - margin.right + 20)
          .attr("y", i * barHeight + barHeight / 2 + margin.top)
          .attr("dy", "0.35em")
          .attr("text-anchor", "middle")
          .attr("fill", to_improve[i] && isSelected ? "#fff" : "#000")
          .text(can_be_improved?"↗":"✓") // Example icon, can be replaced
          .on("click", can_be_improved? () => handleSelectButton(i):()=> null)
          .on("mouseover", function (event) {showTooltip(event,can_be_improved?"How to improve this value?":"This is the best value for this objective and cannot be improved more.")})
          .on("mousemove", function (event) {showTooltip(event,can_be_improved?"How to improve this value?":"This is the best value for this objective and cannot be improved more")})
          .on("mouseout", function (event) {hideTooltip(event)});

        if (objective_to_improve == i) {
          svgElement
            .append("text")
            .attr("x", xScale(normalizedValue))
            .attr("y", margin.top + i * barHeight + barHeight / 2 + 5 )
            .attr("fill", "blue")
            .attr("fill-opacity", 0.7) 
            .text("►")
            .style("font-size", 18);
          to_impair.forEach((value, j) => {
            if (value && j!=objective_to_improve) {
              const difference_with_lowerbound = Math.abs(lowerBounds[j] - values[j]);
              const can_be_impaired = difference_with_lowerbound > tolerance? true: false;
              const normalizedValue_j = (values[j] - lowerBounds[j]) / (upperBounds[j] - lowerBounds[j]);
              if (can_be_impaired){
              svgElement
                .append("text")
                .attr("x", xScale(normalizedValue_j)-16)
                .attr("y", margin.top + j * barHeight + barHeight / 2 +5)
                .attr("fill", "#C00000")
                .attr("fill-opacity", 0.7) 
                .text("◄")
                .style("font-size", 18);
              }

            }
          });
        }

      }


      
    });



    svgElement
      .append("rect")
      .attr("x", margin.left)
      .attr("y", height - margin.bottom + 5)
      .attr("width", width - margin.left - margin.right)
      .attr("height", impactBarHeight)
      .attr("fill", "#fff")
      .attr("stroke", "#000");

    let impactBarWidth = width - margin.left - margin.right;
    let cumulativeWidth = margin.left; // Keep track of cumulative width to position each slot

    multipliers.forEach((impact, idx_mult) => {
      console.log(impact);
      let impactProportion = impact / totalImpact;
      let slotWidth = impactProportion * impactBarWidth; // Calculate width based on proportion
      console.log(slotWidth);

      // Add a colored rectangle for each objective's impact
      svgElement
        .append("rect")
        .attr("x", cumulativeWidth) // Start after the previous slot
        .attr("y", height - margin.bottom + 5)
        .attr("width", slotWidth)
        .attr("height", impactBarHeight)
        .attr("fill", colorPalette[idx_mult]); // Color for each objective

      cumulativeWidth += slotWidth; // Update the cumulative width for the next slot
    });

    svgElement
      .append("text")
      .attr("x", margin.left)
      .attr("y", height - margin.bottom + 5 + impactBarHeight + 14)
      .text("Contribution of each objective");
  }
  // Redraw plot if input data or selection changes
  $: if (isSelected || objective_to_improve != undefined) {
    drawPlot(); // Redraw whenever any input changes
  }

  $: if (isSelected) {
    objective_to_improve = -1;
    show_explanations = false;
  }
  onMount(() => {
    show_explanations = false;
    //to_impair = Array(referencePoint.length).fill(false);
    //to_improve = Array(referencePoint.length).fill(false);
    objective_to_improve = -1;
    drawPlot(); // Initial plot drawing
  });
</script>

<svg bind:this={svg} />
