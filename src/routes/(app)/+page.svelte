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

  function go_to_xaimoo() {
    selectedMethod.set("reference_point_method");
    selectedProblem.set(3);
    methodHeaderText.set("Reference point method");

    goto("/solve");
  }
</script>

<div class="flex flex-col gap-4">
  <h1 class="font-bold">Welcome to DESDEO</h1>
  <p class="max-w-prose">
    You are now logged in to DESDEO. You can now solve multi-objective
    optimization problems using the DESDEO framework.
  </p>
  <button
    class="anchor"
    on:click={() => {
      go_to_xaimoo();
    }}>Test explanations</button
  >
</div>
