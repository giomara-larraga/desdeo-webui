<!--@component
    @description 
-->
<!-- TODO: Make a component for a single bar chart. 
TODO: Highlighting and selection don't work properly. Most propably bug in the using of seriesIndex and dataIndex
-->

<script lang="ts">
  import { onMount } from "svelte";
  import * as echarts from "echarts";
  // import { onDestroy } from "svelte";
  // import { selectedSolutionsIndices } from "$lib/components/visual/stores";
  // import { createChart } from "$lib/components/visual/stores";
  // import type { SolutionData } from "$lib/components/visual/types";
  import {
    handleClickSelection,
    handleHighlightChange,
    handleSelectionChange,
  } from "$lib/components/visual/helperFunctions";

  // export let id: string;
  // export let title: string;
  // export let data: SolutionData;

  export let values: number[][];
  // export let minimize: boolean[];
  // export let showIndicators = false;
  export let indicatorNames: string[] = []; // At the moment breaks the graphics if not given the same amount as values (objectives/axis)
  export let selectedIndices: number[] = [];
  export let title = "Test title";
  export let highlightedIndices: number | undefined = undefined;
  // export let data: SolutionData;

  const names: string[] = indicatorNames;

  let chartDiv: HTMLDivElement;
  let chart: echarts.EChartsType;
  $: if (selectedIndices) {
    if (chart) {
      handleSelectionChange(chart, selectedIndices);
    }
  }

  $: {
    if (chart) {
      handleHighlightChange(chart, highlightedIndices);
    }
  }

  let series: { type: string }[] = [];

  // Set the column names
  let dataSet = [["Solution", ...names]];
  for (let i = 0; i < values.length; i++) {
    let newRow = ["Solution " + (i + 1)];
    newRow.push(...values[i]);
    dataSet.push(newRow);
    series.push({ type: "bar" });
  }
  onMount(() => {
    // Create the option object for the whole chart.
    const option: echarts.EChartOption = {
      title: {
        text: title,
      },
      tooltip: {
        formatter: (params: {
          seriesName: string;
          data: { [x: string]: string };
          seriesIndex: number;
        }) => {
          let result = params.seriesName + "<br>";
          // +1 Because the first value in the list is the name of the objective.
          return result + "Value: " + params.data[params.seriesIndex + 1];
        },
      },
      xAxis: {
        type: "category",
      },
      yAxis: {
        type: "value",
      },
      dataset: {
        source: dataSet,
      },
      series: series,
    };
    chart = echarts.init(chartDiv, "", { renderer: "svg" });
    chart.setOption(option);

    // TODO: The following part of the code is duplicated in every chart component. Moving to separate file doesn't work, most likely because of chart.on -functions that might need to be defined in the same file as the chart is created.
    chart.on("mouseover", function (params: { dataIndex: number }) {
      highlightedIndices = params.dataIndex;
    });
    chart.on("mouseout", function () {
      highlightedIndices = undefined;
    });
    chart.on(
      "click",
      function (params: {
        dataIndex: number;
        componentType: string;
        seriesIndex: number;
      }) {
        console.log(params);
        selectedIndices = handleClickSelection(params, selectedIndices);
      }
    );
    // let allValues = [...Array(values.length).keys()];
    // chart.on("mouseover", (params) => {
    //   // console.log(params);
    //   // console.log(params.seriesIndex);
    //   // console.log(params.dataIndex);
    //   chart.dispatchAction({
    //     type: "downplay",
    //     seriesIndex: allValues,
    //     dataIndex: allValues,
    //   });
    //   chart.dispatchAction({
    //     type: "highlight",
    //     seriesIndex: params.seriesIndex,
    //     dataIndex: allValues,
    //   });
    //   // chart.setOption({
    //   //   emphasis: {
    //   //     itemStyle: {
    //   //       color: "red",
    //   //     },
    //   //   },
    //   // });
    // });
    // chart.on("mouseout", () => {
    //   chart.dispatchAction({
    //     type: "downplay",
    //     seriesIndex: allValues,
    //     dataIndex: allValues,
    //   });

    //   //TODO: make selectedIndices a store also.
    //   // console.log({ $selectedSolutionsIndices });
    //   chart.dispatchAction({
    //     type: "highlight",
    //     seriesIndex: allValues,
    //     // dataIndex: params.dataIndex,
    //     dataIndex: $selectedSolutionsIndices,
    //   });
    // });
  });
</script>

<div style="width: 100vh; height: 50vh;" bind:this={chartDiv} />