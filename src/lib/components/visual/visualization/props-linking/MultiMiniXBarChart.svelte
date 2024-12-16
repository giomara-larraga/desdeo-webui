<!--@component
    @description Visulize multiple solutions with mini bar chart, which look
    like NIMBUS classification component using the ECharts library.
-->
<!-- TODO: Values on the x-axis too close to each other -->
<script lang="ts">
  import { colorPalette } from "../../constants";
  import MiniBarChart from "./XMiniBarChart.svelte";
  import type { Ranges } from "$lib/components/visual/types";

  /** The colors to use for the chart. */
  export let colors: string[] = [];
  export let names: string[] = [];
  export let ranges: Ranges[] | undefined = undefined;

  /** The values to use for the chart. */
  export let solutions: number[][];

  export let multipliers: number[][] = [[0.1, 0.5, 0.1, 0.2, 0.3]]; // Array representing the impact of each objective

  /** The lower bounds for each objective */
  export let lowerBounds: number[] = [];

  /** The upper bounds for each objective */
  export let upperBounds: number[] = [];

  /** The indices of the selected items in the chart. */
  export let selectedIndices: number[] = [];

  export let referencePoint: number[] = [];
  export let to_impair: boolean[] = Array(referencePoint.length).fill(false);
  export let to_improve: boolean[] = Array(referencePoint.length).fill(false);

  export let show_explanations: boolean = false;

  /**
   * The aspect ratio as a tailwind class for the div container, which contains
   * the chart.
   *
   * @example
   *   aspect - [5 / 3];
   */

  /**
   * An array of boolean values indicating whether lower values are better for
   * each data point (In MOO if the objective is to be minimized or maximized).
   */
  export let lowerIsBetter: boolean[] | undefined = undefined;

  if (colors === undefined || colors.length === 0) {
    colors = colorPalette;
  }
  $: console.log(selectedIndices);

  function handleClick(index: number) {
    selectedIndices = [index];

    to_impair = Array(referencePoint.length).fill(false);
    to_improve = Array(referencePoint.length).fill(false);

    /*     if (selectedIndices.includes(index)) {
      selectedIndices = selectedIndices.filter((i) => i !== index);
    } else {
      selectedIndices = [...selectedIndices, index];
    } */
  }
</script>

<section>
  {#each solutions as value, index}
    <button
      style={selectedIndices.includes(index)
        ? "border-color: blue; border-width: 3px;"
        : "border-color: white; border-width: 3px;"}
      on:click={() => handleClick(index)}
    >
      Solution {index}
      <MiniBarChart
        {names}
        {colors}
        values={value}
        {ranges}
        {referencePoint}
        multipliers={multipliers[index].map(Math.abs)}
        {lowerBounds}
        {upperBounds}
        {lowerIsBetter}
        isSelected={selectedIndices.includes(index) ? true : false}
        bind:to_impair
        bind:to_improve
        bind:show_explanations
      />
    </button>
  {/each}
</section>

<!-- height = {6/3} -->
