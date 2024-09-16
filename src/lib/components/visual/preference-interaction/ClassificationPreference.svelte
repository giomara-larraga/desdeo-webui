<!-- 
  @component
  Uses NimbusBar.svelte component to create a classification component with inputs and the horizontal bar.
 -->

<script lang="ts">
  import XnimbusBar from "./NIMBUSBar.svelte";
  import { colorPalette } from "$lib/components/visual/constants";
  import IconHeroiconsQuestionMarkCircle from "~icons/heroicons-solid/question-mark-circle";
    import { getIthObjectiveValues } from "../../../../helpers";

  /** The names of the objectives. */
  export let objective_long_names: string[];
  export let selected: number[];
  export let solutions: Solution[];

  /**
   * Boolean to check if the objective is maximized or minimized. Must be the
   * same length as objective_names.
   */
  export let is_maximized: boolean[];

  /** The lower bound of the chart. Must be the same length as objective_names. */
  export let lower_bounds: number[];

  /** The higher bound of the chart. Must be the same length as objective_names. */
  export let upper_bounds: number[];

  /**
   * The solution value to display on the chart. Must be the same length as
   * objective_names.
   */
  //export let solutionValue: number [];

  /**
   * The previous preference value to display on the chart. Must be the same
   * length as objective_names.
   */
  //export let previousValue: number[];
  //export let selectedSolution: number[]; 
  /**
   * The value that the user has selected. Must be the same length as
   * objective_names.
   */
  export let preference: (number | undefined)[];

  $: preference = [...preference];

  /** The decimal precision to use for rounding values. */
  export let decimalPrecision = 3;

  // Extract the right number of colors from the color palette.
  let colors = colorPalette.slice(0, objective_long_names.length);

  // Add a variable to keep track of which button is selected
  let objectiveToImprove: number | null = null;
  let impactToImprove: string[] ;
  let tradeoffToimprove: string[]| null = null;
  
  function getImpactColor(level: string){
    if (level === "High"){
      return "green";
    }
    else if (level === "Medium"){
     return "yellow";
    }
    else{
      return "red";
    }
  }
  // Function to handle button click
  function handleButtonClick(index: number) {
    if (objectiveToImprove === index) {
      objectiveToImprove = null;  // Toggle off if already selected
      impactToImprove = [];
      tradeoffToimprove = [];

    } else {
      objectiveToImprove = index;  // Set the selected button
      impactToImprove = solutions[selected[0]].impact;
     /* for (let index = 0; index < impactToImprove.length; index++) {
          if (impactToImprove[index] == "High"){
            impactToImprove[index] = "green";
          }
          else if (impactToImprove[index] == "Medium"){
            impactToImprove[index] = "yellow";
          }
          else{
            impactToImprove[index] = "red";
          }
        
      }*/
      tradeoffToimprove = solutions[selected[0]].tradeoff_matrix[index];
    }
  }
</script>

<div class="flex flex-col gap-4">
  {#each objective_long_names as objective_name, j}
  <div style="display:flex; flex-direction:row">
    <XnimbusBar
    barName={objective_name + " (" + (is_maximized[j] ? "max" : "min") + ")"}
    lowerBound={lower_bounds[j]}
    higherBound={upper_bounds[j]}
    bind:selected={selected}
    bind:solutions={solutions}
    currentObjective={j}
    previousValue={solutions[selected[0]].reference_point[j]}
    objectiveToImprove={objectiveToImprove}
    barColor={colors[j]}
    bind:selectedValue={preference[j]}
    {decimalPrecision}
    lowerIsBetter={!is_maximized[j]}
    arrowMode={true}
  />
  <div style="display: flex; flex-direction:column; align-items:center; justify-content:flex-end">
    <button
    type="button"
    class="btn-icon btn-icon-sm"
    on:click={() => handleButtonClick(j)}
    style="color: {objectiveToImprove === j ? 'blue' : 'black'}"
  >     
    <IconHeroiconsQuestionMarkCircle class="icon" />
  </button>
  <span class="badge-icon" style="visibility: {objectiveToImprove === null ? "hidden" : "visible"}; background: {objectiveToImprove !== null? getImpactColor(impactToImprove[j]) : "white"}"></span>
  </div>
  

  </div>
    
  {/each}
</div>
