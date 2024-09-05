<script lang="ts">
  export let classify = true;
  export let finalChoice = false;
  export let voteChoice = false;
</script>

<style>
  .grid-layout {
    display: grid;
    gap: 10px;
    height: calc(100vh - 80px); /* Full viewport height */
  }

  .scrollable {
    overflow-y: auto; /* Enable scrolling */
  }

  .no-scroll {
    overflow: hidden; /* Disable scrolling */
  }

  /* Responsive layout */
  @media (min-width: 1024px) {
    /* For larger screens */
    .grid-3-cols {
      grid-template-columns: 1fr 2fr 1fr; /* 3 columns */
      grid-template-rows: 1fr 1fr 1fr; /* 3 rows */
    }

    .grid-2-cols {
      grid-template-columns: 1fr 2fr; /* 2 columns */
    }
  }

  @media (max-width: 1024px) {
    /* For smaller screens (less than 1024px width) */
    .grid-3-cols {
      grid-template-columns: 1fr; /* Stack all columns */
      grid-template-rows: auto;
    }

    .grid-2-cols {
      grid-template-columns: 1fr; /* Stack all columns */
    }
  }
</style>

{#if classify && !finalChoice && !voteChoice}
  <!-- 3-column grid layout -->
  <div class="grid-layout grid-3-cols">
    <!-- Preferences (full height, first column) -->
    <div class="row-span-3 no-scroll">
      <slot name="preferences" />
    </div>

    <!-- Visualizations (spans 2 rows in second column) -->
    <div class="row-span-2 no-scroll">
      <slot name="visualizations" />
    </div>

    <!-- Solutions (scrollable, bottom of second column) -->
    <div class="col-span-2 col-start-2 row-start-3 scrollable">
      <slot name="solutions" />
    </div>

    <!-- Solution Set Choice (top right) -->
    <div class="col-start-3 row-start-1 no-scroll">
      <slot name="solutionSetChoice" />
    </div>

    <!-- Map (middle right) -->
    <div class="col-start-3 row-start-2 no-scroll">
      <slot name="Map" />
    </div>
  </div>

{:else if !finalChoice && !voteChoice}
  <!-- 2-column layout -->
  <div class="grid-layout grid-2-cols">
    <div class="flex flex-col gap-10 no-scroll">
      <slot name="preferences" />
    </div>
    <div class="flex flex-col gap-10 scrollable">
      <slot name="solutionSetChoice" />
      <slot name="solutions" />
      <slot name="visualizations" />
    </div>
  </div>

{:else}
  <!-- Another 2-column layout -->
  <div class="grid-layout grid-2-cols">
    <div class="flex flex-col gap-10 no-scroll">
      <slot name="visualizations" />
      <slot name="solutions" />
    </div>
    <div class="flex flex-col gap-10 no-scroll">
      <slot name="Map" />
    </div>
  </div>
{/if}
