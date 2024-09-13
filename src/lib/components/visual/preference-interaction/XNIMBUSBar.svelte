<!-- 
  @component
  Uses HorizontalBar.svelte and BasicInput.svelte components to create a classification component with inputs and the horizontal bar.
 -->
<script lang="ts">
  import Input from "$lib/components/visual/preference-interaction/BasicInput.svelte";
  import SingleHorizontalBar from "$lib/components/visual/preference-interaction/XHorizontalBarAlt.svelte";

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
  export let solutionValues: number[] = [];

  /** The value that the user has selected */
  export let selectedValue: number | undefined = undefined;

  /** The value that the user has selected */
  export let selectedSolution: number[];

  /** The previous value to display on the chart. */
  export let previousValue: number;

  /** Whether a lower value is better. */
  export let lowerIsBetter = true;

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

  const precision = 1e-3;

  $: {
    // Todo: This only works if lowerIsBetter is false, I think.

    if (selectedValue === undefined || solutionValues.length === 0) {
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
    } else if (Math.abs(selectedValue - solutionValues[selectedSolution[0]]) < precision) {
      classificationValue = classification.KeepContant;
    } else if (selectedValue < solutionValues[selectedSolution[0]]) {
      classificationValue = classification.WorsenUntil;
    } else if (selectedValue > solutionValues[selectedSolution[0]]) {
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
<div class="grid grid-cols-3 gap-0 grid-flow-row auto-rows-min">
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
    <SingleHorizontalBar
    {lowerBound}
    {higherBound}
    {solutionValues}
    bind:selectedValue
    bind:selectedSolution
    {previousValue}
    {lowerIsBetter}
    {decimalPrecision}
    {barColor}
    {arrowMode}
  />
  <div>
  </div>
  </div>

  </div>
