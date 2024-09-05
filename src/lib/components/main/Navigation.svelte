<script>
  import { page } from "$app/stores";
  //import logo from "$lib/assets/logo.png";
  //import NavigationTile from "$lib/components/main/NavigationTile.svelte";
  //import { setContext } from "svelte";
  import IconHeroiconsSolidPuzzlePiece from "~icons/heroicons-solid/puzzle-piece";
  import IconHeroiconsSolidRectangleGroup from "~icons/heroicons-solid/rectangle-group";
  import IconHeroiconsSolidPlay from "~icons/heroicons-solid/play";
  import IconHeroiconsSolidInbox from "~icons/heroicons-solid/inbox";
  import IconHeroiconsQuestionMarkCircle from "~icons/heroicons-solid/question-mark-circle";
  import IconHeroiconsSolidUserCircle from "~icons/heroicons-solid/user-circle";
  import { AppRail, AppRailAnchor } from "@skeletonlabs/skeleton";

  let currentTile = 0;
</script>

<!--
  TODO: Use the theme system instead of hardcoded colors?
-->

<AppRail class="nav-bar">
  <!--   <svelte:fragment slot="lead">
    <AppRailAnchor href="/dashboard" title="Account">
      <div class="icon-wrapper">
        <img src={logo} class="icon" alt="logo" />
      </div>
    </AppRailAnchor>
  </svelte:fragment> -->
  <!-- --- -->
  <AppRailAnchor
    href="/list_problems"
    selected={$page.url.pathname === "/list_problems"}
    bind:group={currentTile}
    name="tile-1"
    value={0}
    title="tile-1"
  >
    <svelte:fragment slot="lead">
      <div class="icon-wrapper">
        <IconHeroiconsSolidPuzzlePiece class="icon" />
      </div>
    </svelte:fragment>
    <span>Problems</span>
  </AppRailAnchor>
  <AppRailAnchor
    href="/methods"
    selected={$page.url.pathname === "/methods"}
    bind:group={currentTile}
    name="tile-2"
    value={1}
    title="tile-2"
  >
    <svelte:fragment slot="lead">
      <div class="icon-wrapper">
        <IconHeroiconsSolidRectangleGroup class="icon" />
      </div>
    </svelte:fragment>
    <span>Methods</span>
  </AppRailAnchor>
  <AppRailAnchor
    href="/solve"
    selected={$page.url.pathname === "/solve"}
    bind:group={currentTile}
    name="tile-3"
    value={2}
    title="tile-3"
  >
    <svelte:fragment slot="lead">
      <div class="icon-wrapper">
        <IconHeroiconsSolidPlay class="icon" />
      </div>
    </svelte:fragment>
    <span>Solve</span>
  </AppRailAnchor>
  <AppRailAnchor
    href="/archive"
    selected={$page.url.pathname === "/archive"}
    bind:group={currentTile}
    name="tile-3"
    value={2}
    title="tile-3"
  >
    <svelte:fragment slot="lead">
      <div class="icon-wrapper">
        <IconHeroiconsSolidInbox class="icon" />
      </div>
    </svelte:fragment>
    <span>Archive</span>
  </AppRailAnchor>
  <AppRailAnchor
    href="/help"
    selected={$page.url.pathname === "/help"}
    bind:group={currentTile}
    name="tile-3"
    value={2}
    title="tile-3"
  >
    <svelte:fragment slot="lead">
      <div class="icon-wrapper">
        <IconHeroiconsQuestionMarkCircle class="icon" />
      </div>
    </svelte:fragment>
    <span>Help</span>
  </AppRailAnchor>
  <!-- --- -->
  <svelte:fragment slot="trail">
    <AppRailAnchor href="/" target="_blank" title="Account">
      <div class="icon-wrapper">
        <IconHeroiconsSolidUserCircle class="icon" />
      </div>
    </AppRailAnchor>
  </svelte:fragment>
</AppRail>
