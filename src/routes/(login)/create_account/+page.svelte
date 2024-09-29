<script lang="ts">
  import RegistrationForm from "$lib/components/general/RegistrationForm.svelte";
  import { getContext } from "svelte";
  import type { LoginContext } from "../types";

  const { username, password } = getContext<LoginContext>("login");
</script>

<RegistrationForm bind:username={$username} bind:password={$password} />
