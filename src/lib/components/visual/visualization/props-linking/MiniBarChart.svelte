<!--@component
    @description Makes a mini bar chart, which looks like NIMBUS classification component using the ECharts library.
-->
<!-- TODO: Values on the x-axis too close to each other -->
<script lang="ts">
  import type * as echarts from "echarts";
  import EchartsComponent from "../../general/EchartsComponent.svelte";
  import { colorPalette } from "../../constants";

  /** The colors to use for the chart. */
  export let colors: string[] = [];

  /** The values to use for the chart. */
  export let values: number[];

  /** The lower bounds for each objective */
  export let lowerBounds: number[] = [];

  /** The upper bounds for each objective */
  export let upperBounds: number[] = [];

  /** Whether to disable animation for the chart. */
  let disableAnimation: boolean | undefined = true;

  /**
   * The aspect ratio as a tailwind class for the div container, which contains
   * the chart.
   *
   * @example
   *   aspect - [5 / 3];
   */
  export let aspect: string | undefined = "1";

  /**
   * An array of boolean values indicating whether lower values are better for
   * each data point (In MOO if the objective is to be minimized or maximized).
   */
  export let lowerIsBetter: boolean[] | undefined = undefined;

  if (colors === undefined || colors.length === 0) {
    colors = colorPalette;
  }

  let chart: echarts.EChartsType;

  // Create the series data for the bar chart and the data for the markLines (They indicate if lower or higher value is better).
  type seriesDataElement = {
    data: {
      value: number;
      itemStyle: {
        color: string;
      };
    }[];
    type: string;
    barWidth: string;
    stack: string;
  };
  let seriesData: seriesDataElement[] = [
    // Part of the bar closer to the lower bound
    {
      data: [],
      type: "bar",
      barWidth: "100%",
      stack: "total",
    },
    // Part of the bar closer to the upper bound
    {
      data: [],
      type: "bar",
      barWidth: "100%",
      stack: "total",
    },
  ];
  let valueTemp = 0;
  for (let i = values.length - 1; i >= 0; i--) {
    valueTemp =
      (values[i] - lowerBounds[i]) / (upperBounds[i] - lowerBounds[i]);
    if (!(lowerIsBetter === undefined || lowerIsBetter[i])) {
      seriesData[0].data?.push({
        value: valueTemp,
        itemStyle: {
          color: "#ffffff00",
        },
      });
      seriesData[1].data?.push({
        value: 1,
        itemStyle: {
          color: colors[i],
        },
      });
    } else {
      seriesData[0].data?.push({
        value: valueTemp,
        itemStyle: {
          color: colors[i],
        },
      });
      seriesData[1].data?.push({
        value: 1,
        itemStyle: {
          color: "#ffffff00",
        },
      });
    }
  }

  // Create the option object for the whole chart.
  const option: echarts.EChartOption = {
    xAxis: {
      type: "value",
      min: 0,
      max: 1,
      show: false,
      axisTick: {
        show: false,
      },
      axisLabel: {
        show: false,
      },
    },
    yAxis: {
      type: "category",
      show: false,
      axisTick: {
        show: false,
      },
      axisLabel: {
        show: false,
      },
    },
    series: seriesData,
    grid: {
      left: 0,
      top: 0,
      right: 0,
      bottom: 0,
    },
  };
</script>

<EchartsComponent {option} bind:chart {disableAnimation} {aspect} />
