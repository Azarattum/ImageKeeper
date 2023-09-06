<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import { fade } from "svelte/transition";

  const dispatch = createEventDispatcher<{ dismiss: void }>();
  export let interactive = false;
</script>

<button
  transition:fade={{ duration: 150 }}
  class="fixed flex justify-center items-center top-0 left-0 z-50 w-screen h-screen bg-white/80 backdrop-blur"
  class:pointer-events-none={!interactive}
  on:mouseup|self={() => dispatch("dismiss")}
  on:touchend|self={() => dispatch("dismiss")}
>
  <slot />
</button>
