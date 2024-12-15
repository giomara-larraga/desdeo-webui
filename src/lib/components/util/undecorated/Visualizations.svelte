<!--
@component
A component for showing visualizations in tabs or a grid.

NOTE: The user of the component is responsible for verifying that `names`,
`values`, `lower_bounds`, `upper_bounds` and `lower_is_better` have the same
length.
-->
<script lang="ts" context="module">
  export type Point = number[];
</script>

<script lang="ts">
  import TabbedVisualizations from "./TabbedVisualizations.svelte";
  import GriddedVisualizations from "./GriddedVisualizations.svelte";

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
  export let disabled = false;
  export let tab = 0;
  export let grid_mode = false;
  export let to_impair: boolean[] = Array(lower_bounds.length).fill(false);
  export let to_improve: boolean[] = Array(lower_bounds.length).fill(false);

  export let show_explanations: boolean = false;
</script>

{#if grid_mode}
  <GriddedVisualizations
    {names}
    {values}
    {lower_bounds}
    {upper_bounds}
    {lower_is_better}
    bind:selected
    {max_selections}
    bind:highlighted
    {disabled}
    mini_nimbus={true}
  />
{:else}
  <TabbedVisualizations
    {names}
    {values}
    {reference_point}
    bind:preference
    {multipliers}
    {lower_bounds}
    {upper_bounds}
    {lower_is_better}
    bind:selected
    {max_selections}
    bind:highlighted
    bind:tab
    {disabled}
    bind:to_impair
    bind:to_improve
    bind:show_explanations
  />
{/if}
