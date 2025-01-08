<script lang="ts">
  import { writable } from "svelte/store";
  import { setContext } from "svelte";
  import type { LoginContext } from "./types";
  import logo from "$lib/assets/logo.png";
  import main_image from "$lib/assets/main.jpg";
  import Citation from "$lib/components/main/Citation.svelte";

  //
  // The `login` context is used to share the current values of the username
  // and password inputs between the login form and the registration form.
  // The point is to preserve these values if the user switches from one form
  // to the other.
  //
  setContext<LoginContext>("login", {
    username: writable(""),
    password: writable(""),
  });
</script>

<div class="grid h-screen grid-cols-[1fr_auto]">
  <div class="p-8 bg-cover bg-center" 
  style={`background: url(${main_image}), rgba(9, 66, 119, 0.5); background-blend-mode: darken;  background-size: cover;
  background-position: 100%;`}>
    <div class="flex items-center gap-2">
      <img src={logo} alt="" />
      <span class="text-xl font-bold">DESDEO</span>
    </div>
    <div class="mx-28 flex h-full items-center">
      <div class="max-w-2xl">
        <h1 class="font-bold leading-snug text-white text-6xl"  style="text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.8); ">
          Enabling Better Decision Making
        </h1>
        <Citation show_bibtex_button={true} />
      </div>
    </div>
  </div>

  <div class="flex flex-col justify-center bg-white px-8 py-8">
    <slot />
  </div>
</div>
