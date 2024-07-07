<script lang="ts">
  import { get_all_problems } from "$lib/api";

  import ListProblems from "$lib/components/main/ListProblems.svelte";
  import Waiting from "$lib/components/util/undecorated/Waiting.svelte";
  import GeneralError from "$lib/components/util/undecorated/GeneralError.svelte";
</script>

{#await get_all_problems()}
  <Waiting>
    <span slot="label">Loading problems...</span>
  </Waiting>
{:then problems}
  <ListProblems {problems} />
{:catch err}
  <GeneralError {err} />
{/await}
