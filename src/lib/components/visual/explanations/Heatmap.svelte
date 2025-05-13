<!--@component
    @description Makes a bar chart using the ECharts library.
-->
<!-- TODO: Values on the x-axis too close to each other -->
<script lang="ts">
  import * as d3 from "d3";
  import { onMount, onDestroy } from "svelte";

  import { colorPalette } from "$lib/components/visual/constants";
    import { createXAxis, createYAxis } from "./utils/d3Helpers";

  /** The colors to use for the chart. */
  export let colors: string[] = [];

  /** The values to use for the chart. */
  export let values: number[][];

  /** The names to use for the individual bars (objective names). */
  export let names: string[] = [];

  export let width = 350;
  export let height = 250;
  export let lowerIsBetter: boolean[] | undefined = undefined;
  let svg: SVGSVGElement;
  let resizeObserver: ResizeObserver;


  $: flattenedValues = values.flat(); // Convert 2D array to 1D array
  $: minValue = Math.min(...flattenedValues);
  $: maxValue = Math.max(...flattenedValues);
  $: minMaxRange = Math.max(...[Math.abs(minValue), Math.abs(maxValue)])

  function drawPlot() {
    if (names.length === 0 || values.length === 0) return;

    const margin = { top: 30, right: 2, bottom: 30, left: 80 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    // Clear existing plot
    d3.select(svg).selectAll("*").remove();

    const svgElement = d3
      .select(svg)
      .attr("width", width)
      .attr("height", height)
      .append("g")
      .attr("transform", `translate(${margin.left}, ${margin.top})`);

    
  // Define a pattern for diagonal cells
  const defs = svgElement.append("defs");
  defs.append("pattern")
    .attr("id", "diagonalTexture")
    .attr("patternUnits", "userSpaceOnUse")
    .attr("width", 10)
    .attr("height", 10)
    .append("path")
    .attr("d", "M0,0 L10,10") // Diagonal lines
    .attr("stroke", "gray")
    .attr("stroke-width", 1);

    // Create scales for each axis
    const x = d3
      .scaleBand()
      .domain(names)
      .range([0, innerWidth])
      .padding(0.03);

    const y = d3
      .scaleBand()
      .domain(names)
      .range([innerHeight, 0])
      .padding(0.03);

    // format axis labels
    createXAxis(svgElement, x, innerHeight, colorPalette);
    createYAxis(svgElement, y, innerWidth, colorPalette);

    const colorScale = d3
      .scaleSequential(d3.interpolateRdYlBu)
      .domain([minValue, maxValue]);

    // Add a rectangle for each value
    values.forEach((row, i) => {
      row.forEach((value, j) => {
      const rectX = x(names[i]) ?? 0;
      const rectY = y(names[j]) ?? 0;
      const rectWidth = x.bandwidth();
      const rectHeight = y.bandwidth();
        svgElement
          .append("rect")
          .attr("x", rectX)
          .attr("y", rectY)
          .attr("width", rectWidth)
          .attr("height", rectHeight)
          .attr("fill", i===j? "url(#diagonalTexture)":colorScale(value));    
      });
    });


  }

 // Redraw plot if input data or selection changes
  $: if (values.length > 0 ||  names.length > 0) {
    drawPlot(); // Redraw whenever any input changes
  }

  onMount(() => {
    resizeObserver = new ResizeObserver(entries => {
      for (const entry of entries) {
        const rect = entry.contentRect;
        width = rect.width;
        height = rect.height;
        drawPlot();
      }
    });
    resizeObserver.observe(svg);
  });
  onDestroy(()=>{
    resizeObserver.disconnect();
  })
  

</script>

<svg bind:this={svg}  style="width: 400px; height: 400px; position: relative;"/>

<!-- height = {6/3} -->
