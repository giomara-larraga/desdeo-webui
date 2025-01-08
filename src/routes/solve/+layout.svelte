<script lang="ts">
  import { methodHeaderText } from "$lib/api";
  import Navigation from "$lib/components/main/Navigation.svelte";
  import User from "$lib/components/main/User.svelte";
  import { AppBar, AppShell } from "@skeletonlabs/skeleton";
  import logo from "$lib/assets/logo.png";

</script>

<AppShell
  slotPageContent="p-20 bg-white flex-row overflow-y-auto h-full"
>
  <svelte:fragment slot="sidebarLeft"><Navigation /></svelte:fragment>
  <svelte:fragment slot="header">
    <AppBar background="bg-black" class="text-white">
      <svelte:fragment slot="lead"><a href="/">
        <img src={logo} width=24px height=24px alt=""/></a>
      </svelte:fragment>
      {$methodHeaderText}      
      <svelte:fragment slot="trail"><User /></svelte:fragment>
    </AppBar>
  </svelte:fragment>
  <slot />
</AppShell>
