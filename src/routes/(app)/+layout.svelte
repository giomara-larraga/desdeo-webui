<script lang="ts">
  import { AppShell } from "@skeletonlabs/skeleton";
  import Navigation from "$lib/components/main/Navigation.svelte";
  import Header from "$lib/components/main/Header.svelte";
  import { drawerStore } from "@skeletonlabs/skeleton";
</script>

<AppShell slotPageContent="p-8 pt-8" slotPageHeader="bg-white shadow-md">
  <svelte:fragment slot="header"><Header /></svelte:fragment>
  <svelte:fragment slot="sidebarLeft"><Navigation /></svelte:fragment>
  <slot />
</AppShell>

<!-- <button
  class="btn variant-filled-tertiary fixed bottom-0 right-0"
  on:click={() => {
    drawerStore.open();
  }}>How to cite DESDEO?</button
> -->
