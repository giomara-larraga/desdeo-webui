<script lang="ts">
  import type { Problem } from "$lib/api";

  export let problems: Problem[];
  export let selected_problem: Problem | undefined = undefined;
  export let hide_saved = false;

  import { TabGroup, Tab } from "@skeletonlabs/skeleton";
  import ProblemList from "./ProblemList.svelte";
  import ProblemDetails from "./ProblemDetails.svelte";
  import Card from "./Card.svelte";

  /*
   * The active tab. The default is to show the problems provided by DESDEO
   * because saving problems is not yet supported.
   */
  let tab = 0;
</script>

<div class="grid grid-cols-2 gap-10">
  <TabGroup>
    <Tab bind:group={tab} name="desdeo" value={0}
      >Problems provided by DESDEO</Tab
    >
    {#if !hide_saved}
      <Tab bind:group={tab} name="saved" value={1}>Your saved problems</Tab>
    {/if}

    <svelte:fragment slot="panel">
      {#if tab === 0}
        <Card>
          <ProblemList {problems} bind:selected_problem />
        </Card>
      {:else if tab === 1}
        Saving problems is not yet supported. Please take a look at the
        <button
          class="anchor"
          on:click={() => {
            tab = 1;
          }}>problems provided by DESDEO</button
        >.
      {/if}
    </svelte:fragment>
  </TabGroup>
  {#if selected_problem}
    <ProblemDetails problem={selected_problem} />
  {/if}
</div>
