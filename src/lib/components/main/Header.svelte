<script lang="ts">
  import User from "$lib/components/main/User.svelte";
  import { AppBar } from "@skeletonlabs/skeleton";
  import logo from "$lib/assets/logo.png";
</script>

<AppBar background="bg-black" class="text-white">

<svelte:fragment slot="lead"><a href="/"><img src={logo} width=24px height=24px alt=""/></a></svelte:fragment>
DESDEO	
<svelte:fragment slot="trail">
<User />
</svelte:fragment>
  
</AppBar>
