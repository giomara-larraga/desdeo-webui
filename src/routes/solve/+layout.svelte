<script lang="ts">
  import { methodHeaderText } from "$lib/api";
    import Header from "$lib/components/main/Header.svelte";
  import Navigation from "$lib/components/main/Navigation.svelte";
  import User from "$lib/components/main/User.svelte";
  import { AppShell } from "@skeletonlabs/skeleton";
</script>

<AppShell slotPageContent="p-4 pt-2">
  <svelte:fragment slot="header"><Header /></svelte:fragment>
  <svelte:fragment slot="sidebarLeft"><Navigation /></svelte:fragment>

  <slot />
</AppShell>
