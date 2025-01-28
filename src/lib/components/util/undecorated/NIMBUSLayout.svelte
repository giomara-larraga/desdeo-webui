<script lang="ts">
  export let classify = true;
  export let finalChoice = false;

  export let voteChoice = false;
  export let drawMap = true;
</script>

{#if classify && !finalChoice && !voteChoice}
  <div class="grid-layout">
    <div class="preferences">
      <slot name="preferences" />
      <!-- <slot name="solutions" /> -->
    </div>
    <div class="flex flex-col gap-2">
      <slot name="solutionSetChoice" />
      <slot name="visualizations" />
      <slot name="solutions" />

      {#if drawMap}
        <slot name="Map" />
      {/if}
    </div>
  </div>
{:else if !finalChoice && !voteChoice}
  <div class="grid grid-cols-2 items-start gap-10">
    <div class="preferences">
      <slot name="preferences" />
    </div>
    <div class="flex flex-col gap-10">
      <slot name="solutionSetChoice" />
      <slot name="solutions" />
      <slot name="visualizations" />
    </div>
  </div>
{:else}
  <div class="grid grid-cols-2 items-start gap-10">
    <div class="flex flex-col gap-10">
      <slot name="visualizations" />
      <slot name="solutions" />
    </div>
    {#if drawMap}
      <div class="flex flex-col gap-10">
        <slot name="Map" />
      </div>
    {/if}
  </div>
{/if}

<style>
  .preferences {
    grid-row: span 3;
    background-color: rgba(9, 66, 119, 0.06);
    padding: 0rem;
    padding-left: 0.5rem;
    padding-right: 0.5rem;
    min-width: 600px;
  }
  .grid-layout {
    display: grid;
    grid-template-columns: 1fr 3fr; /* 2 columns: 1fr (sidebar) 3fr (content) */
    grid-template-rows: 1fr 1fr 1fr; /* 2 rows: 1fr for each row */
    gap: 5px; /* Gap between grid items */
    height: calc(100vh - 48px); /* Full viewport height */
  }
  slot {
    flex: 1;
    display: flex;
  }
</style>
