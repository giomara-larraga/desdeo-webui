<!--
@component
A component for showing visualizations in tabs.

NOTE: The user of the component is responsible for verifying that `names`,
`values`, `lower_bounds`, `upper_bounds` and `lower_is_better` have the same
length.
-->
<script lang="ts" context="module">
  export type Point = number[];
</script>

<script lang="ts">
  import { TabGroup, Tab, RadioGroup, RadioItem } from "@skeletonlabs/skeleton";
  import { transform_bounds } from "$lib/components/util/util";

  export let names: string[] | undefined = undefined;
  export let values: Point[];
  export let reference_point: number[] | undefined = undefined;
  export let preference: (number | undefined)[] = [undefined];
  export let multipliers: number[][] | undefined = undefined;
  export let lower_bounds: number[];
  export let upper_bounds: number[];
  export let lower_is_better: boolean[];
  export let selected: number[] = [];
  export let max_selections: number | undefined = undefined;
  export let highlighted: number | undefined = undefined;
  export let tab = 0;
  export let disabled = false;
  export let to_impair: boolean[];
  export let to_improve: boolean[];
  export let explanations: string[] = ["", "", "", "", ""];

  export let show_explanations: boolean = false;
  let value_type_viz_solutions: number = 0;
  let value_type_viz_explanations: number = 0;

  $: bounds = transform_bounds(lower_bounds, upper_bounds);

  // Import the visualizations here.
  import ParallelCoordinatePlotBase from "$lib/components/visual/visualization/props-linking/ParallelCoordinatePlot.svelte";
  import MultiMiniBarChart from "$lib/components/visual/visualization/props-linking/MultiMiniBarChart.svelte";
  import MultiMiniXBarChart from "$lib/components/visual/visualization/props-linking/MultiMiniXBarChart.svelte";

  import XPcp from "$lib/components/visual/explanations/xPCP.svelte";
  // import Petals from "$lib/components/visual/visualization/props-linking/MultiplePetalCharts.svelte";
</script>

<TabGroup>
  <Tab bind:group={tab} name="tab1" value={0}>Solutions</Tab>
  <Tab bind:group={tab} name="tab2" value={1}>Explanations</Tab>

  <svelte:fragment slot="panel">
    {#if tab === 0}
      <RadioGroup
        active="variant-filled-primary"
        hover="hover:variant-soft-primary"
      >
        <RadioItem
          bind:group={value_type_viz_solutions}
          name="justify"
          value={0}>Parallel Coordinates</RadioItem
        >
        <RadioItem
          bind:group={value_type_viz_solutions}
          name="justify"
          value={1}>Bar charts</RadioItem
        >
      </RadioGroup>
      {#if value_type_viz_solutions === 0}
        <ParallelCoordinatePlotBase
          {names}
          {values}
          ranges={bounds}
          lowerIsBetter={lower_is_better}
          showIndicators={true}
          disableInteraction={disabled}
          maxSelections={max_selections}
          bind:selectedIndices={selected}
          bind:highlightedIndex={highlighted}
        />
      {:else if value_type_viz_solutions === 1}
        <MultiMiniBarChart
          solutions={values}
          lowerBounds={lower_bounds}
          upperBounds={upper_bounds}
          lowerIsBetter={lower_is_better}
          bind:selectedIndices={selected}
        />
      {/if}
    {:else if tab === 1}
      <RadioGroup
        active="variant-filled-primary"
        hover="hover:variant-soft-primary"
      >
        <RadioItem
          bind:group={value_type_viz_explanations}
          name="justify"
          value={0}>Parallel Coordinates</RadioItem
        >
        <RadioItem
          bind:group={value_type_viz_explanations}
          name="justify"
          value={1}>Bar charts</RadioItem
        >
      </RadioGroup>
      {#if value_type_viz_explanations === 0}
        <div style="align-self: center;">
          <XPcp
            {names}
            {values}
            bind:preference
            referencePoint={reference_point}
            {explanations}
            is_maximized={lower_is_better}
            {multipliers}
            ranges={bounds}
            bind:selectedIndices={selected}
            bind:to_improve
            bind:to_impair
            bind:show_explanations
          />
        </div>
      {:else if value_type_viz_explanations === 1}
        <MultiMiniXBarChart
          {names}
          solutions={values}
          referencePoint={reference_point}
          ranges={bounds}
          {multipliers}
          lowerBounds={lower_bounds}
          upperBounds={upper_bounds}
          lowerIsBetter={lower_is_better}
          bind:to_improve
          bind:to_impair
          bind:show_explanations
          bind:selectedIndices={selected}
        />
      {/if}
    {/if}
  </svelte:fragment>
</TabGroup>
