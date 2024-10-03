<script lang="ts">
  import { get_all_problems } from "$lib/api";
  import { type Problem } from "$lib/api";
  import Waiting from "$lib/components/util/undecorated/Waiting.svelte";
  import GeneralError from "$lib/components/util/undecorated/GeneralError.svelte";
  import { TabGroup, Tab } from "@skeletonlabs/skeleton";
  import ProblemList from "$lib/components/problems/ProblemList.svelte";
  import ProblemDetails from "$lib/components/problems/ProblemDetails.svelte";
  import Card from "$lib/components/general/Card.svelte";
  import { goto } from "$app/navigation";

  let selected_problem: Problem | undefined = undefined;
  let tab = 0;
  export let hide_saved = true;

  function handleClick() {
    goto("/methods");
  }
</script>

<h4 class="h4">Optimization Problems</h4>
<p class="pb-2 pt-1 text-sm">
  Here you can select one of the problems available in DESDEO to start
  optimizing. According to the selected problem, you will be able to select the
  most suitable method according to the types of preferences you want to
  utilize.
</p>
{#await get_all_problems()}
  <Waiting>
    <span slot="label">Loading problems...</span>
  </Waiting>
{:then problems}
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
  <div class="flex justify-center pt-2">
    <button class="variant-filled-primary btn mr-1">Add new problem</button>
    <button
      class="variant-filled-primary btn"
      on:click={handleClick}
      disabled={(() => {
        return selected_problem?.id == undefined;
      })()}>Proceed to select a method</button
    >
  </div>
{:catch err}
  <GeneralError {err} />
{/await}
