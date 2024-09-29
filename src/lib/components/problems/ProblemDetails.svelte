<script lang="ts">
  import {
    Tab,
    TabGroup,
    Table,
    tableMapperValues,
  } from "@skeletonlabs/skeleton";
  import type { Problem } from "$lib/api";

  export let problem: Problem;
  let tab = 0;

  $: objectives = {
    head: ["Name", "Goal", "Ideal", "Nadir"],
    body: tableMapperValues(
      problem.objectives.map(({ name, minimize, ideal, nadir }) => ({
        name,
        goal: minimize ? "minimize" : "maximize",
        ideal,
        nadir,
      })),
      ["name", "goal", "ideal", "nadir"]
    ),
  };

  $: variables = {
    head: ["Name", "Upper bound", "Lower bound", "Type"],
    body: tableMapperValues(
      problem.variables.map(({ name, upperbound, lowerbound, type }) => ({
        name,
        upperbound,
        lowerbound,
        type,
      })),
      ["name", "upperbound", "lowerbound", "type"]
    ),
  };
</script>

<div class="flex flex-col gap-2">
  <TabGroup>
    <Tab bind:group={tab} name="general" value={0}>General Information</Tab>
    <Tab bind:group={tab} name="objectives" value={1}>Objectives</Tab>
    <Tab bind:group={tab} name="variables" value={2}>Variables</Tab>
    <Tab bind:group={tab} name="constraints" value={3}>Constraints</Tab>
    <svelte:fragment slot="panel">
      {#if tab === 0}
        <div><span>Name:</span> {problem.name}</div>
        <div><span>Description:</span>-</div>
        <div><span>Type:</span>-</div>
        <div><span>Approximate version:</span>-</div>
        <div><span>Surrogate:</span>-</div>
      {:else if tab === 1}
        <Table source={objectives} />
      {:else if tab === 2}
        <Table source={variables} />
      {:else if tab === 3}
        <div class="underline">Constraints:</div>
      {/if}
    </svelte:fragment>
  </TabGroup>
</div>
