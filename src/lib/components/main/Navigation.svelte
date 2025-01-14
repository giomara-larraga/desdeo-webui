<script>
  import { page } from "$app/stores";
  //import { show_extra_menu } from "$lib/stores";
  //import logo from "$lib/assets/logo.png";
  import NavigationTile from "$lib/components/main/NavigationTile.svelte";
  import { setContext } from "svelte";
  import PlayIcon from "~icons/heroicons/play";
  import PuzzlePiece from "~icons/heroicons/puzzle-piece";
  import StopIcon from "~icons/heroicons/stop";

  //
  // Navigation tiles get the `active` and `hover` styles from the context,
  // unless they are explicitly given as props.
  //
  setContext("active", "bg-secondary-500");
  setContext("hover", "hover:bg-secondary-500/50");
</script>

<!--
  TODO: Use the theme system instead of hardcoded colors?
-->
<div class="h-full container-nav">
  <div class="flex flex-col items-center nav-bar">
    <!-- <NavigationTile
      
      href="/"
      selected={$page.url.pathname === "/"}
      text={["DESDEO"]}
    >
      <img src={logo} alt="" />
    </NavigationTile> -->
    <NavigationTile
      href="/saved_problems"
      selected={$page.url.pathname === "/saved_problems"}
      text={["Problem"]}
    >
      <PuzzlePiece />
    </NavigationTile>

    <NavigationTile
      href="/solve"
      selected={$page.url.pathname === "/solve"}
      text={["Solve"]}
    >
      <PlayIcon />
    </NavigationTile>
    <!-- {#if $show_extra_menu}
    <NavigationTile
      href="/solve"
      selected={$page.url.pathname === "/new_problem"}
      text={["X"]}
    >
      <StopIcon />
    </NavigationTile> 
    {/if}-->
    <!--  <NavigationTile
      href="/new_problem"
      selected={$page.url.pathname === "/new_problem"}
      text={["New", "problem"]}
    >
      <PlusIcon />
    </NavigationTile> -->
  </div>
</div>
