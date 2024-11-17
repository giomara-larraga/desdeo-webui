<script lang="ts">
  import * as d3 from "d3";
  import { onMount } from "svelte";
  import {
    colorPalette,
    selectedLineStyle,
  } from "$lib/components/visual/constants";
  import { scale } from "svelte/transition";
  import type { Ranges } from "$lib/components/visual/types";
  import { compute_tradeoffs } from "$lib/api";

  export let values: number[][];
  //export let solutions: Solution[] = [];
  //export let lowerIsBetter: boolean[] = [];
  //export let showIndicators = false;
  export let ranges: Ranges[] | undefined = undefined;
  export let names: string[] = [];
  export let selectedIndices: number[] = [];
  /** The index of the highlighted value. */
  //export let highlightedIndex: number | undefined = undefined;

  //export let selectedIndices: (number | null)[] = []; // Allow null values
  export let referencePoint: number[] = [];
  export let preference: (number | undefined)[] = [undefined];
  export let showArrows: boolean = true;
  export let multipliers: number[][] = [[0.1, 0.5, 0.1, 0.2, 0.3]]; // Array representing the impact of each objective
  export let width = 850;
  export let height = 400;
  let selectedObjective: number = -1;
  let svg: SVGSVGElement;
  let tooltip: any; // Tooltip container

  export let to_impair: boolean[] | undefined = Array(
    referencePoint.length
  ).fill(false);
  export let to_improve: boolean[] | undefined = Array(
    referencePoint.length
  ).fill(false);

  export let show_explanations: boolean = false;

  function drawPlot() {
    if (!ranges || names.length === 0 || values.length === 0) return;

    //const width = 800;
    //const height = 600;

    const margin = { top: 40, right: 50, bottom: 20, left: 100 };
    const barWidth = (width - margin.left - margin.right) / names.length;
    const ticknessBar = 20;
    const positionMarker = ticknessBar / 2;
    //const legendPositionX = barWidth * (names.length - 1) + ticknessBar + 30;
    //const legendPositionY = 0;

    // Clear existing plot
    d3.select(svg).selectAll("*").remove();

    const svgElement = d3
      .select(svg)
      .attr("width", width)
      .attr("height", height)
      .append("g")
      .attr("transform", `translate(${margin.left}, ${margin.top})`);

    // Create a tooltip and hide it initially
    tooltip = d3
      .select("body")
      .append("div")
      .style("position", "absolute")
      .style("background", "white")
      .style("border", "1px solid #ddd")
      .style("padding", "8px")
      .style("display", "none")
      .attr("class", "tooltip");

    if (showArrows) {
      // Define the arrow marker
      svgElement
        .append("defs")
        .append("marker")
        .attr("id", "arrow-positive")
        .attr("viewBox", "0 0 10 10")
        .attr("refX", 6) // Position of the arrow tip
        .attr("refY", 5)
        .attr("markerWidth", 4)
        .attr("markerHeight", 4)
        .attr("orient", "auto-start-reverse")
        .append("path")
        .attr("d", "M 0 0 L 10 5 L 0 10 Z") // Arrow shape
        .attr("fill", "green"); // Arrow color

      svgElement
        .append("defs")
        .append("marker")
        .attr("id", "arrow-negative")
        .attr("viewBox", "0 0 10 10")
        .attr("refX", 6) // Position of the arrow tip
        .attr("refY", 5)
        .attr("markerWidth", 4)
        .attr("markerHeight", 4)
        .attr("orient", "auto-start-reverse")
        .append("path")
        .attr("d", "M 0 0 L 10 5 L 0 10 Z") // Arrow shape
        .attr("fill", "red"); // Arrow color
    }

    // Create scales for each axis
    const scales = names.map((_, i) =>
      d3
        .scaleLinear()
        .domain([ranges![i]!.min!, ranges![i]!.max!])
        .range([height - margin.top - margin.bottom, 0])
    );

    // Add name for each objective

    // Add y-axes and bars
    scales.forEach((scale, i) => {
      svgElement
        .append("g")
        .attr("transform", `translate(${i * barWidth}, 0)`)
        .call(d3.axisLeft(scale).ticks(10));

      // Draw vertical bar for each axis
      svgElement
        .append("rect")
        .attr("x", i * barWidth)
        .attr("width", ticknessBar)
        .attr("height", height - margin.top - margin.bottom)
        .attr("y", 0)
        .attr("fill", "#ddd");
      //.attr("stroke-width", 5)
      //.attr("stroke", colorPalette[i]);

      svgElement
        .append("g")
        .attr("transform", `translate(${i * barWidth}, 0)`)
        .call(d3.axisLeft(scale))
        .append("text")
        .style("text-anchor", "middle")
        .attr("y", -10)
        .text(names[i])
        .style("fill", "black");
    });

    if (selectedIndices[0] != null) {
      values[selectedIndices[0]].forEach((value, i) => {
        svgElement
          .append("rect")
          .attr("x", i * barWidth)
          .attr("width", ticknessBar)
          .attr(
            "height",
            height - margin.top - margin.bottom - scales[i](value)
          )
          .attr("y", function (d) {
            return scales[i](value);
          })
          .attr("fill", colorPalette[i]);

        /*svgElement
                      .append("rect")
                      .attr("x", i * barWidth)
                      .attr("width", ticknessBar)
                      .attr("height", Math.abs(scales[i](referencePoint[i]) - scales[i](value)))
                      .attr("y", value < referencePoint[i]?scales[i](referencePoint[i]):scales[i](value))
                      .attr("fill", value < referencePoint[i]?"red":"green")*/
      });
    }

    // Plot solutions' objective values as markers and lines
    for (let index = 0; index < values.length; index++) {
      //values.forEach((solution, solutionIndex) => {
      const line = d3
        .line<number>()
        .x((_, i) => i * barWidth + positionMarker)
        .y((_, i) => scales[i](values[index][i]));

      svgElement
        .append("path")
        .datum(values[index])
        .attr("d", line)
        .attr("fill", "none")
        .attr(
          "stroke",

          "#C5E3E6"
        )
        .attr("stroke-width", 1)
        .attr("class", "solution-line");

      // Add an invisible larger "click area" path over the line
      svgElement
        .append("path")
        .datum(values[index])
        .attr("d", line)
        .attr("fill", "none")
        .attr("stroke", "transparent") // Make the stroke invisible
        .attr("stroke-width", 10) // Increase stroke width to make it easier to click
        .attr("class", "clickable-line")
        .on("click", () => selectLine(index))
        .on("mouseover", function (event) {
          if (index == selectedIndices[0]) {
            showTooltipSolution(event, index); // Show the tooltip on hover'
          }
        })
        .on("mouseout", function (event) {
          if (index == selectedIndices[0]) {
            hideTooltip(event); // Show the tooltip on hover'
          }
        }); // Hide the tooltip on mouse out // Handle the click event

      // Plot circular markers
      values[index].forEach((value, i) => {
        svgElement
          .append("circle")
          .attr("cx", i * barWidth + positionMarker)
          .attr("cy", scales[i](value))
          .attr("r", 4)
          .attr(
            "fill",
            selectedIndices[0] === index
              ? "blue"
              : selectedIndices[0] === null
              ? "blue"
              : "#C5E3E6"
          )
          .attr("class", "solution-marker")
          .on("click", () => selectLine(index));
      });
      //});
    }

    // Plot reference point markers and lines
    const refLine = d3
      .line<number>()
      .x((_, i) => i * barWidth + positionMarker)
      .y((_, i) => scales[i](referencePoint[i]));

    svgElement
      .append("path")
      .datum(referencePoint)
      .attr("d", refLine)
      .attr("fill", "none")
      .attr("stroke", "black")
      .attr("stroke-width", 2);

    referencePoint.forEach((value, i) => {
      svgElement
        .append("circle")
        .attr("cx", i * barWidth + positionMarker)
        .attr("cy", scales[i](value))
        .attr("r", 5)
        .attr("fill", "black");
    });

    /*svgElement
      .append("circle")
      .attr("cx", legendPositionX)
      .attr("cy", 0)
      .attr("r", 6)
      .style("fill", "black");
    svgElement
      .append("circle")
      .attr("cx", legendPositionX)
      .attr("cy", 30)
      .attr("r", 6)
      .style("fill", "blue");
    svgElement
      .append("text")
      .attr("x", legendPositionX + 10)
      .attr("y", 0)
      .text("Reference point")
      .style("font-size", "12px")
      .attr("alignment-baseline", "middle");
    svgElement
      .append("text")
      .attr("x", legendPositionX + 10)
      .attr("y", 30)
      .text("Solution")
      .style("font-size", "12px")
      .attr("alignment-baseline", "middle");*/

    //Rewrite selected markers
    if (selectedIndices[0] !== null) {
      const line = d3
        .line<number>()
        .x((_, i) => i * barWidth + positionMarker)
        .y((_, i) => scales[i](values[selectedIndices[0]][i]));

      svgElement
        .append("path")
        .datum(values[selectedIndices[0]])
        .attr("d", line)
        .attr("fill", "none")
        .attr("stroke", "blue")
        .attr("stroke-width", 2)
        .attr("class", "solution-line");

      values[selectedIndices[0]].forEach((value, i) => {
        //const max_impact = d3.maxIndex(objectiveImpacts);
        svgElement
          .append("circle")
          .attr("cx", i * barWidth + positionMarker)
          .attr("cy", scales[i](value))
          .attr("r", 4)
          .attr("fill", "blue")
          .attr("stroke", "blue")
          .attr("stroke-width", 3)
          .attr("class", "solution-marker")
          .on("mouseover", function (event) {
            showTooltip(event, i); // Show the tooltip on hover
          })
          .on("mouseout", hideTooltip); // Hide the tooltip on mouse out
      });
    }

    /*if (selectedIndices[0] !== null) {
      svgElement
        .append("text")
        .attr("x", legendPositionX)
        .attr("y", 60)
        .text("Sensitivenes to changes in each objective")
        .style("font-size", "12px")
        .style("font-weight", "bold")
        .attr("alignment-baseline", "middle");

      // Calculate total impact for scaling
      const current_multipliers = multipliers[selectedIndices[0]].map(Math.abs);

      const totalImpact = d3.sum(current_multipliers);

      // Add the impact plot to the legend
      const impactBarWidth = 200; // Total width of the impact bar
      const impactBarHeight = 20; // Height of the impact bar
      let cumulativeWidth = 0; // Keep track of cumulative width to position each slot

      current_multipliers.forEach((impact, i) => {
        const impactProportion = impact / totalImpact;
        const slotWidth = impactProportion * impactBarWidth; // Calculate width based on proportion

        // Add a colored rectangle for each objective's impact
        svgElement
          .append("rect")
          .attr("x", legendPositionX + cumulativeWidth) // Start after the previous slot
          .attr("y", 80)
          .attr("width", slotWidth)
          .attr("height", impactBarHeight)
          .attr("fill", colorPalette[i]); // Color for each objective

        cumulativeWidth += slotWidth; // Update the cumulative width for the next slot
      });

      const maxImpactIndex = current_multipliers.indexOf(
        Math.max(...current_multipliers)
      );
      const mostInfluentialObjectiveName = names[maxImpactIndex];
      const mostInfluentialObjectiveColor = colorPalette[maxImpactIndex];

      // Add the dynamic legend text
      svgElement
        .append("text")
        .attr("x", legendPositionX)
        .attr("y", 150) // Position the text element
        .style("fill", "black")
        .style("font-size", "12px")
        .append("tspan")
        .text("The selected solution is most sensitive ")
        .attr("x", legendPositionX) // Keep the x position the same for alignment
        .attr("dy", 0) // First line
        .append("tspan")
        .attr("x", legendPositionX)
        .attr("dy", "1.2em")
        .text("to changes in Objective ")
        .append("tspan")
        //.attr("x", legendPositionX) // Same x to align with the previous line
        //.attr("dy", "1.2em") // Offset vertically to create a line break
        .text(mostInfluentialObjectiveName)
        .style("fill", mostInfluentialObjectiveColor) // Color for the most influential objective
        .style("font-weight", "bold");
      //.append("tspan")
      //.text(" has the most influence in the selected solution")
      //.style("fill", "black");
    }*/
    // If a line is selected, draw dashed line connecting to reference point
    if (selectedIndices[0] !== null && showArrows) {
      const selectedSolution = values[selectedIndices[0]];

      selectedSolution.forEach((value, i) => {
        svgElement
          .append("line")
          .attr("x1", i * barWidth + positionMarker)
          .attr("y1", scales[i](referencePoint[i]))
          .attr("x2", i * barWidth + positionMarker)
          .attr(
            "y2",
            value < referencePoint[i]
              ? scales[i](value) - 10
              : scales[i](value) + 10
          )
          .attr("stroke", value < referencePoint[i] ? "red" : "green")
          .attr("stroke-width", 2.5)
          .attr("stroke-dasharray", "6,2")
          .attr(
            "marker-end",
            value < referencePoint[i]
              ? "url(#arrow-negative)"
              : "url(#arrow-positive)"
          ); // Attach arrow marker at the end;
      });
    }
  }
  // Line selection function
  function selectLine(index: number) {
    // Set selected index and force reactivity by reassigning the array
    selectedIndices = [index]; // Toggle selection
    let objectiveImpacts: number[] = [];
    selectedIndices[0] !== null
      ? (objectiveImpacts = multipliers[selectedIndices[0]])
      : (objectiveImpacts = [0, 0, 0, 0]);
    selectedObjective = d3.maxIndex(objectiveImpacts);
    drawPlot();
  }

  function showTooltipSolution(event: any, solutionIndex: number) {
    const solution = values[selectedIndices[0]];
    const current_multipliers = multipliers[selectedIndices[0]].map(Math.abs);
    const totalImpact = d3.sum(current_multipliers);

    const impactBarWidth = 200; // Total width of the impact bar
    const impactBarHeight = 20; // Height of the impact bar
    let cumulativeWidth = 0; // Keep track of cumulative width to position each slot

    const chartWidth = impactBarWidth + 20;
    const chartHeight = impactBarHeight + 100;

    const tooltip = d3
      .select(".tooltip")
      .style("display", "block")
      .style("width", chartWidth + 5)
      .style("word-wrap", "break-word")
      .style("left", event.pageX + 5 + "px")
      .style("top", event.pageY - 50 + "px")
      .style("pointer-events", "auto");

    // Clear existing content
    tooltip.html("");

    // Add explanatory text
    tooltip
      .append("div")
      .style("font-weight", "bold")
      .text("Sensitivenes to changes in each objective");

    const svg = tooltip
      .append("svg")
      .attr("width", chartWidth)
      .attr("height", chartHeight);

    // Add the impact plot to the tooltip

    current_multipliers.forEach((impact, i) => {
      const impactProportion = impact / totalImpact;
      const slotWidth = impactProportion * impactBarWidth; // Calculate width based on proportion

      // Add a colored rectangle for each objective's impact
      svg
        .append("rect")
        .attr("x", cumulativeWidth) // Start after the previous slot
        .attr("y", 5)
        .attr("width", slotWidth)
        .attr("height", impactBarHeight)
        .attr("fill", colorPalette[i]); // Color for each objective

      cumulativeWidth += slotWidth; // Update the cumulative width for the next slot
    });

    const maxImpactIndex = current_multipliers.indexOf(
      Math.max(...current_multipliers)
    );
    const mostInfluentialObjectiveName = names[maxImpactIndex];
    const mostInfluentialObjectiveColor = colorPalette[maxImpactIndex];

    // Add the dynamic legend text
    svg
      .append("text")
      .attr("x", 0)
      .attr("y", 40) // Position the text element
      .style("fill", "black")
      .style("font-size", "12px")
      .append("tspan")
      .text("This solution is most sensitive ")
      .attr("x", 5) // Keep the x position the same for alignment
      .attr("dy", 0) // First line
      .append("tspan")
      .attr("x", 5)
      .attr("dy", "1.2em")
      .text("to changes in ")
      .append("tspan")
      //.attr("x", legendPositionX) // Same x to align with the previous line
      //.attr("dy", "1.2em") // Offset vertically to create a line break
      .text(mostInfluentialObjectiveName)
      .style("fill", mostInfluentialObjectiveColor) // Color for the most influential objective
      .style("font-weight", "bold");
    //.append("tspan")
    //.text(" has the most influence in the selected solution")
    //.style("fill", "black");
  }

  // Function to display the tooltip
  function showTooltip(event: any, solutionIndex: number) {
    const solution = values[selectedIndices[0]];
    const current_multipliers = multipliers[selectedIndices[0]].map(Math.abs);
    const tradeoffs = compute_tradeoffs(solution, current_multipliers, ranges);

    let selected_tradeoffs = [];
    for (let index = 0; index < tradeoffs.length; index++) {
      selected_tradeoffs.push(Math.abs(tradeoffs[index][solutionIndex]));
    }
    console.log(selected_tradeoffs);
    const significant_values = getSignificantIndices(selected_tradeoffs);
    console.log(significant_values);
    to_impair = Array(referencePoint.length).fill(false);
    to_improve = Array(referencePoint.length).fill(false);
    significant_values.forEach((index) => {
      to_impair![index] = true;
    });
    to_improve[selectedIndices[0]] = true;

    console.log(to_impair);
    // Tooltip container setup
    const tooltip = d3
      .select(".tooltip")
      .style("display", "block")
      .style("width", "230px")
      .style("word-wrap", "break-word")
      .style("left", event.pageX + 5 + "px")
      .style("top", event.pageY - 50 + "px")
      .style("pointer-events", "auto");

    // Clear existing content
    tooltip.html("");

    // Add explanatory text
    tooltip
      .append("div")
      .style("font-weight", "bold")
      .text(
        "Impairing effects of the rest of the objectives on the value of " +
          names[solutionIndex]
      );

    // Set up SVG for the bar chart
    const chartWidth = 150;
    const chartHeight = 100;
    const barPadding = 5;

    const maxTradeoffValue = d3.max(selected_tradeoffs) || 0; // Avoid undefined
    const barScale = d3
      .scaleLinear()
      .domain([0, maxTradeoffValue])
      .range([0, chartHeight]);

    const svg = tooltip
      .append("svg")
      .attr("width", chartWidth)
      .attr("height", chartHeight);

    // Bind data to the bars and update
    svg
      .selectAll("rect")
      .data(selected_tradeoffs)
      .join("rect") // Ensure proper enter/update/exit cycle
      .attr("x", (_, i) => i * (chartWidth / solution.length))
      .attr("y", (d) => chartHeight - barScale(d)) // Calculate y position
      .attr("width", chartWidth / solution.length - barPadding)
      .attr("height", (d) => barScale(d)) // Scale height
      .attr("fill", (_, i) => colorPalette[i]);

    // Add a button
    tooltip
      .append("button")
      .attr("class", "btn variant-filled inline")
      .text("How to improve this value?")
      .style("margin-top", "10px")
      .on("click", () => {
        //alert("Action taken for " + names[solutionIndex]);
        preference = values[selectedIndices[0]];
        show_explanations = true;
      });

    // Add secondary explanatory text
    /*tooltip
      .append("div")
      .text(
        "To improve this value, impair the objectives that affect it the most"
      );*/

    // Add event listener to keep tooltip open when mouse enters the tooltip area
    tooltip
      .on("mouseover", () => {
        tooltip.style("display", "block"); // Prevent hiding on mouseover
      })
      .on("mouseout", (event) => {
        // Only hide if mouse leaves the tooltip
        //const isInsideTooltip = tooltip?.node()?.contains(event.relatedTarget);

        tooltip.style("display", "none");
      });
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

  // Function to hide the tooltip
  function hideTooltip(event: any) {
    const tooltip = d3.select(".tooltip");

    // Check if the mouse event target is inside the tooltip
    //const isInsideTooltip = tooltip.node().contains(event.target);

    const tooltipNode = tooltip.node();
    const target = event.target;
    let isInsideTooltip = undefined;
    if (tooltipNode instanceof HTMLElement && target instanceof HTMLElement) {
      isInsideTooltip = tooltipNode.contains(target);
    } else {
      // Handle the case where tooltipNode or target is not a valid HTMLElement
    }

    // Only hide if the mouse leaves the tooltip and its child elements (like the button)
    if (!isInsideTooltip) {
      tooltip.style("display", "none");
    }
  }

  // Redraw plot if input data or selection changes
  $: if (values.length > 0 || ranges || names.length > 0 || selectedIndices) {
    drawPlot(); // Redraw whenever any input changes
  }

  onMount(() => {
    drawPlot(); // Initial plot drawing
  });
</script>

<svg bind:this={svg} />
