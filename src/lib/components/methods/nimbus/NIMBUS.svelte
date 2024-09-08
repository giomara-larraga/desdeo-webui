<!--
@component
A user interface for the NIMBUS method.
-->
<script lang="ts">
  //
  // TODO: Fix the way maximization/minimization is presented in the NIMBUS visualization
  //
  // TODO: Improve error handling. Currently we show very general error
  // messages.
  //

  import { modalStore, Tab, TabGroup, type ModalSettings } from "@skeletonlabs/skeleton";

  import type { Token } from "$lib/api";
  import { toastStore } from "@skeletonlabs/skeleton";

  import Visualizations from "$lib/components/util/undecorated/Visualizations.svelte";
  import Card from "$lib/components/main/Card.svelte";
  import GeneralError from "$lib/components/util/undecorated/GeneralError.svelte";
  import Table from "$lib/components/util/undecorated/Table.svelte";
  import ParallelCoordinatePlotBase from "$lib/components/visual/visualization/props-linking/ParallelCoordinatePlot.svelte";
  import { transform_bounds } from "$lib/components/util/util";

  import ClassificationPreference from "$lib/components/visual/preference-interaction/ClassificationPreference.svelte";
  import { RadioGroup, RadioItem } from "@skeletonlabs/skeleton";
  import Input from "$lib/components/visual/preference-interaction/BasicInput.svelte";
  import { onMount } from "svelte";
  import EchartsComponent from "$lib/components/visual/general/EchartsComponent.svelte";
  import NimbusLayout from "$lib/components/util/undecorated/NIMBUSLayout.svelte";
  import { RPP_Info, solution_process } from "./data";
  let tabSet: number = 0;
   type Solution = {
    iteration: number;
    index: number;
    objective_values: number[];
    decision_variables: number[];
  };

   type Iteration ={
      solutions: Solution[];
      reference_point: number[];
  };
  /** The problem to solve. */
  export let problem_id: number;
  // Link to the backend.
  export let API_URL: string;
  // The authentication token.
  export let AUTH_TOKEN: Token;
  // Flag to visualize the decision space. Useful for UTOPIA maybe? Unused for now.
  //export let visualize_decision_space: boolean = false;

  // Enum to represent the state of the method.
  enum State {
    InitialLoad,
    ClassifySelected,
    IntermediateSelected,
    SaveSolutionsSelected,
  }

  // Enum to represent which solutions the DM wants to visualize.
  enum VisualizationChoiceState {
    CurrentSolutions,
    SavedSolutions,
    AllSolutions,
  }

  // The type of the problem info object returned by the backend.
  type problemInfoType = {
    objective_long_names: string[];
    objective_short_names: string[];
    is_maximized: boolean[];
    lower_bounds: number[];
    upper_bounds: number[];
  };



 

  // The current state of the method.
  let state: State = State.InitialLoad;
  let visualizationChoiceState: VisualizationChoiceState =
    VisualizationChoiceState.CurrentSolutions;

  // Preference input values.
  let preference: (number | undefined)[];
  let solutionProcess: Iteration[];
  let currentIteration: number;
  let problemInfo: problemInfoType;

  // Indexes of currently selected solutions.
  let selected_solutions: number[];

  // The reference solution to be used in the classification preference input component.
  let reference_solution: Solution | undefined;

  // The objective values of the solutions to be visualized.
  let solutions_to_visualize: Solution[];

  // The number of intermediate solutions to generate.
  let numIntermediates = 5;
  let MIN_NUM_INTERMEDIATES = 1;
  let MAX_NUM_INTERMEDIATES = 10;

  // The number of solutions NIMBUS should generate.
  let numSolutions = 1;
  let MIN_NUM_SOLUTIONS = 1;
  let MAX_NUM_SOLUTIONS = 4;

  // Flags to check if the classification/intermediate/save selection are valid.
  let is_classification_valid = false;
  let is_intermediate_selection_valid = false;
  let is_save_solutions_valid = false;

  let max_multiplier: number[] | undefined = undefined;
  let classification_checker = false;

  let finalChoiceState = false;

  $: {
    if (problemInfo !== undefined) {
      max_multiplier = problemInfo.is_maximized.map((value) => {
        if (value) {
          return -1;
        } else {
          return 1;
        }
      });
    }
  }

  /* eslint-disable */
  // Had to disable this rule because it was giving an error for the following code
  // and it was too annoying for me to fix it.
  $: {
    if (max_multiplier === undefined || preference === undefined) {
      classification_checker = false;
    } else {
      const pref_less_ref = preference.some(
        (value, index) =>
          value! * max_multiplier![index] <
          reference_solution!.objective_values[index] * max_multiplier![index]
      );

      const pref_greater_ref = preference.some(
        (value, index) =>
          value! * max_multiplier![index] >
          reference_solution!.objective_values[index] * max_multiplier![index]
      );

      if (pref_less_ref && pref_greater_ref) {
        classification_checker = true;
      } else {
        classification_checker = false;
      }
    }
  }

  /* eslint-enable */

  // Check if the classification is valid.
  $: {
    if (!(state === State.ClassifySelected)) {
      is_classification_valid = false;
    } else if (selected_solutions.length > 1) {
      is_classification_valid = false;
    } else if (!classification_checker) {
      is_classification_valid = false;
    } else {
      is_classification_valid = true;
    }
  }

  // Check if the intermediate selection is valid. Exactly two solutions must be selected.
  $: {
    if (!(state === State.IntermediateSelected)) {
      is_intermediate_selection_valid = false;
    } else if (selected_solutions?.length !== 2) {
      is_intermediate_selection_valid = false;
    } else {
      is_intermediate_selection_valid = true;
    }
  }

  // Check if the save solutions selection is valid. At least one solution must be selected.
  $: {
    if (!(state === State.SaveSolutionsSelected)) {
      is_save_solutions_valid = false;
    } else if (selected_solutions?.length === 0) {
      is_save_solutions_valid = false;
    } else {
      is_save_solutions_valid = true;
    }
  }

  // Get the reference solution to be used in the classification preference input component.
  $: {
    if (
      solutions_to_visualize !== undefined &&
      selected_solutions?.length >= 1
    ) {
      // if any selected solution index is larger than the number of solutions, set reference_solution to the last solution
      if (
        selected_solutions.some(
          (index) => index >= solutions_to_visualize.length
        )
      ) {
        reference_solution =
          solutions_to_visualize[solutions_to_visualize.length - 1];
        selected_solutions = [solutions_to_visualize.length - 1];
      } else {
        reference_solution =
          solutions_to_visualize[
            selected_solutions[selected_solutions.length - 1]
          ];
      }
    }
  }

  $: {
    if (selected_solutions?.length === 0 || selected_solutions === undefined) {
      selected_solutions = [0];
    } else if (
      selected_solutions.length === 1 &&
      selected_solutions[0] === undefined
    ) {
      selected_solutions = [0];
    } else if (
      state === State.ClassifySelected &&
      selected_solutions.length !== 1
    ) {
      selected_solutions = [selected_solutions[selected_solutions.length - 1]];
      selected_solutions = selected_solutions;
    }
  }

  $: {
    if (solutionProcess !== undefined) {
      if (
        visualizationChoiceState === VisualizationChoiceState.CurrentSolutions
      ) {
        solutions_to_visualize = solutionProcess[currentIteration].solutions;
      } else if (
        visualizationChoiceState === VisualizationChoiceState.SavedSolutions
      ) {
        solutions_to_visualize = getAllSolutions();
      } else if (
        visualizationChoiceState === VisualizationChoiceState.AllSolutions
      ) {
        solutions_to_visualize = getAllSolutions();
      }
    }
  }

  //
  // Index of currently highlighted solution.
  //
  // TODO: Highlighting not implemented. The highlight feature needs to be
  // added to the table component, and then this variable should be used to
  // connect the table and the visualization components.
  //
  // TODO: Would it be useful to be able to highlight multiple solutions? This
  // would require changes to the components.
  //
  // eslint-disable-next-line @typescript-eslint/no-unused-vars

  let visualizations_maximized = false;
  let visualizations_tab = 0;
  let gridded_visualizations = false;

  // Always use tab mode if not in maximized mode.
  $: if (!visualizations_maximized) {
    gridded_visualizations = false;
  }

  $: if (reference_solution !== undefined && state === State.ClassifySelected) {
    // we don't need maps for the base version of NIMBUS
    //get_maps(reference_solution);
  }

  /** The number of decimals to show for numeric values. */
  const decimals = 3;
  export function getAllSolutions(){
    const solution_list: Solution[] = []
    for (let i = 0; i < solution_process.length; i++) {
        const element = solution_process[i];
        solution_list.push(...element.solutions);
    }
    return solution_list
};

export function getObjectives(data: Solution[]):number[][]{
    const objective_values: number[][] = [];
    for (let index = 0; index < data.length; index++) {
        const element = data[index];
        objective_values.push(element.objective_values);   
    }
    return objective_values;
  }
  function press_final_button() {
    const modal: ModalSettings = {
      type: "confirm",
      // Data
      title: "Please Confirm",
      body: "Are you sure you wish to proceed?",
      // TRUE if confirm pressed, FALSE if cancel pressed
      response: (r: boolean) => {
        if (r) {
          handle_final_choice();
        } else {
          console.log("Cancelled");
        }
      },
    };
    modalStore.trigger(modal);
  }

  //
  // The handlers
  //

  //
  // TODO: Handle errors bettter.
  //
  function handle_initialize() {
      //
    
      // This is just a temporary solution to make it easier to test the UI
      // without having to run the backend. It should be removed later.

      //
      // This handler can be used to restart the solution process. It is probably
      // best to also reset the visualization mode to non-maximized.
      //
      visualizations_maximized = false;
      solutionProcess = solution_process
      problemInfo = RPP_Info;
      currentIteration = 0;
      preference = solutionProcess[currentIteration].reference_point;
      state = State.ClassifySelected;

      // TODO: Uncomment this when the backend is ready.
      //
      /*toastStore.trigger({
        // prettier-ignore
        message: "Oops! Something went wrong.",
        background: "variant-filled-error",
        timeout: 5000,
      });*/
      //console.error(err);
  }

  //
  // TODO: Handle errors better.
  //
  onMount(async () => {
    await handle_initialize();
  });

  function handle_iterate() {
        currentIteration = currentIteration + 1;
        preference = solutionProcess[currentIteration].reference_point;
        state = State.ClassifySelected;
        visualizationChoiceState = VisualizationChoiceState.CurrentSolutions;
        reference_solution = solutionProcess[currentIteration].solutions[0];
        selected_solutions = [0];
  }

  function handle_final_choice() {
    finalChoiceState = true;
  }
</script>

<div class="flex flex-col gap-10">
  {#if state === State.InitialLoad}
    <div class="grid grid-cols-2 items-start gap-10">
      <!-- <ProblemDetails {problem} /> -->
    </div>
  {:else}
    <NimbusLayout
      classify={state === State.ClassifySelected ? true : false}
      finalChoice={finalChoiceState}
    >
      <div slot="preferences">
        {#if problemInfo !== undefined && reference_solution !== undefined}
          <div class="preferences-bar">
            <TabGroup>
              <Tab bind:group={tabSet} name="tab1" value={0}  class="mb-0">
                <svelte:fragment slot="lead">Preferences</svelte:fragment>
              </Tab>
              <Tab bind:group={tabSet} name="tab2" value={1} class="mb-0">Analysis</Tab>
              <!-- Tab Panels --->
              <svelte:fragment slot="panel">
                {#if tabSet === 0}
                  <div>
                  
              <Input
                labelName="Maximum number of solutions to generate:"
                bind:value={numSolutions}
                onChange={() => {
                  if (numSolutions < MIN_NUM_SOLUTIONS) {
                    numSolutions = MIN_NUM_SOLUTIONS;
                  }
                  if (numSolutions > MAX_NUM_SOLUTIONS) {
                    numSolutions = MAX_NUM_SOLUTIONS;
                  }
                }}
              />
              <ClassificationPreference
              objective_long_names={problemInfo.objective_short_names}
              is_maximized={problemInfo.is_maximized}
              lower_bounds={problemInfo.lower_bounds}
              upper_bounds={problemInfo.upper_bounds}
              solutionValue={reference_solution.objective_values}
              previousValue={solutionProcess[currentIteration].reference_point}
              bind:preference
              decimalPrecision={3}
            />
            {#if state === State.ClassifySelected}
            <div class="flex gap-4">
              <button
                class="btn variant-filled inline"
                on:click={handle_iterate}
                disabled={!is_classification_valid}>Iterate</button
              >
              <button
                class="btn variant-filled inline"
                on:click={press_final_button}
                disabled={!(state === State.ClassifySelected)}
                >Finish with chosen solution</button
              >
            </div>
            {#if !is_classification_valid}
              <div class="text-error-500">
                Please give a valid classification for the objectives.
              </div>
            {/if}
          {:else}
            <GeneralError />
          {/if}
                  </div>
                {:else if tabSet === 1}
                <div>
                  <RadioGroup>
                    <RadioItem
                      bind:group={visualizationChoiceState}
                      name="justify"
                      value={VisualizationChoiceState.CurrentSolutions}
                      >Current solutions</RadioItem
                    >
                    <RadioItem
                      bind:group={visualizationChoiceState}
                      name="justify"
                      value={VisualizationChoiceState.SavedSolutions}
                      >Best candidate solutions</RadioItem
                    >
                    <RadioItem
                      bind:group={visualizationChoiceState}
                      name="justify"
                      value={VisualizationChoiceState.AllSolutions}
                      >All solutions</RadioItem
                    >
                  </RadioGroup>
        
                  {#if visualizationChoiceState === VisualizationChoiceState.CurrentSolutions}
                    <div>
                      Visualize solutions generated by NIMBUS in the latest iteration.
                    </div>
                  {:else if visualizationChoiceState === VisualizationChoiceState.SavedSolutions}
                    <div>Visualize best candidate solutions saved by you.</div>
                  {:else if visualizationChoiceState === VisualizationChoiceState.AllSolutions}
                    <div>Visualize all solutions generated by NIMBUS.</div>
                  {/if}
                  </div>
                {/if}
              </svelte:fragment>
            </TabGroup>
            

          

              </div>
        {/if}
      </div>
      <div slot="solutionSetChoice">
       <p>to be added</p>
      </div>
      <div slot="visualizations">
        {#if state === State.ClassifySelected && !finalChoiceState}
          <Card>
            <svelte:fragment slot="header">Objective Space</svelte:fragment>

            {#if problemInfo !== undefined && solutions_to_visualize !== undefined}
              <Visualizations
                names={problemInfo.objective_short_names}
                values={getObjectives(solutions_to_visualize)}
                lower_bounds={problemInfo.lower_bounds}
                upper_bounds={problemInfo.upper_bounds}
                lower_is_better={problemInfo.is_maximized.map(
                  (value) => !value
                )}
                grid_mode={gridded_visualizations}
                bind:selected={selected_solutions}
                bind:tab={visualizations_tab}
                max_selections={1}
              />
            {:else}
              <GeneralError />
            {/if}
          </Card>
        {:else if finalChoiceState}
          <Card>
            <svelte:fragment slot="header">Solution Explorer</svelte:fragment>

            {#if problemInfo !== undefined && reference_solution !== undefined}
              <ParallelCoordinatePlotBase
                names={problemInfo.objective_short_names}
                values={[reference_solution.objective_values]}
                ranges={transform_bounds(
                  problemInfo.lower_bounds,
                  problemInfo.upper_bounds
                )}
                lowerIsBetter={problemInfo.is_maximized.map((value) => !value)}
                showIndicators={true}
                disableInteraction={false}
              />
            {:else}
              <GeneralError />
            {/if}
          </Card>
        {/if}
      </div>
      <div slot="solutions">
        <Card>
          <svelte:fragment slot="header">Data View</svelte:fragment>
          <div class="flex flex-col gap-4">
            <div class="overflow-x-auto">
              {#if problemInfo !== undefined && solutions_to_visualize !== undefined}
                {#if !finalChoiceState}
                  <Table
                    head={problemInfo.objective_short_names}
                    body={solutions_to_visualize.map((solution) => {
                      return solution.objective_values.map((value) => value.toFixed(decimals));
                    })}
                    bind:selected_rows={selected_solutions}
                  />
                {:else if reference_solution !== undefined}
                  <Table
                    head={problemInfo.objective_short_names}
                    body={[reference_solution].map((solution) => {
                      return solution.objective_values.map((value) => value.toFixed(decimals));
                    })}
                  />
                {/if}
              {:else}
                <GeneralError />
              {/if}
            </div>
          </div>
        </Card>
      </div>
      <div slot="Map">
        <Card>
          <svelte:fragment slot="header"
            >Impact Overview</svelte:fragment
          >
          Impact plot
        </Card>
      </div>
    </NimbusLayout>
  {/if}
</div>
