<div class="flex flex-col bg-white p-2 mt-0 ml-4 mr-4 mb-4 shadow-lg border-gray-400 {$$props.class ?? ''}">
  {#if $$slots.header || $$slots.buttons}
    <header class="mb-4 flex justify-between gap-4">
      <span class="font-bold">
        <slot name="header" />
      </span>
      <div class="flex gap-2">
        <slot name="buttons" />
      </div>
    </header>
  {/if}
  <slot />
  {#if $$slots.footer}
    <footer class="mt-4">
      <slot name="footer" />
    </footer>
  {/if}
</div>
