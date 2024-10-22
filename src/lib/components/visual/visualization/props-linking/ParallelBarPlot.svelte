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
  import * as echarts from "echarts";
  import {
    colorPalette,
    selectedLineStyle,
  } from "$lib/components/visual/constants";
  import type { EChartOption } from "echarts";
  import {
    getAxisX,
    getChartModel,
    handleHighlightChange,
    tooltipFormatter,
  } from "$lib/components/visual/helperFunctions";
  import {
    handleClickSelection,
    handleSelectionChange,
  } from "$lib/components/visual/helperFunctions";
  import EchartsComponent from "../../general/EchartsComponent.svelte";
  import { symbol } from "d3";
  import { onMount } from "svelte";

  // Props for this component:
  /** The values to display on the plot. */
  export let solutions: Solution[];

  /** Whether a lower value is better for each axis. */
  export let lowerIsBetter: boolean[] = [];

  /** Whether to show indicators for each axis. */
  export let showIndicators = false;

  /** The ranges for each axis. */
  export let ranges: Ranges[];

  /** The names for each axis. */
  export let names: string[] = [];

  /** The indices of the selected values. */
  export let selectedIndices: number[] = [];

  /** The index of the highlighted value. */
  export let highlightedIndex: number | undefined = undefined;

  /** Whether to disable interaction with the plot. */
  export let disableInteraction = false;

  /** A Ranges -object that defines the latest brush interval */
  export let brushInterval: Ranges | undefined = undefined;

  /** An array of Ranges -objects that define the brush interval for each axis */
  export let brushIntervalPerAxis: Ranges[] = [];

  /** The new options for the plot. */
  export let newOptions: EChartOption | undefined = undefined;

  /** The maximum number of selections allowed. */
  export let maxSelections: number | undefined = undefined;

  /** The colors to use for the plot. */
  export let colors: string[] = colorPalette;

  /** Whether to disable animation for the plot. */
  export let disableAnimation: boolean | undefined = true;

  /** The aspect ratio of the plot container. */
  export let aspect: string | undefined = "aspect-[6/3]";

  /** Custom CSS styles to apply to the chart container. */
  export let customStyle: string | undefined = undefined;

  let chartContainer: HTMLDivElement;

  // Data for the parallel lines
  let lineData = [
    [10, 50, 150, 200, 80],
    [20, 60, 100, 250, 120],
    [30, 80, 130, 220, 150],
  ];

  // Y-axis names and ranges
  let yAxisNames = ["Axis 1", "Axis 2", "Axis 3", "Axis 4", "Axis 5"];
  let yAxisRanges = [
    [0, 100], // Range for Axis 1
    [0, 200], // Range for Axis 2
    [0, 300], // Range for Axis 3
    [100, 300], // Range for Axis 4
    [0, 150], // Range for Axis 5
  ];

  // Rectangle heights (these will create vertical rectangles)
  let rectangleHeights = [70, 150, 200, 250, 130];

  // Initialize the chart when the component is mounted
  onMount(() => {
    let chart = echarts.init(chartContainer);

    // Using a non-strictly typed option object
    let option = {
      colors: colors,
      parallelAxis: [
        { dim: 0, name: "Axis 1", min: 0, max: 100 },
        { dim: 1, name: "Axis 2", min: 0, max: 200 },
        { dim: 2, name: "Axis 3", min: 0, max: 300 },
        { dim: 3, name: "Axis 4", min: 100, max: 300 },
        { dim: 4, name: "Axis 5", min: 0, max: 150 },
      ],
      parallel: {
        left: "5%",
        right: "5%",
        bottom: "10%",
        top: "30%",
        parallelAxisDefault: {
          type: "value",
        },
      },
      series: [
        {
          type: "parallel",
          lineStyle: {
            width: 2,
            opacity: 0.8,
          },
          data: lineData,
        },
      ],
      graphic: rectangleHeights.map((height, index) => ({
        type: "rect",
        shape: {
          x: 0, // Position next to the chart
          y: 300 - height, // Adjust based on height
          width: 20, // Rectangle width
          height: height,
        },
        style: {
          fill: "red", // Color from the array
        },
        z: 900, // Ensure rectangles are on top
      })),
    };

    // Use the chart's `setOption` method with the option object
    chart.setOption(option);

    // Cleanup function to dispose of chart instance
    return () => {
      chart.dispose();
    };
  });
</script>

<!-- Chart container -->
<div id="chart-container" bind:this={chartContainer} />

<style>
  /* Style the chart container */
  #chart-container {
    width: 400px;
    height: 600px;
  }
</style>
