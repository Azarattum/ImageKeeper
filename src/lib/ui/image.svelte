<script lang="ts">
  import { createEventDispatcher, onMount } from "svelte";
  import Button from "./button.svelte";
  import Icon from "./icon.svelte";
  import Action from "./action.svelte";

  const empty = "data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs%3D";

  export let interactive = false;
  export let vertical = false;
  export let progress = 1;
  export let caption = "";
  export let src = empty;
  export let size = 0;

  let img: HTMLImageElement;

  const dispatch = createEventDispatcher<{
    download: void;
    edit: void;
  }>();

  function format(bytes: number) {
    if (bytes === 0) return "0b";
    const k = 1024;
    const sizes = ["b", "kb", "mb", "gb", "tb", "pb"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return ~~(bytes / Math.pow(k, i)) + sizes[i];
  }
</script>

<figure class="w-max relative pt-5">
  {#if caption}
    <figcaption
      class="top-1 max-w-md right-3 bg-action-yellow text-primary-900 p-2 rounded-sm absolute z-30 text-sm"
    >
      {caption}
    </figcaption>
  {/if}
  <div
    class="relative w-max rounded overflow-hidden grid [&>*]:col-start-1 [&>*]:row-start-1 items-center justify-items-center bg-primary-100"
  >
    <img
      bind:this={img}
      {src}
      draggable="false"
      loading="lazy"
      class="h-4 object-cover z-10 {vertical ? 'w-1' : 'w-2'}"
      alt="uploaded content"
    />
    <div class="absolute inset-0 bg-primary-100 animate-pulse z-0" />
    {#if progress < 1 && interactive}
      <div class="w-full h-full bg-primary-100/60 z-20" />
      <div
        class="w-full h-full bg-primary-100/60 z-30 origin-left transition-transform will-change-transform"
        style:transform="scaleX({progress * 100}%)"
      />
      <div class="w-max text-center flex flex-col gap-2 z-40">
        <h3 class="text-xl text-primary-900 top-1/2">Uploading</h3>
        <div class="text-sm text-primary-500">
          {format(progress * size)} of {format(size)}
        </div>
      </div>
    {:else if src !== empty && interactive}
      <div
        class="opacity-0 hover:opacity-100 transition-opacity z-20 text-action-yellow flex text-lg flex-col gap-4 w-full h-full absolute bg-black/40 justify-end p-5"
      >
        <a href={src} download>
          <Button air on:click={() => dispatch("download")}>
            <Icon name="download" /> Download
          </Button>
        </a>
        <Button air on:click={() => dispatch("edit")}>
          <Icon name="edit" /> Edit title
        </Button>
        <Action name="delete" data={{ src }}>
          <Icon name="delete" /> Delete
        </Action>
      </div>
    {/if}
  </div>
</figure>
