<script lang="ts">
  export let x = 0; // X position of the tooltip
  export let y = 0; // Y position of the tooltip
  export let content = ""; // Content to display in the tooltip
  export let visible = false; // Whether the tooltip is visible
</script>

<style>
  .tooltip {
    position: absolute;
    background-color: white;
    border: 1px solid none;
    border-radius: 4px;
    padding: 10px;
    /*font-size: 12px;*/
    pointer-events: none;
    white-space: nowrap;
    box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.2);
  }
</style>

{#if visible}
  <div
    class="tooltip"
    style="top: {y}px; left: {x}px; transform: translate(-50%, -100%);"
  >
    {content}
  </div>
{/if}