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
  import type * as echarts from "echarts";
  import { colorPalette } from "$lib/components/visual/constants";
  import type { EChartOption } from "echarts";
  import {
    handleHighlightChange,
    tooltipFormatter,
  } from "$lib/components/visual/helperFunctions";
  import {
    handleClickSelection,
    handleSelectionChange,
  } from "$lib/components/visual/helperFunctions";
  import EchartsComponent from "../../general/EchartsComponent.svelte";

  // Props for this component:
  /** The values to display on the plot. */
  export let solutions: Solution[];

  /** The names for each axis. */
  export let names: string[] = [];

  /** The indices of the selected values. */
  export let selectedIndices: number[] = [];

  /** The index of the highlighted value. */
  export let highlightedIndex: number | undefined = undefined;

  /** Whether to disable interaction with the plot. */
  export let disableInteraction = false;

  /** The new options for the plot. */
  export let newOptions: EChartOption | undefined = undefined;

  /** The maximum number of selections allowed. */
  export let maxSelections: number | undefined = undefined;

  /** The colors to use for the plot. */
  export let colors: string[] = [colorPalette[0]];

  /** The aspect ratio of the plot container. */
  export let aspect: string | undefined = "aspect-[5/3]";

  /** Custom CSS styles to apply to the chart container. */
  export let customStyle: string | undefined = undefined;

  /** The ECharts instance of the plot */
  export let chart: echarts.ECharts | undefined = undefined;

  let option: EChartOption;

  $: if (selectedIndices) {
    if (chart) {
      handleSelectionChange(chart, selectedIndices, maxSelections);
    }
  }

  $: {
    if (chart) {
      handleHighlightChange(chart, highlightedIndex);
    }
  }

  $: if (solutions) {
    option = createOption(names, solutions);
    if (chart) {
      // data = { names: names, values: values };
      chart.setOption(option);
    }
  }

  $: if (disableInteraction || !disableInteraction) {
    if (chart) {
      chart.setOption({
        series: [
          {
            silent: disableInteraction,
          },
        ],

        // graphic: createGraphicData(),
      });
    }
  }

  $: if (newOptions) {
    if (chart) {
      chart.setOption(newOptions);
    }
  }

  /**
   * Creates the option object for the chart.
   *
   * @param names - The names of the axes.
   * @param values - The values to be shown on the parallel coordinate.
   */
  function createOption(names: string[], values: Solution[]): EChartOption {
    // Creates the lines on the chart as series data.
    let seriesData: { value: number[]; name: string }[] = [];
    for (let i = 0; i < values.length; i++) {
      seriesData.push({
        value: values[i].decision_variables,
        name: "Alternative " + (i + 1),
      });
    }

    // Create the option object for the whole chart.
    return {
      xAxis: {},
      yAxis: {},
      tooltip: {
        // TODO: Check if there is better way to achiece no type errors, check https://github.com/apache/echarts/issues/14723
        formatter: tooltipFormatter,
      },
      toolbox: { show: false },
      colorby: "series",
      series: [
        {
          silent: disableInteraction,
          type: "scatter",
          // TODO: Implement changing line color without using select. Now select causes type error, thus the ts-ignore. For some reason parallel axis does not have select property, but for example bar charts have:https://echarts.apache.org/en/option.html#series-bar.select, parallel: https://echarts.apache.org/en/option.html#series-parallel
          //  eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore -- Error says that disabled doesn't exist in the echarts series type, but in the documentation it exists. Might be because it's a new property, so they have not updated the type yet. https://echarts.apache.org/en/option.html#series-bar.emphasis.disabled
          select: {
            itemStyle: {
              color: "#000",
            },
          },
          emphasis: {
            itemStyle: {
              color: "#000",
            },
          },
          data: seriesData,
        },
      ],
      // graphic: createGraphicData(),
    };
  }

  let events = {
    click: function (params: {
      dataIndex: number;
      componentType: string;
      seriesIndex: number;
      data: { value: number[] };
    }) {
      // console.log(params);
      selectedIndices = handleClickSelection(
        chart as echarts.EChartsType,
        params,
        selectedIndices,
        maxSelections
      );
    },
    mouseover: function (params: { dataIndex: number }) {
      highlightedIndex = params.dataIndex;
    },
    mouseout: function () {
      highlightedIndex = undefined;
    },
  };
</script>

<EchartsComponent bind:chart {option} {events} {aspect} {customStyle} />
