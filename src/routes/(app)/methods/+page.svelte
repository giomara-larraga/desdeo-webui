<script lang="ts">
  import ProblemDetails from "$lib/components/problems/ProblemDetails.svelte";
  import Card from "$lib/components/general/Card.svelte";
  import type { Problem } from "$lib/api";

  let methods = [
    // {
    //   id: "nautilus_navigator",
    //   display: "Nautilus Navigator",
    // },
    {
      id: "nimbus",
      display: "NIMBUS",
    },
    {
      id: "nautnavi",
      display: "NAUTILUS Navigator",
    },
    /* {
      id: "reference_point_method",
      display: "Reference Point Method",
    }, */
  ];

  export let problem: Problem;
  export let selected_method: string | undefined = undefined;
</script>

<h4 class="h4">Optimization Methods</h4>
<p class="pb-2 pt-1 text-sm">
  Here you can select one of the problems available in DESDEO to start
  optimizing. According to the selected problem, you will be able to select the
  most suitable method according to the types of preferences you want to
  utilize.
</p>
<div class="grid grid-cols-2 items-start gap-10">
  <Card>
    <svelte:fragment slot="header">Available methods</svelte:fragment>
    <select
      class="select"
      bind:value={selected_method}
      size={Math.max(3, methods.length)}
    >
      {#each methods as method}
        <option value={method.id}>{method.display}</option>
      {/each}
    </select>
  </Card>
</div>
