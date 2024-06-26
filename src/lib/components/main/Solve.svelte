<script lang="ts">
  //
  // TODO: Perhaps it would be more convenient to store the available problems,
  // the selected problem, and the selected method using stores and Svelte's
  // Context API?
  //

  import { login_status, LoginStatus } from "$lib/api";
  import type { Problem } from "$lib/api";

  export let problems: Problem[];

  import { TabGroup, Tab } from "@skeletonlabs/skeleton";
  import SelectProblem from "./SelectProblem.svelte";
  import SelectMethod from "./SelectMethod.svelte";
  import SolveProblem from "./SolveProblem.svelte";
  import GeneralError from "../util/undecorated/GeneralError.svelte";
  import Button from "../../../stories/Button.svelte";

  let tab = 0;
  let selected_problem: Problem | undefined = undefined;
  let selected_method = "";
</script>

<!-- <TabGroup>
  <Tab bind:group={tab} name="select_problem" value={0}>1. Select a problem</Tab
  >
  {#if selected_problem}
    <Tab bind:group={tab} name="select_method" value={1}>2. Select a method</Tab
    >
  {/if}
  {#if selected_problem && selected_method}
    <Tab bind:group={tab} name="solve_problem" value={2}
      >3. Solve the problem</Tab
    >
  {/if} -->

<h3 class="h3">Optimization Problems</h3>
<div>Please select a problem.</div>
<SelectProblem
  {problems}
  bind:selected_problem
  hide_saved={$login_status !== LoginStatus.LoggedInAsUser}
/>
<button
  type="button"
  class="btn variant-filled-primary"
  disabled={!selected_problem}>Proceed to select a method</button
>

<!-- </TabGroup> -->
