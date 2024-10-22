<script lang="ts">
  export let classify = true;
  export let finalChoice = false;
  export let voteChoice = false;
</script>

<!-- 3-column grid layout -->
<div class="grid-layout">
  <!-- Preferences (full height, first column) -->
  <div class="preferences">
    <slot name="preferences" />
  </div>

  <!-- Visualizations (spans 2 rows in second column) -->
  <div class="visualizations">
    <div class="slot-content">
      <slot name="visualizations" />
    </div>
  </div>

  <!-- Solutions (scrollable, bottom of second column) -->
  <div class="scrollable">
    <div class="slot-content"><slot name="solutions" /></div>
  </div>
</div>

<style>
  .preferences {
    grid-row: span 2;
    background-color: rgba(9, 66, 119, 0.06);
    padding: 0rem;
    padding-left: 0.5rem;
    padding-right: 0.5rem;
  }
  .visualizations {
    padding: 1rem;
    padding-bottom: 0;
    /* background-color: #e0e0ff; */
    height: 100%;
  }
  .grid-layout {
    display: grid;
    grid-template-columns: 1fr 3fr; /* 2 columns: 1fr (sidebar) 3fr (content) */
    grid-template-rows: 1fr 1fr; /* 2 rows: 1fr for each row */
    gap: 10px; /* Gap between grid items */
    height: calc(100vh - 48px); /* Full viewport height */
  }

  .slot-content {
    width: 100%;
    height: 100%;
    display: flex;
  }

  .scrollable {
    padding-top: 0;
    padding: 1rem;
    /* background-color: #ffe0e0; */
    overflow-y: auto; /* Enable scrolling */
    height: 100%;
  }

  slot {
    flex: 1;
    display: flex;
  }

  .visualizations,
  .scrollable {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
  }

  /* Responsive layout */
  @media (min-width: 1024px) {
    /* For larger screens */
    .grid-2-cols {
      grid-template-columns: 1fr 3fr; /* 2 columns */
      grid-template-rows: 1fr 1fr; /* 3 rows */
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
