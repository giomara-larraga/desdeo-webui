<script lang="ts">
  import { baseURL, get_access_token, get_all_problems } from "$lib/api";
  import {
    login_status,
    LoginStatus,
    methodHeaderText,
    selectedProblem,
    selectedMethod,
    type Problem,
  } from "$lib/api";

  import { goto } from "$app/navigation";

  async function fetchUserDetails() {
    try {
      const res = await fetch(`${baseURL}/test/userdetails`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + get_access_token(),
        },
      });
      const data = await res.json();
      console.log(data);
    } catch (error) {
      console.error("Error:", error);
    }
  }

  fetchUserDetails();

  function go_to_hri_nimbus() {
    selectedMethod.set("nimbus");
    selectedProblem.set(7);
    methodHeaderText.set("NIMBUS");

    goto("/solve");
  }
  function go_to_hri_nautilus() {
    selectedMethod.set("nautnavi");
    selectedProblem.set(7);
    methodHeaderText.set("NAUTILUS Navigator");

    goto("/solve");
  }
</script>

<div class="flex flex-col gap-4 p-2">
  <h1 class="font-bold">Welcome to DESDEO</h1>
  <button
    class="anchor"
    on:click={() => {
      go_to_hri_nimbus();
    }}>Test NIMBUS</button
  >
  <button
  class="anchor"
  on:click={() => {
    go_to_hri_nautilus();
  }}>Test NAUTILUS Navigator</button
>
</div>
