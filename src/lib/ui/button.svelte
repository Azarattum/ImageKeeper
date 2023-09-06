<script lang="ts">
  export let air = false;
  export let disabled = false;
  export let type: HTMLButtonElement["type"] = "submit";
  export let tag: "button" | "div" = "button";
</script>

<svelte:element
  this={tag}
  role="button"
  tabindex="0"
  on:click
  {type}
  {disabled}
  class="{$$props.class} select-none w-max transition-all rounded active:scale-95 flex items-center
  {air
    ? 'gap-2 origin-left'
    : 'gap-4 hover:bg-action-green p-4 bg-primary-200 ' +
      (disabled ? 'text-primary-500 pointer-events-none' : 'text-accent-800')}"
>
  <slot />
</svelte:element>
