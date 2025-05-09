<!--
  @component
    @description Renders a single horizontal bar chart using the ECharts library. In this one, 
    smaller color bar is better
    @props
      @param {number} lowerBound - The lower bound of the chart.
      @param {number} higherBound - The higher bound of the chart.
      @param {number} solutionValue - The solution value to display on the chart.
      @param {number} selectedValue - The value that the user has selected.
      @param {number} previousValue - The previous value to display on the chart.
      @param {number} barcolor - The color of the bar.
      TODO: add rest of the props
 
-->
<script lang="ts">
  import * as d3 from "d3";
  import { onMount } from "svelte";
  import { colorPalette } from "$lib/components/visual/constants";
  import { scale } from "svelte/transition";
  import type { Ranges } from "$lib/components/visual/types";
  import { compute_tradeoffs } from "$lib/api";

  export let values: number[][];
  export let is_maximized: boolean[];
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
  export let explanations: string[];
  export let width = 1000;
  export let height = 350;
  let selectedObjective: number = -1;
  let svg: SVGSVGElement;
  let tooltip: any; // Tooltip container

  export let to_impair: boolean[] = Array(referencePoint.length).fill(false);
  export let to_improve: boolean[] = Array(referencePoint.length).fill(false);

  export let show_explanations: boolean = true;

  function drawPlot() {
    if (!ranges || names.length === 0 || values.length === 0) return;
    const margin = { top: 40, right: 50, bottom: 40, left: 50 };
    const barWidth = (width - margin.left - margin.right) / names.length;

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
        .attr("fill", "#006400"); // Arrow color

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
        .attr("fill", "#C00000"); // Arrow color
    }

    // Create scales for each axis
    const scales = names.map((_, i) =>
      d3
        .scaleLinear()
        .domain([ranges![i]!.min!, ranges![i]!.max!])
        .range([height - margin.top - margin.bottom, 0])
    );

    // Add y-axes and bars
    scales.forEach((scale, i) => {
      const axisGroup = svgElement
        .append("g")
        .attr("class", `axis-${i}`)
        .attr("transform", `translate(${i * barWidth}, 0)`);

      // Add the axis to the group
      axisGroup
        .call(d3.axisLeft(scale).ticks(10))
        .call((g) => g.selectAll(".tick line").style("stroke", "#646878")) // Style ticks
        .call((g) => g.selectAll(".tick text").style("fill", "#646878")) // Style text
        .call((g) => g.selectAll(".domain").style("stroke", "black")); // Style axis line

      // Add label to the group
      axisGroup
        .append("text")
        //.attr("transform", "rotate(-90)")
        .attr("x", 0)
        .attr("y", -20) // Adjust label position
        .style("text-anchor", "middle")
        .text(names[i])
        .style("fill", "black")
        .style("font-size", "12px");

      // Draw vertical bar for each axis
      svgElement
        .append("rect")
        .attr("x", i * barWidth - 5)
        .attr("width", 10)
        .attr("height", height - margin.top - margin.bottom)
        .attr("y", 0)
        .attr("fill", colorPalette[i])
        .attr("opacity", 0.7);

      /*svgElement
        .append("g")
        .attr("transform", `translate(${i * barWidth}, 0)`)
        .call(d3.axisLeft(scale))
        .append("text")
        .style("text-anchor", "middle")
        .attr("y", -10)
        .text(names[i])
        .style("fill", "black");*/
    });

    // Plot solutions' objective values as markers and lines
    for (let index = 0; index < values.length; index++) {
      //values.forEach((solution, solutionIndex) => {
      const line = d3
        .line<number>()
        .x((_, i) => i * barWidth)
        .y((_, i) => scales[i](values[index][i]));

      svgElement
        .append("path")
        .datum(values[index])
        .attr("d", line)
        .attr("fill", "none")
        .attr(
          "stroke",

          "#646878"
        )
        .attr("stroke-width", 1.5)
        .attr("stroke-opacity", 0.4)
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
          .attr("cx", i * barWidth)
          .attr("cy", scales[i](value))
          .attr("r", 4)
          .attr("stroke", "none")
          .attr(
            "fill",
            selectedIndices[0] === index
              ? "blue"
              : selectedIndices[0] === null
              ? "blue"
              : "#646878"
          )
          .attr("stroke-width", 2)
          .attr("opacity", 0.4)
          .attr("class", "solution-marker")
          .on("click", () => selectLine(index));
      });
      //});
    }

    // Plot reference point markers and lines
    const refLine = d3
      .line<number>()
      .x((_, i) => i * barWidth)
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
        .attr("cx", i * barWidth)
        .attr("cy", scales[i](value))
        .attr("r", 5)
        .attr("fill", "black");
    });

    //Rewrite selected markers
    if (selectedIndices[0] !== null) {
      const line = d3
        .line<number>()
        .x((_, i) => i * barWidth)
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
        svgElement
          .append("circle")
          .attr("cx", i * barWidth)
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

    // If a line is selected, draw dashed line connecting to reference point
    if (selectedIndices[0] !== null && showArrows) {
      const selectedSolution = values[selectedIndices[0]];

      selectedSolution.forEach((value, i) => {
        const y1 = scales[i](referencePoint[i]);
        const y2 =
          value < referencePoint[i]
            ? scales[i](value) - 10
            : scales[i](value) + 10;

        svgElement
          .append("line")
          .attr("x1", i * barWidth)
          .attr("y1", y1)
          .attr("x2", i * barWidth)
          .attr("y2", y2)
          .attr(
            "stroke",
            is_maximized[i]
              ? value < referencePoint[i]
                ? "#C00000"
                : "#006400"
              : value > referencePoint[i]
              ? "#C00000"
              : "#006400"
          )
          .attr("stroke-width", 2.5)
          .attr("stroke-dasharray", "6,2")
          .attr(
            "marker-end",
            is_maximized[i]
              ? value < referencePoint[i]
                ? "url(#arrow-negative)"
                : "url(#arrow-positive)"
              : value > referencePoint[i]
              ? "url(#arrow-negative)"
              : "url(#arrow-positive)"
          ); // Attach arrow marker at the end;

        // Append a rectangle to act as the background
        svgElement
          .append("rect")
          .attr("x", i * barWidth + 5) // Adjust positioning if needed
          .attr("y", (y1 + y2) / 2 - 10) // Position the rectangle above/below the text
          .attr("width", 50)
          .attr("height", 20) // Adjust the height as needed
          .attr("fill", "white") // Set background color to white
          .attr("fill-opacity", 0.7); // Set the opacity for transparency

        // Append the text element
        svgElement
          .append("text")
          .attr("x", i * barWidth + 10)
          .attr("y", (y1 + y2) / 2 + 5)
          .text(
            value < referencePoint[i]
              ? String((referencePoint[i] - value).toFixed(3)) + " ↓ "
              : String((value - referencePoint[i]).toFixed(3)) + " ↑ "
          )
          .attr(
            "fill",
            is_maximized[i]
              ? value < referencePoint[i]
                ? "#C00000"
                : "#006400"
              : value > referencePoint[i]
              ? "#C00000"
              : "#006400"
          );
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
    show_explanations = false;
    to_impair = Array(referencePoint.length).fill(false);
    to_improve = Array(referencePoint.length).fill(false);
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
    const chartHeight = impactBarHeight + 30;

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

    const maxImpactIndex = current_multipliers.indexOf(
      Math.max(...current_multipliers)
    );
    const mostInfluentialObjectiveName = names[maxImpactIndex];
    const mostInfluentialObjectiveColor = colorPalette[maxImpactIndex];

    // Add the dynamic legend text
    tooltip
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
      .text(mostInfluentialObjectiveName)
      .style("fill", mostInfluentialObjectiveColor) // Color for the most influential objective
      .style("font-weight", "bold");

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

    svg
      .append("text")
      .attr("x", 0)
      .attr("y", 40) // Position the text element
      .style("fill", "gray")
      .style("font-size", "12px")
      .append("tspan")
      .text("Sensitivity to changes per objective");
  }

  // Function to display the tooltip
  function showTooltip(event: any, solutionIndex: number) {
    const current_multipliers = multipliers[solutionIndex];

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
        "Efects of the reference point components on " + names[solutionIndex]
      );

    // Set up SVG for the bar chart
    const chartWidth = 200;
    const chartHeight = 200;
    const margin = {
      top: 0,
      left: 10,
      right: 40,
      bottom: 20,
    };

    const max_value = d3.max(current_multipliers.map(Math.abs)) as number;
    const x = d3
      .scaleLinear()
      .domain([-max_value, max_value])
      .range([0, chartWidth]);

    var y = d3.scaleBand().range([chartHeight, 0]).domain(names).padding(0.1);

    const svg = tooltip
      .append("svg")
      .attr("width", chartWidth + margin.left + margin.right)
      .attr("height", chartHeight + margin.top + margin.bottom);

    svg
      .selectAll("rect")
      .data(current_multipliers)
      .join("rect") // Ensure proper enter/update/exit cycle
      .attr("x", (d) => (d > 0 ? x(0) : x(d)))
      .attr("y", (_, i) => i * (chartHeight / current_multipliers.length)) // Calculate y position
      .attr("width", (d) => (d > 0 ? x(d) - x(0) : x(0) - x(d)))
      .attr("height", y.bandwidth()) // Scale height
      .attr("fill", (_, i) => colorPalette[i]);

    svg.append("g").classed("y-axis", true).call(d3.axisLeft(y));
    svg
      .append("g")
      .classed("x-axis", true)
      .attr("transform", `translate(0, ${chartHeight})`)
      .call(d3.axisBottom(x));
    // Add a button

    tooltip.append("text").text(explanations[solutionIndex]);
    tooltip
      .append("button")
      .attr("class", "btn variant-filled inline")
      .text("How to improve this value?")
      .style("margin-top", "10px")
      .on("click", () => {
        //alert("Action taken for " + names[solutionIndex]);
        preference = values[selectedIndices[0]];
        const significant_values = getSignificantIndices(current_multipliers);
        console.log(significant_values);
        to_impair = Array(referencePoint.length).fill(false);
        to_improve = Array(referencePoint.length).fill(false);
        significant_values.forEach((index) => {
          if (Math.abs(preference[index]! - ranges![index].min!) > 0.5)
            to_impair![index] = true;
        });
        to_improve[solutionIndex] = true;
        show_explanations = true;
      });

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
    significant.push(sortedIndices[0].idx);
    significant.push(sortedIndices[1].idx);
    significant.push(sortedIndices[2].idx);
    /*for (let i = 0; i < sortedIndices.length - 1; i++) {
      const diff = sortedIndices[i].val / sortedIndices[i + 1].val;
      if (diff > 2) significant.push(sortedIndices[i].idx); // Adjust "2" as a significance ratio
    }*/

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

<svg bind:this={svg}  style="width: 100%; height: 500px; position: relative;"/>
