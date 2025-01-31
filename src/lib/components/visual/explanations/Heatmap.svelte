<!--@component
    @description Makes a bar chart using the ECharts library.
-->
<!-- TODO: Values on the x-axis too close to each other -->
<script lang="ts">
  import type * as echarts from "echarts";
  import EchartsComponent from "../general/EchartsComponent.svelte";

  /** The colors to use for the chart. */
  export let colors: string[] = [];

  /** The values to use for the chart. */
  export let values: number[][];

  /** The names to use for the individual bars (objective names). */
  export let names: string[] = [];

  /**
   * The aspect ratio as a tailwind class for the div container, which contains
   * the chart.
   *
   * @example
   *   aspect - [5 / 3];
   */
  export let aspect: string | undefined = undefined;

  /**
   * An array of boolean values indicating whether lower values are better for
   * each data point (In MOO if the objective is to be minimized or maximized).
   */
  export let lowerIsBetter: boolean[] | undefined = undefined;

  console.log(values);
  let chart: echarts.EChartsType;
  // Create the series data for the radar chart and the data for the markLines (They indicate if lower or higher value is better).
// Generate sample data
function generateHeatmapData(rows: number, cols: number): [number, number, number][] {
    let data: [number, number, number][] = [];
    for (let x = 0; x < cols; x++) {
      for (let y = 0; y < rows; y++) {
        data.push([x, y, values[x][y]]);
      }
    }
    return data;
  }
 
  // Create the option object for the whole chart.
  // @ts-ignore
  const option: echarts.EChartOption = {
    tooltip: {
      position: "top",
      //formatter: (params) => `Value: ${params.value[2]}`
    },
    xAxis: {
      type: "category",
      data: names, // 10 columns
    },
    yAxis: {
      type: "category",
      data: names, // 10 rows
    },
    // @ts-ignore
    visualMap: [{
      show:false,
      min: -5,
      max: 5,
      calculable: true,
      orient: "vertical",
      left: "right",
      top: "center"
    }],
    series: [
      {
        type: "heatmap",
        data: generateHeatmapData(5,5),
        label: {
          show: false,
          color: "#fff"
        },
        emphasis: {
          itemStyle: {
            borderColor: "#333",
            borderWidth: 1
          }
        }
      }
    ]
  };
  // TODO: The following part (let events...) of the code is duplicated in every chart component. Moving to separate file doesn't work, most likely because of chart.on -functions that might need to be defined in the same file as the chart is created.
  let events = {
    click: function () {
      return;
    },
    mouseover: function () {
      return;
    },
    mouseout: function () {
      return;
    },
  };

</script>

<EchartsComponent
  {option}
  bind:chart
  bind:events
  {colors}
  disableAnimation={false}
  {aspect}
/>
<!-- height = {6/3} -->
