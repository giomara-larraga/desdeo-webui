<!-- 
  @component
  A Svelte component that renders an ECharts chart.
 -->
<script lang="ts">
  import type { EChartOption, EChartsType } from "echarts";
  import * as echarts from "echarts";
  import { onMount } from "svelte";
  import { highlightedStyle } from "../constants";

  /** An array of colors (kind of a color palette) to use for the chart series. */
  export let colors: string[] = [];

  /** The ECharts instance used to render the chart. */
  export let chart: EChartsType | undefined = undefined;

  /** The ECharts chart options. */
  export let option: EChartOption;

  /** Whether to disable animations on the chart. */
  export let disableAnimation = true;

  /** The aspect ratio of the chart container. */
  export let aspect: string | undefined = undefined;

  /** The GeoJSON data to use for the chart. */
  export let geoJSON: object | undefined = undefined;

  /** The name of the map to use for the chart. */
  export let mapName: string | undefined = undefined;

  /** Custom CSS styles to apply to the chart container. */
  export let customStyle = "";

  /**
   * Event handlers for the chart events.
   *
   * @example
   *   {
   *   click: function () {
   *   if (componentIndex != undefined) {
   *   selectedIndices = updateSelectedIndices(componentIndex);
   *   }
   *   },
   *   mouseover: function () {
   *   highlightedIndex = componentIndex;
   *   },
   *   mouseout: function () {
   *   highlightedIndex = undefined;
   *   },
   *   };
   */
  export let events:
    | {
        [key: string]: (params: {
          dataIndex: number;
          componentType: string;
          seriesIndex: number;
          intervals: number[][];
          data: { value: number[] };
        }) => void;
      }
    | undefined = undefined;

  let chartDiv: HTMLDivElement;

  //Attaches the given event handlers to the chart instance.
  $: if (events) {
    if (chart) {
      for (const [eventName, eventHandler] of Object.entries(events)) {
        chart.on(eventName, eventHandler);
        chart = chart;
      }
    }
  }

  onMount(() => {
    if (!chart) {
      chart = echarts.init(chartDiv, "", { renderer: "svg" });
      chart.setOption(option);
    } else {
      chart.resize();
    }
  });

  $: if (chart) {
    chart.setOption(option);
  }
</script>

<div
  style="height: 50vh; width: 30vw;"
  bind:this={chartDiv}
/>
