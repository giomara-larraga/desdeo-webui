<!--@component
    @description Makes a bar chart using the ECharts library.
-->
<!-- TODO: Values on the x-axis too close to each other -->
<script lang="ts">
  import * as d3 from "d3";
  import { onMount, onDestroy } from "svelte";

  import { colorPalette } from "$lib/components/visual/constants";

  /** The colors to use for the chart. */
  export let colors: string[] = [];

  /** The values to use for the chart. */
  export let values: number[][];

  /** The names to use for the individual bars (objective names). */
  export let names: string[] = [];

  export let width = 350;
  export let height = 350;
  export let lowerIsBetter: boolean[] | undefined = undefined;
  let svg: SVGSVGElement;
  let resizeObserver: ResizeObserver;


  $: flattenedValues = values.flat(); // Convert 2D array to 1D array
  $: minValue = Math.min(...flattenedValues);
  $: maxValue = Math.max(...flattenedValues);
  $: minMaxRange = Math.max(...[Math.abs(minValue), Math.abs(maxValue)])

  function drawPlot() {
    if (names.length === 0 || values.length === 0) return;

    const margin = { top: 10, right: 2, bottom: 30, left: 50 };
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

    svgElement
      .append("g")
      .call(d3.axisLeft(y));

    // Create axes
    svgElement
      .append("g")
      .attr("class", "x-axis")
      .attr("transform", `translate(0, ${innerHeight})`)
      .call(d3.axisBottom(x));

    svgElement.append("g").attr("class", "y-axis").call(d3.axisLeft(y));

    const colorScale = d3
      .scaleSequential(d3.interpolateRdYlBu)
      .domain([minValue, maxValue]);

    // Add a rectangle for each value
    values.forEach((row, i) => {
      row.forEach((value, j) => {
        svgElement
          .append("rect")
          .attr("x", x(names[i]) ?? 0)
          .attr("y", y(names[j]) ?? 0)
          .attr("width", x.bandwidth())
          .attr("height", y.bandwidth())
          .attr("fill", colorScale(value));
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
