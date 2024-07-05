<script lang="ts">
  import User from "$lib/components/main/User.svelte";
  import { AppBar } from "@skeletonlabs/skeleton";
  import logo from "$lib/assets/logo.png";
</script>

<!-- <div class="flex justify-end p-2">
  <User />
</div> -->

<AppBar background="bg-black">
  <svelte:fragment slot="lead">
    <div class="icon-wrapper" style="padding-left: 1rem;">
      <img src={logo} class="icon" alt="logo" />
    </div></svelte:fragment
  >

  <svelte:fragment slot="trail"><User /></svelte:fragment>
</AppBar>
