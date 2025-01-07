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
  import {
    colorPalette,
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
  export let width = 700;
  export let height = 350;
  let selectedObjective: number = -1;
  let svg: SVGSVGElement;
  let tooltip: any; // Tooltip container

  export let to_impair: boolean[] = Array(referencePoint.length).fill(false);
  export let to_improve: boolean[] = Array(referencePoint.length).fill(false);

  export let show_explanations: boolean = false;

  function drawPlot() {
    if (!ranges || names.length === 0 || values.length === 0) return;
    const margin = { top: 40, right: 50, bottom: 40, left: 30 };
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
        .attr("x", i * barWidth -5)
        .attr("width", 10)
        .attr("height", height - margin.top - margin.bottom)
        .attr("y", 0)
        .attr("fill", colorPalette[i])
        .attr("opacity",0.7);

        axisGroup
          .append("circle")
          .attr("cx", 0) // Position next to the label
          .attr("cy", height - margin.top - margin.bottom + 16) // Align with the label
          .attr("r", 6) // Button width
          .attr("fill", "#000")
          .attr("stroke", "#000")
          .attr("stroke-width", 1)
          .on("mouseover", function (event) {
            showTooltipHeatmap(event, i); // Show the tooltip on hover
          })
          .on("mouseout", hideTooltip); // Hide the tooltip on mouse out

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
          .attr("stroke-width",2)
          .attr("opacity",0.4)
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
          .attr("stroke", value < referencePoint[i] ? "#C00000" : "#006400")
          .attr("stroke-width", 2.5)
          .attr("stroke-dasharray", "6,2")
          .attr(
            "marker-end",
            value < referencePoint[i]
              ? "url(#arrow-negative)"
              : "url(#arrow-positive)"
          ); // Attach arrow marker at the end;

        // Append a rectangle to act as the background
        svgElement
          .append("rect")
          .attr("x", i * barWidth  + 5) // Adjust positioning if needed
          .attr("y", (y1 + y2) / 2 - 10) // Position the rectangle above/below the text
          .attr("width", 50)
          .attr("height", 20) // Adjust the height as needed
          .attr("fill", "white") // Set background color to white
          .attr("fill-opacity", 0.7); // Set the opacity for transparency

        // Append the text element
        svgElement
          .append("text")
          .attr("x", i * barWidth  + 10)
          .attr("y", (y1 + y2) / 2 + 5)
          .text(
            value < referencePoint[i]
              ? String((referencePoint[i] - value).toFixed(3)) + " ↓ "
              : String((value - referencePoint[i]).toFixed(3)) + " ↑ "
          )
          .attr("fill", value < referencePoint[i] ? "#C00000" : "#006400");
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
    const solution = values[selectedIndices[0]];
    const current_multipliers = multipliers[selectedIndices[0]].map(Math.abs);
    const tradeoffs = compute_tradeoffs(solution, current_multipliers, ranges);

    let selected_tradeoffs: number[] = [];
    for (let index = 0; index < tradeoffs.length; index++) {
      selected_tradeoffs.push(Math.abs(tradeoffs[index][solutionIndex]));
    }
    console.log(selected_tradeoffs);

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
        "Impairing effects on " +
          names[solutionIndex]
      );

    // Set up SVG for the bar chart
    const chartWidth = 200;
    const chartHeight = 100;
    const marginBottom = 20;
    const marginLeft = 20;
    const barPadding = 5;

    const maxTradeoffValue = d3.max(selected_tradeoffs) || 0; // Avoid undefined
    const barScale = d3
      .scaleLinear()
      .domain([0, maxTradeoffValue])
      .range([0, chartHeight-marginBottom]);

    var x = d3.scaleBand()
      .range([ 0, width ])
      .domain(names)
      .padding(0.2);
    

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
        const significant_values = getSignificantIndices(selected_tradeoffs);
        console.log(significant_values);
        to_impair = Array(referencePoint.length).fill(false);
        to_improve = Array(referencePoint.length).fill(false);
        significant_values.forEach((index) => {
          if(Math.abs(preference[index]! - ranges![index].min!)>0.5 )
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



  function showTooltipHeatmap(event:any, objectiveIndex:number) {
    const solution_names = Array.from({ length: values.length }, (_, i) => i.toString());
    let color_scales: d3.ScaleLinear<string, string, never>[] = [];
    let all_tradeoffs = [];
    console.log("multipliers", multipliers);
    console.log("values", values);
    console.log("ranges", ranges);

    for (let index = 0; index < values.length; index++) {
        const solution = values[index];
        const current_multipliers = multipliers[index].map(Math.abs);
        const tradeoffs = compute_tradeoffs(solution, current_multipliers, ranges);
        all_tradeoffs.push(tradeoffs[objectiveIndex]);
    }

    // Debug: Log tradeoff values
    console.log("All tradeoffs:", all_tradeoffs);

    // Define color scales for each column (red, green, yellow)
    const columnColors: [string, string][] = [["white", colorPalette[0]], ["white", colorPalette[1]], ["white", colorPalette[2]], ["white", colorPalette[2]]];
    for (let i = 0; i < values[0].length; i++) {
        // Dynamically determine the domain from data
        const domain = d3.extent(all_tradeoffs.map((row: number[]) => row[i])) as [number, number]; // Explicitly cast as [number, number]
        console.log(`Domain for column ${i}:`, domain);

        const myColor = d3.scaleLinear<string>()
            .range(columnColors[i % columnColors.length])
            .domain(domain); // Use actual min and max of the column
        color_scales.push(myColor);
    }

    // Tooltip container setup
    const tooltip_width = 300;
    const tooltip_height = 250;
    const tooltip_margin = 20;

    const tooltip = d3
        .select(".tooltip")
        .style("display", "block")
        .style("width", tooltip_width + "px")
        .style("height", tooltip_height + "px")
        .style("word-wrap", "break-word")
        .style("left", event.pageX + 5 + "px")
        .style("top", event.pageY - 150 + "px")
        .style("pointer-events", "auto");

    // Clear existing content
    tooltip.html("");

    // Add explanatory text
    tooltip
        .append("div")
        .style("font-weight", "bold")
        .text("Impairing effects on " + names[objectiveIndex]);

    // Set up SVG for the heatmap
    const chartWidth = tooltip_width - 100;
    const chartHeight = tooltip_height;
    const marginBottom = 20;
    const marginLeft = 20;

    var x = d3.scaleBand()
        .range([0, chartWidth])
        .domain(names)
        .padding(0.05);

    var y = d3.scaleBand()
        .range([chartHeight - marginBottom - 24, 0])
        .domain(solution_names)
        .padding(0.05);

    const svg = tooltip
        .append("svg")
        .attr("width", chartWidth + marginLeft)
        .attr("height", chartHeight);

    svg
        .append("g")
        .style("font-size", 8)
        .attr("transform", "translate(" + marginLeft + "," + (chartHeight - marginBottom - 24) + ")")
        .call(d3.axisBottom(x).tickSize(0));

    svg.append("g")
        .style("font-size", 8)
        .attr("transform", `translate(${marginLeft}, 0)`)
        .call(d3.axisLeft(y).tickSize(0));

    // Add the heatmap squares
    svg.selectAll()
        .data(all_tradeoffs.flatMap((row, rowIndex) =>
            row.map((value, colIndex) => ({
                value,
                rowIndex,
                colIndex,
            }))
        ))
        .enter()
        .append("rect")
        .attr("x", d => marginLeft + x(names[d.colIndex])!)
        .attr("y", d => y(solution_names[d.rowIndex])!)
        .attr("width", x.bandwidth())
        .attr("height", y.bandwidth())
        .style("fill", d => {
            const color = color_scales![d.colIndex](d.value);
            console.log(`Value: ${d.value}, Color: ${color}`); // Debug: Log each value and its color
            return color;
        });

    // Add event listener to keep tooltip open when mouse enters the tooltip area
    tooltip
        .on("mouseover", () => {
            tooltip.style("display", "block"); // Prevent hiding on mouseover
        })
        .on("mouseout", () => {
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

<svg bind:this={svg} />

