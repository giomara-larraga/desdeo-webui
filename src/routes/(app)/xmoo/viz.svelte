<script lang="ts">
  import * as d3 from "d3";
  import { onMount } from "svelte";
  import {
    colorPalette,
    selectedLineStyle,
  } from "$lib/components/visual/constants";
  import { scale } from "svelte/transition";

  export let solutions: Solution[] = [];
  export let lowerIsBetter: boolean[] = [];
  export let showIndicators = false;
  export let ranges: Ranges[] | undefined = undefined;
  export let names: string[] = [];
  export let selectedIndices: (number | null)[] = []; // Allow null values
  export let referencePoint: number[] = [];
  export let showArrows: boolean = false;
  export let objectiveImpacts: number[] = [0.1, 0.5, 0.1, 0.2, 0.3]; // Array representing the impact of each objective
  let selectedObjective: number = -1;
  let svg: SVGSVGElement;
  let tooltip: any; // Tooltip container

  function drawPlot() {
    if (!ranges || names.length === 0 || solutions.length === 0) return;

    const width = 800;
    const height = 400;
    const margin = { top: 20, right: 250, bottom: 20, left: 30 };
    const barWidth = (width - margin.left - margin.right) / names.length;
    const ticknessBar = 20;
    const positionMarker = ticknessBar / 2;
    const legendPositionX = barWidth * (names.length - 1) + ticknessBar + 30;
    const legendPositionY = 0;

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
        .domain([ranges[i].min, ranges[i].max])
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
      solutions[selectedIndices[0]].objective_values.forEach((value, i) => {
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
    solutions.forEach((solution, solutionIndex) => {
      const line = d3
        .line<number>()
        .x((_, i) => i * barWidth + positionMarker)
        .y((_, i) => scales[i](solution.objective_values[i]));

      svgElement
        .append("path")
        .datum(solution.objective_values)
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
        .datum(solution.objective_values)
        .attr("d", line)
        .attr("fill", "none")
        .attr("stroke", "transparent") // Make the stroke invisible
        .attr("stroke-width", 10) // Increase stroke width to make it easier to click
        .attr("class", "clickable-line")
        .on("click", () => selectLine(solutionIndex)); // Handle the click event

      // Plot circular markers
      solution.objective_values.forEach((value, i) => {
        svgElement
          .append("circle")
          .attr("cx", i * barWidth + positionMarker)
          .attr("cy", scales[i](value))
          .attr("r", 4)
          .attr(
            "fill",
            selectedIndices[0] === solutionIndex
              ? "blue"
              : selectedIndices[0] === null
              ? "blue"
              : "#C5E3E6"
          )
          .attr("class", "solution-marker")
          .on("click", () => selectLine(solutionIndex));
      });
    });

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

    svgElement
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
      .attr("alignment-baseline", "middle");

    //Rewrite selected markers
    if (selectedIndices[0] !== null) {
      const line = d3
        .line<number>()
        .x((_, i) => i * barWidth + positionMarker)
        .y((_, i) =>
          scales[i](solutions[selectedIndices[0]].objective_values[i])
        );

      svgElement
        .append("path")
        .datum(solutions[selectedIndices[0]].objective_values)
        .attr("d", line)
        .attr("fill", "none")
        .attr("stroke", "blue")
        .attr("stroke-width", 2)
        .attr("class", "solution-line");

      solutions[selectedIndices[0]].objective_values.forEach((value, i) => {
        //const max_impact = d3.maxIndex(objectiveImpacts);
        svgElement
          .append("circle")
          .attr("cx", i * barWidth + positionMarker)
          .attr("cy", scales[i](value))
          .attr("r", 4)
          .attr("fill", "blue")
          .attr("stroke", i === selectedObjective ? "red" : "blue")
          .attr("stroke-width", 3)
          .attr("class", "solution-marker")
          .on("click", () => selectMarker(i))
          .on("mouseover", function (event) {
            showTooltip(event, i); // Show the tooltip on hover
          })
          .on("mouseout", hideTooltip); // Hide the tooltip on mouse out
      });
    }

    if (selectedIndices[0] !== null) {
      svgElement
        .append("text")
        .attr("x", legendPositionX)
        .attr("y", 60)
        .text("Impact overview")
        .style("font-size", "12px")
        .style("font-weight", "bold")
        .attr("alignment-baseline", "middle");

      // Calculate total impact for scaling
      const totalImpact = d3.sum(objectiveImpacts);

      // Add the impact plot to the legend
      const impactBarWidth = 100; // Total width of the impact bar
      const impactBarHeight = 20; // Height of the impact bar
      let cumulativeWidth = 0; // Keep track of cumulative width to position each slot

      objectiveImpacts.forEach((impact, i) => {
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

      const maxImpactIndex = objectiveImpacts.indexOf(
        Math.max(...objectiveImpacts)
      );
      const mostInfluentialObjectiveName = names[maxImpactIndex];
      const mostInfluentialObjectiveColor = colorPalette[maxImpactIndex];

      // Add the dynamic legend text
      svgElement
        .append("text")
        .attr("x", legendPositionX)
        .attr("y", 150) // Below the impact plot
        .text("Objective ")
        .style("fill", "black")
        .style("font-size", "12px")
        .append("tspan")
        .text(mostInfluentialObjectiveName)
        .style("fill", mostInfluentialObjectiveColor) // Use the color of the most influential objective
        .style("font-weight", "bold")
        .append("tspan")
        .text(" has the most influence in the selected solution")
        .style("fill", "black");
    }
    // If a line is selected, draw dashed line connecting to reference point
    if (selectedIndices[0] !== null && showArrows) {
      const selectedSolution = solutions[selectedIndices[0]];

      selectedSolution.objective_values.forEach((value, i) => {
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

  // Marker selection function
  function selectMarker(index: number) {
    selectedObjective = index;
    drawPlot();
  }
  // Line selection function
  function selectLine(index: number) {
    // Set selected index and force reactivity by reassigning the array
    selectedIndices = [index]; // Toggle selection
    selectedIndices[0] !== null
      ? (objectiveImpacts = solutions[selectedIndices[0]].impact)
      : (objectiveImpacts = [0, 0, 0, 0]);
    selectedObjective = d3.maxIndex(objectiveImpacts);
    drawPlot();
  }

  // Function to display the tooltip
  function showTooltip(event, solutionIndex) {
    const solution = solutions[selectedIndices[0]];

    // Generate a simple bar chart inside the tooltip
    const tooltipSvg = d3
      .select(".tooltip")
      .style("display", "block")
      .style("width", "150px")
      .style("word-wrap", "break-word")
      .style("left", event.pageX + 10 + "px")
      .style("top", event.pageY - 50 + "px")
      .html(""); // Clear existing content

    const chartWidth = 100;
    const chartHeight = 50;
    const barPadding = 5;

    // Ensure to find a valid maximum value to prevent negative heights
    const maxObjectiveValue = d3.max(solution.objective_values) || 0; // Default to 0 if undefined

    const barScale = d3
      .scaleLinear()
      .domain([0, maxObjectiveValue]) // Scale from 0 to max value
      .range([0, chartHeight]);

    tooltipSvg
      .append("text")
      .text(
        "Impairing efects of the rest of the objectives on the value of " +
          names[solutionIndex]
      )
      .style("font-weight", "bold");

    tooltipSvg
      .append("svg")
      .attr("width", chartWidth)
      .attr("height", chartHeight)
      .selectAll("rect")
      .data(solution.objective_values)
      .enter()
      .append("rect")
      .attr("x", (_, i) => i * (chartWidth / solution.objective_values.length))
      .attr("y", (d) => chartHeight - barScale(d)) // Prevent negative height
      .attr("width", chartWidth / solution.objective_values.length - barPadding)
      .attr("height", (d) => {
        const heightValue = barScale(d);
        return heightValue > 0 ? heightValue : 0; // Ensure height is non-negative
      })
      .attr("fill", (_, i) => colorPalette[i]);

    tooltipSvg.append("text").text("Click to see how to improve this value");
  }

  // Function to hide the tooltip
  function hideTooltip() {
    d3.select(".tooltip").style("display", "none");
  }

  // Redraw plot if input data or selection changes
  $: if (
    solutions.length > 0 ||
    ranges ||
    names.length > 0 ||
    selectedIndices
  ) {
    drawPlot(); // Redraw whenever any input changes
  }

  onMount(() => {
    drawPlot(); // Initial plot drawing
  });
</script>

<svg bind:this={svg} />
