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
  export let values: number[][];

  /** The names to use for the individual bars (objective names). */
  export let names: string[] = [];

  let option: echarts.EChartOption;

  $: flattenedValues = values.flat(); // Convert 2D array to 1D array
  $: minValue = Math.min(...flattenedValues);
  $: maxValue = Math.max(...flattenedValues);

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
  export let lowerIsBetter: boolean[] | undefined = undefined;

  console.log(values);
  let chart: echarts.EChartsType;
  // Create the series data for the radar chart and the data for the markLines (They indicate if lower or higher value is better).
// Generate sample data
function generateHeatmapData(): [number, number, number][] {
    let data: [number, number, number][] = [];
    let cols = names.length;
    let rows = names.length;
    for (let x = 0; x < cols; x++) {
      for (let y = 0; y < rows; y++) {
        data.push([x, y, values[x][y]]);
      }
    }
    return data;
  }
 
  // Create the option object for the whole chart.
  // @ts-ignore
  $: option = {
    tooltip: {
      show: true,
      position: "top",
      /*formatter: (params: { value: any[] }) => {
        let value = Array.isArray(params.value)? params.value?.[2] : undefined;
        let effect = value > 0 ? "negative effect" : "positive effect";
        if (value ===undefined){
          return undefined
        }
        else{
          return `Value of reference point produce a ${effect} on the obtained soution`;
        }
      }*/
      //formatter: (params) => `Value: ${params.value?.[2]}`
    },
    grid: {
      height: '60%',
      left: '100px',  
      bottom: '1%',
      top: '40%'
    },
    xAxis: {
      type: "category",
      name:"Obtained solution",
      nameGap:30,
      nameLocation:"middle",
      data: names.map((name, i) => ` ${name}\n {marker${i}|}`),
      position:"top",
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
    }
    },
    yAxis: {
      type: "category",
      inverse: true,
      name: "Reference point",
      nameLocation: "middle",
      nameGap: 70,  // Moves name away from axis
      nameTextStyle:{
        fontSize:10
      },
      data: names.map((name, i) => ` ${name} {marker${i}|}`),
      axisLabel: {
        interval: 0,
        fontSize: 10,
        rich: Object.fromEntries(
          names.map((_, i) => [
            `marker${i}`,
            {
              backgroundColor: colorPalette[i % colorPalette.length], // Assign color based on index
              width: 6,
              height: 6,
              borderRadius: 1,
              borderWidth:1,
              borderColor: "black",
              //padding: [2, 2, 2, 2]
            }
          ])
        )
      }
    },
    // @ts-ignore
    visualMap: [{
      min: minValue,
      max: maxValue,
      show:false,
      //calculable: true,
      inRange: {
            color: ['green', 'rgb(255,241,183)','#C00000'],
           
        },

    }],
    series: [
      {
        type: "heatmap",
        data: generateHeatmapData(),
        itemStyle: {
          borderWidth: 1,
          borderColor: "#fff",  // Adds border for better visibility
          borderRadius:2,
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
