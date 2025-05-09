<script lang="ts">
    export let width = 500;
    export let height = 300;
    export let margin = { top: 20, right: 20, bottom: 30, left: 40 };
  </script>
  
  <svg width={width} height={height}>
    <g transform={`translate(${margin.left},${margin.top})`}>
      <slot />
    </g>
  </svg>