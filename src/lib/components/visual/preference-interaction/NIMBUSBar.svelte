<!-- 
  @component
  Uses HorizontalBar.svelte and BasicInput.svelte components to create a classification component with inputs and the horizontal bar.
 -->
<script lang="ts">
  import Input from "$lib/components/visual/preference-interaction/BasicInput.svelte";
  import SingleHorizontalBar from "$lib/components/visual/preference-interaction/HorizontalBarAltXAI.svelte";
  import SingleHorizontalBar2 from "$lib/components/visual/preference-interaction/HorizontalBarAltXAI2.svelte";
  import SingleHorizontalBar3 from "$lib/components/visual/preference-interaction/HorizontalBarAlt.svelte";
  import { getIthObjectiveValues } from "../../../../helpers";

  enum classification {
    ChangeFreely = "Change freely",
    WorsenUntil = "Worsen until",
    KeepContant = "Keep constant at",
    ImproveUntil = "Improve until",
    ImproveFreely = "Improve freely",
  }
  /** The lower bound of the chart. */
  export let lowerBound: number;

  /** The higher bound of the chart. */
  export let higherBound: number;

  /** The name to be shown on top of the component. */
  export let barName: string | undefined = undefined;

  /** The solution value to display on the chart. */
  // export let solutionValue: number | undefined = undefined;

  export let selected: number[];
  export let solutions: Solution[];
  export let currentObjective: number;
  export let variant: number;

  let solutionsObjective = getIthObjectiveValues(solutions, currentObjective);
  /** The value that the user has selected */
  export let selectedValue: number | undefined = undefined;
  export let tradeoffs: string | null = null;
  /** The previous value to display on the chart. */
  export let previousValue: number;

  /** Whether a lower value is better. */
  export let lowerIsBetter = true;

  export let objectiveToImprove: number | null = null;

  /** The decimal precision to use for rounding values. */
  export let decimalPrecision: number | undefined = undefined;

  /** The color of the bar. */
  export let barColor: string | undefined = undefined;

  /**
   * Whether to display the arrow on the sides of the bar. Also restricts the
   * input values to the range of lower and higher bounds
   */
  export let arrowMode = false;

  /** The aspect ratio of the chart container div element. */
  export let aspect: string | undefined = undefined;

  let classificationValue: classification = classification.ChangeFreely;

  const precision = 1e-4;

  $: {
    // Todo: This only works if lowerIsBetter is false, I think.

    if (selectedValue === undefined || solutions[selected[0]] === undefined) {
      classificationValue = classification.ChangeFreely;
    } else if (
      Math.abs(selectedValue - lowerBound) < precision ||
      selectedValue < lowerBound
    ) {
      classificationValue = classification.ChangeFreely;
    } else if (
      Math.abs(selectedValue - higherBound) < precision ||
      selectedValue > higherBound
    ) {
      classificationValue = classification.ImproveFreely;
    } else if (
      Math.abs(selectedValue - solutionsObjective[selected[0]]) < precision
    ) {
      classificationValue = classification.KeepContant;
    } else if (selectedValue < solutionsObjective[selected[0]]) {
      classificationValue = classification.WorsenUntil;
    } else if (selectedValue > solutionsObjective[selected[0]]) {
      classificationValue = classification.ImproveUntil;
    }
  }

  function moveToRange() {
    if (arrowMode && selectedValue != null) {
      if (selectedValue < lowerBound) {
        selectedValue = lowerBound;
      } else if (selectedValue > higherBound) {
        selectedValue = higherBound;
      }
      selectedValue = selectedValue;
    }
  }
</script>

<!-- NIMBUS bar with inputs -->
<!-- <div class="container" style="--barColor:{barColor ? barColor : '#c000'}"> -->
<div class="grid grid-flow-row auto-rows-min grid-cols-3 gap-0">
  <div class="col-span-3">
    {#if barName}
      <span style="font-size: small; font-weight:500">{barName}</span>
    {/if}
  </div>
  <div class="row-start-2">
    <Input
      bind:value={selectedValue}
      labelName={classificationValue}
      onChange={moveToRange}
    />
  </div>

  <div class="col-span-2 row-start-2">
    {#if variant === 1}
      <SingleHorizontalBar
        {lowerBound}
        {higherBound}
        bind:selected
        bind:solutions={solutionsObjective}
        bind:tradeoffs
        bind:objectiveToImprove
        bind:selectedValue
        {previousValue}
        {lowerIsBetter}
        {decimalPrecision}
        {barColor}
        {arrowMode}
      />
    {:else if variant === 2}
      <SingleHorizontalBar2
        {lowerBound}
        {higherBound}
        bind:selected
        bind:solutions={solutionsObjective}
        bind:tradeoffs
        bind:objectiveToImprove
        bind:selectedValue
        {previousValue}
        {lowerIsBetter}
        {decimalPrecision}
        {barColor}
        {arrowMode}
      />
    {:else if variant == 3}
      <SingleHorizontalBar3
        {lowerBound}
        {higherBound}
        bind:solutionValue={solutionsObjective[selected[0]]}
        bind:selectedValue
        {previousValue}
        {lowerIsBetter}
        {decimalPrecision}
        {barColor}
        {arrowMode}
      />
    {/if}
  </div>
</div>

<style>
  /* A scrollable div where height is the height of the screen*/

  .container {
    display: flex;
    /* width: fit-content; */
    /* min-width: max-content; */
    /* justify-content: space-between; */
    height: 100%;
    width: 100%;
    column-gap: 2em;
    /*border-style: solid;*/
    /*border-width: 2px;*/
    /*border-color: "c000";*/
    padding: 0.5em;
  }

  div div {
    /* margin: 0.5em; */
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }
  .firstPart {
    min-width: 20%;
    max-width: 20%;
    justify-content: var(--justify);
  }
  .secondPart {
    width: 100%;
    justify-content: space-between;
  }

  #prev {
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    margin: 0;
    padding-bottom: 0;
  }

  #prevValue {
    margin-left: 0.5em;
    align-self: center;
    font-size: x-small;
    color: gray;
    font-weight: 600;
  }
</style>
