<!--@component
    @description Makes a bar chart using the ECharts library.
-->
<!-- TODO: Values on the x-axis too close to each other -->
<script lang="ts">
  import type * as echarts from "echarts";
  import EchartsComponent from "../general/EchartsComponent.svelte";
  import { colorPalette } from "$lib/components/visual/constants";

  /** The colors to use for the chart. */
  export let colors: string[] = [];

  /** The values to use for the chart. */
  export let values: number[];

  /** The names to use for the individual bars (objective names). */
  export let names: string[] = [];

  /**
   * The aspect ratio as a tailwind class for the div container, which contains
   * the chart.
   *
   * @example
   *   aspect - [5 / 3];
   */
  export let aspect: string | undefined = "[2/3]";

  /**
   * An array of boolean values indicating whether lower values are better for
   * each data point (In MOO if the objective is to be minimized or maximized).
   */
  console.log(values);
  let chart: echarts.EChartsType;
  // Create the option object for the whole chart.
  // @ts-ignore
  const option: echarts.EChartOption = {
    tooltip: {
      trigger: 'axis',
      axisPointer : {           
            type : 'shadow'
      }
      //formatter: (params) => `Value: ${params.value[2]}`
    },
    grid: {
      height: '80%',
      bottom: '20%',
    },
    xAxis: {
      type : 'category',
      axisLine: {show: true},
      axisTick: {show: true},
      splitLine: {show: false},
      data: names.map((name, i) => ` ${name} {marker${i}|}`),
      axisLabel: {
        interval:0,
      //rotate: -20,
      fontSize:10,
      rich: Object.fromEntries(
          names.map((_, i) => [
            `marker${i}`,
            {
              backgroundColor: colorPalette[i % colorPalette.length], // Assign color based on index
              width: 6,
              height: 6,
              borderRadius: 1,
              borderWidth:1,
              borderColor: "blue",
              //padding: [2, 2, 2, 2]
            }
          ])
        )
    },
  },
    yAxis: {
        type : 'value',
        //position: 'top',
        splitLine: {lineStyle:{type:'dashed'}},
    },
    series: [
      {
        type: "bar",
        data: values,
        
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
