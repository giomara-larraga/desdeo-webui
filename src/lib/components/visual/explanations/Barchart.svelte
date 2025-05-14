<!--@component
    @description Makes a bar chart using the ECharts library.
-->
<!-- TODO: Values on the x-axis too close to each other -->
<script lang="ts">
  import * as d3 from "d3";
  import { onMount, onDestroy } from "svelte";

  import { colorPalette } from "$lib/components/visual/constants";
  import { createXAxis } from "./utils/d3Helpers";
  import Tooltip from "./Tooltip.svelte";

  /** The colors to use for the chart. */
  export let selectedObjective:number = -1;
  /** The values to use for the chart. */
  export let values: number[] = [];

  /** The names to use for the individual bars (objective names). */
  export let names: string[] = [];

  export let width = 1000;
  export let height = 300;

  let svg: SVGSVGElement;
  let barColors:string[];

  let tooltipX = 0;
  let tooltipY = 0;
  let tooltipContent = "";
  let tooltipVisible = false;

  //38-56
  $: filteredValues = values.filter((ele, ind) => ind !== selectedObjective);
  $: filteredNames = names.filter((ele, ind) => ind !== selectedObjective);
  $: objectiveColors = colorPalette.filter((ele, ind) => ind !== selectedObjective);

  // Define colors: Red for positive impact, Green for negative impact
  $: barColors = values? values.map(value => value > 0 ? '#C00000' : '#00008B'):[];

  let resizeObserver: ResizeObserver;


  function drawPlot(){
    console.log(values);
    if (selectedObjective < 0 || names.length === 0 || values.length === 0) return;

    const margin = { top: 10, right: 2, bottom: 30, left: 2 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;
    const innerPadding = 5;


    // Clear existing plot
    d3.select(svg).selectAll("*").remove();

    const svgElement = d3
      .select(svg)
      .attr("width", width)
      .attr("height", height)
      .append("g")
      .attr("transform", `translate(${margin.left}, ${margin.top})`)      


    // Create scales for each axis
    const x = d3.scaleBand()
      .domain(names)
      .range([innerPadding, innerWidth - innerPadding])
      .padding(0.1);



    const y = d3.scaleLinear()
      .domain([  
        Math.min(0, d3.min(values) ?? 0), 
        d3.max(values) ?? 1]) 
      .range([ innerHeight - innerPadding, innerPadding]);


    // Add a rectangle for each value
    values.forEach((value, i) => {
      svgElement.append("rect")
        .attr("x", x(names[i])??0)
        .attr("y", value >=0? y(value) : y(0))
        .attr("width", x.bandwidth())
        .attr("height", Math.abs(y(value) - y(0)))
        .attr("fill", i===selectedObjective?"black":barColors[i])
        .on("mouseover", (event) => {
        tooltipX = event.pageX;
        tooltipY = event.pageY;
        tooltipContent =  i===selectedObjective?"Objective to improve":`${names[i]}: ${value}`;
        tooltipVisible = true;
        })
        .on("mousemove", (event) => {
          tooltipX = event.pageX;
          tooltipY = event.pageY;
        })
        .on("mouseout", () => {
          tooltipVisible = false;
        });
  
    });

    // Add a line in y=0
    svgElement.append("line")
      .attr("x1", 0)
      .attr("y1", y(0))
      .attr("x2", innerWidth)
      .attr("y2", y(0))
      .attr("stroke", "black")
      .attr("stroke-width", 1);

    svgElement.append("rect")
    .attr("x", 0)
    .attr("y", 0)
    .attr("width", innerWidth)
    .attr("height", innerHeight)
    .attr("fill", "none")
    .attr("stroke", "black")
    .attr("stroke-width", 1);

    // Create axes
    createXAxis(svgElement, x, innerHeight, colorPalette);




  }

   // Redraw plot if input data or selection changes
  $: if (values.length > 0 ||  names.length > 0 || selectedObjective) {
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

<svg bind:this={svg}  style="width: 100%; height: 300px; position: relative;"/>

<Tooltip
  x={tooltipX}
  y={tooltipY}
  content={tooltipContent}
  visible={tooltipVisible}
/>

<!-- height = {6/3} -->
