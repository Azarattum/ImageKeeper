<script lang="ts">
  import { enhance } from "$app/forms";
  import Button from "./button.svelte";

  export let name: string;
  export let data: Record<string, string> = {};
</script>

<form action="?/{name}" method="POST" use:enhance>
  {#each Object.entries(data) as [name, value]}
    <input type="hidden" {name} {value} />
  {/each}
  <Button air><slot /></Button>
</form>
