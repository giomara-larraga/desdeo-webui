<script lang="ts">
  //
  // TODO: Perhaps it would be more convenient to store the available problems,
  // the selected problem, and the selected method using stores and Svelte's
  // Context API?
  //

  import {
    login_status,
    LoginStatus,
    //methodHeaderText,
    //selectedProblem,
    type Problem,
  } from "$lib/api";

  export let problems: Problem[];

  //import { goto } from "$app/navigation";
  //import { Tab, TabGroup } from "@skeletonlabs/skeleton";
  //import GeneralError from "../util/undecorated/GeneralError.svelte";
  //import SelectMethod from "./SelectMethod.svelte";
  import SelectProblem from "./SelectProblem.svelte";
  //import Button from "../../../stories/Button.svelte";

  //let tab = 0;
  let selected_problem: Problem | undefined = undefined;
  //let selected_method = "";

  /*function goto_solve() {
    console.log("selected_problem", selected_problem);

    if (selected_method === "nimbus") {
      methodHeaderText.set("NIMBUS");
    } else if (selected_method === "nautnavi") {
      methodHeaderText.set("NAUTILUS Navigator");
    } else {
      throw new Error("No method selected yet.");
    }
    console.log("selected_method", selected_method);

    if (selected_problem?.id !== undefined) {
      selectedProblem.set(selected_problem.id);
    } else {
      throw new Error("No problem selected yet.");
    }
    goto("/solve");
  }*/
</script>

<h4 class="h4">Optimization Problems</h4>
<p class="pb-2 pt-1 text-sm">
  Here you can select one of the problems available in DESDEO to start
  optimizing. According to the selected problem, you will be able to select the
  most suitable method according to the types of preferences you want to
  utilize.
</p>
<SelectProblem
  {problems}
  bind:selected_problem
  hide_saved={$login_status !== LoginStatus.LoggedInAsUser}
/>
<div class="flex justify-center pt-2">
  <button class="variant-filled-primary btn mr-1">Add new problem</button>
  <button
    class="variant-filled-primary btn"
    disabled={(() => {
      return selected_problem?.id == undefined;
    })()}>Proceed to select a method</button
  >
</div>
