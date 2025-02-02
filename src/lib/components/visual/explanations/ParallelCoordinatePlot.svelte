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
  import {
    colorPalette,
    selectedLineStyle,
  } from "$lib/components/visual/constants";
  import type { Ranges } from "$lib/components/visual/types";
  import type { EChartOption } from "echarts";
  import {
    getChartModel,
    handleHighlightChange,
    tooltipFormatter,
  } from "$lib/components/visual/helperFunctions";
  import {
    handleClickSelection,
    handleSelectionChange,
  } from "$lib/components/visual/helperFunctions";
  import EchartsComponent from "../general/EchartsComponent.svelte";

  // Props for this component:
  /** The values to display on the plot. */
  export let values: number[][];

  /** Whether to show indicators for each axis. */
  export let showIndicators = true;

  /** The ranges for each axis. */
  export let ranges: Ranges[] | undefined = undefined;

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
  export let colors: string[] = [colorPalette[0]];

  /** Whether to disable animation for the plot. */
  export let disableAnimation: boolean | undefined = true;

  /** The aspect ratio of the plot container. */
  export let aspect: string | undefined = "aspect-[5/3]";

  /** Custom CSS styles to apply to the chart container. */
  export let customStyle: string | undefined = undefined;

  /** The ECharts instance of the plot */
  export let chart: echarts.ECharts | undefined = undefined;

  export let referencePoint: number[] = [];
  /*
  export let preference: (number | undefined)[] = [undefined];
  export let showArrows: boolean = true;
  export let multipliers: number[][] = [[0.1, 0.5, 0.1, 0.2, 0.3]]; // Array representing the impact of each objective
  export let explanations: string[];*/
  export let is_maximized: boolean[];
  /*
  export let to_impair: boolean[] = Array(referencePoint.length).fill(false);
  export let to_improve: boolean[] = Array(referencePoint.length).fill(false);

  export let show_explanations: boolean = true;*/


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

  $: if (values) {
    option = createOption(names, values);
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


  /** Creates the option data for the parallelAxis component. */
  function createParallelAxisOption() {
    //  Creates the names for the axes as a parallelAxis component.
    const parallelAxisOption: object[] = [];
    let min;
    let max;
    // If names are given, use them to set the names for the axes.
    if (names.length > 0) {
      for (let i = 0; i < names.length; i++) {
        // If ranges are given, use them to set the min and max values for the axis.
        if (ranges) {
          // If the range is not given or is given undefined, use the default min and max values.
          min = ranges[i] ? ranges[i].min : "dataMin";
          max = ranges[i] ? ranges[i].max : "dataMax";
        }
        let nameString =  names[i];
        if (showIndicators) {
          nameString += is_maximized[i] ? "\n (▲)" : "\n (▼)";
        }
        let nameObj = {
          dim: i,
          name: `{marker|} ${nameString}`,
          min: min,
          max: max,
          nameTextStyle: {
            rich: {
            marker:
              {
                backgroundColor: colorPalette[i % colorPalette.length], // Assign color based on index
                width: 12,
                height: 12,
                borderRadius: 1,
                borderWidth:0,
                borderColor: "gray",
                //padding: [2, 2, 2, 2]
              }
            }
          },
          axisLine: {
            lineStyle: {
              width: 1.5,
              opacity:0.5,
            }
          }
        };
        parallelAxisOption.push(nameObj);
      }
    }
    // If names are not given, use the default names.
    else {
      for (let i = 0; i < values[0].length; i++) {
        if (ranges) {
          min = ranges[i] ? ranges[i].min : "dataMin";
          max = ranges[i] ? ranges[i].max : "dataMax";
        }
        let nameObj = {
          dim: i,
          // name: "Objective " + (i + 1),
          min: min,
          max: max,
        };
        parallelAxisOption.push(nameObj);
        // let minMaxIndicator = lowerIsBetter[i] ? "\n (▼)" : "\n (▲)";
        // // let minMaxIndicator = minimize[i]? "\n (min)":"\n (max)";
        // data.names.push("Objective " + (i + 1) + minMaxIndicator);
      }
    }
    return parallelAxisOption;
  }

  /**
   * Creates the option object for the chart.
   *
   * @param names - The names of the axes.
   * @param values - The values to be shown on the parallel coordinate.
   */
  function createOption(names: string[], values: number[][]): EChartOption {
    // Creates the lines on the chart as series data.
    let seriesData: { value: number[]; name: string }[] = [];
    let seriesPreferences: { value: number[]; name: string }[] = [];

    for (let i = 0; i < values.length; i++) {
      seriesData.push({ value: values[i], name: "Obtained solution "});
    }

    seriesPreferences.push({ value: referencePoint, name: "Reference point "});
    // Create the option object for the whole chart.
    return {
      color: colors,
      tooltip: {
        // TODO: Check if there is better way to achiece no type errors, check https://github.com/apache/echarts/issues/14723
        formatter: tooltipFormatter,
      },
      parallel: {
        parallelAxisDefault: {
          axisTick: {
            show: false,
            length: 0.8,
            // length: -2,
            lineStyle: {
              cap: "round",
              width: 8,
            },
          },
          axisLabel: {
            inside: true,
            color:"gray"
          },
        },
        
      },

      parallelAxis: createParallelAxisOption(),
      toolbox: { show: false },
      animation: !disableAnimation,
      series: [
        {
          silent: disableInteraction,
          type: "parallel",
          lineStyle: {
            width: 2,
            opacity: 3,
            color: "blue",
          },
          selectedMode: "multiple",
          // colorBy: "series",
          data: seriesData,
        },
        {
          type: "parallel",
          data: seriesPreferences,
          lineStyle:{
            color:"black",
            width:2,
            opacity:5,
          }
        }
      ],
      graphic: [
        {
          type: "line",
          shape: { x1: 0, y1: 0, x2: 0, y2: 0 }, // Initial values, will be updated
          style: { stroke: "red", lineWidth: 2, opacity: 0.8 },
          silent: true, // Ignore mouse events
          z: 10, // Draw above chart
        },
        {
          type: "group",
          bounding: "raw",
          children: [],
        },
      ],
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
    axisareaselected: function (params: { intervals: number[][] }) {
      if (!chart) {
        return;
      }
      let series1 = getChartModel(chart as echarts.EChartsType).getSeries()[0];
      let indices1 = series1.getRawIndicesByActiveState("active");
      if (selectedIndices != indices1) {
        selectedIndices = indices1;
      }
      brushInterval = {
        min: params.intervals[0][0],
        max: params.intervals[0][1],
      };
      // TODO: How to get the parallel axis index where the brush has happened? params doesn't have the index.
      // Workaround for above TODO: Go through all the axes and get the min and max values of the brush interval if it exists
      let axesLenght = (chart.getOption().parallelAxis as object[]).length;
      let helpArray: Ranges[] = brushIntervalPerAxis.slice();
      for (let i = 0; i < axesLenght; i++) {
        const axisComponent = getChartModel(chart).getComponent(
          "parallelAxis",
          i
        );
        let activeIntervals = axisComponent.activeIntervals;
        let interval: Ranges = {
          min: activeIntervals.length ? activeIntervals[0][0] : undefined,
          max: activeIntervals.length ? activeIntervals[0][1] : undefined,
        };
        if (helpArray.length != axesLenght) {
          helpArray.push(interval);
        } else {
          helpArray[i] = interval;
        }
      }
      brushIntervalPerAxis = helpArray;
    },
  };
</script>

<EchartsComponent bind:chart {option} {events} {aspect} {customStyle} />
