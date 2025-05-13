<script lang="ts">
  import { methodHeaderText } from "$lib/api";
  import Navigation from "$lib/components/main/Navigation.svelte";
  import User from "$lib/components/main/User.svelte";
  import { AppBar, AppShell, Avatar } from "@skeletonlabs/skeleton";
  import logo from "$lib/assets/logo.png";

  import { PowerIcon } from "lucide-svelte";
  import * as Menubar from "$lib/components_shadcdn/ui/menubar";

</script>

<AppShell
  slotPageContent="p-20 bg-white flex-row overflow-y-auto h-full"
>
<!--   <svelte:fragment slot="sidebarLeft"><Navigation /></svelte:fragment>
 -->  <svelte:fragment slot="header">
 <div class="flex h-12 w-full items-center justify-between bg-primary text-white px-2 md:px-4">
      <div class="flex items-center gap-2">
        <a href="/" class="flex items-center gap-2">
          <PowerIcon className="h-6 w-6" />
          <span class="text-lg font-bold hidden sm:block">DESDEO </span> <span>| {$methodHeaderText}</span>
        </a>
      </div>
      <div class="flex gap-1">
        <Menubar.Root class="bg-primary text-white border-none">
  <Menubar.Menu>
    <Menubar.Trigger>Problem</Menubar.Trigger>
    <Menubar.Content>
      <Menubar.Item>
        List of problems
          <Menubar.Shortcut>⌘T</Menubar.Shortcut>
        </Menubar.Item>
        <Menubar.Item>Add new problem</Menubar.Item>
      </Menubar.Content>
    </Menubar.Menu>

    <Menubar.Menu>
    <Menubar.Trigger>User</Menubar.Trigger>
    <Menubar.Content>
      <Menubar.Item>
        Settings 
      </Menubar.Item>
      <Menubar.Item>
        Log out 
      </Menubar.Item>
    </Menubar.Content>
  </Menubar.Menu>
      <Menubar.Menu>
    <Menubar.Trigger>Help</Menubar.Trigger>
    <Menubar.Content>
      <Menubar.Item>
        Get started
      </Menubar.Item>
      <Menubar.Item>
        About DESDEO
      </Menubar.Item>
    </Menubar.Content>
  </Menubar.Menu>
  </Menubar.Root>
        
      </div>
    </div>
  </svelte:fragment>
  <slot />
</AppShell>
