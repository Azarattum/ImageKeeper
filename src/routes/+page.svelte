<script lang="ts">
  import Backdrop from "$lib/ui/backdrop.svelte";
  import Upload from "../lib/ui/upload.svelte";
  import Button from "$lib/ui/button.svelte";
  import Image from "$lib/ui/image.svelte";
  import type { PageData } from "./$types";
  import Logo from "$lib/ui/logo.svelte";
  import Icon from "$lib/ui/icon.svelte";
  import { enhance } from "$app/forms";

  let editTarget = "";

  export let data: PageData;
  let pending = new Map<string, Image>();

  $: gallery = [...pending.values(), ...data.images].reduce((groups, image) => {
    const date = new Date((image as any).date || Date.now());
    const day = `${date.toLocaleString("en", {
      month: "long",
    })} '${date.getDate()}`;

    if (!groups.has(day)) groups.set(day, []);
    groups.get(day)!.push(image);
    return groups;
  }, new Map<string, Image[]>());

  function startUpload(images: Image[]) {
    images.forEach((x) => pending.set(x.src, x));
    pending = pending;
  }

  function progressUpload(status: { file: string; value: number }) {
    if (!pending.has(status.file)) return;
    pending.get(status.file)!.progress = status.value;
    pending = pending;
  }

  function completeUpload(keys: string[]) {
    keys.forEach((x) => (pending.delete(x), URL.revokeObjectURL(x)));
    pending = pending;
  }

  type Image = {
    progress?: number;
    caption?: string;
    date?: number;
    size: number;
    src: string;
  };
</script>

{#if data.images.length || pending.size}
  <header
    class="sticky bg-white z-40 top-0 flex justify-between pb-6 p-8 border-primary-200 border-b"
  >
    <div class="flex gap-4 flex-col">
      <Logo />
      <div class="text-sm text-primary-500">
        {data.images.length} images stored in keeper
      </div>
    </div>
    <Upload
      on:upload={({ detail }) => startUpload(detail)}
      on:progress={({ detail }) => progressUpload(detail)}
      on:complete={({ detail }) => completeUpload(detail)}
    />
  </header>

  <main class="p-8">
    {#each gallery as [day, images]}
      <div class="flex gap-4 pb-5">
        <h2 class="text-3xl text-primary-200">{day}</h2>
        <div class="text-xl text-white bg-action-green px-3 py-2 rounded">
          {images.length}
        </div>
      </div>
      <div class="flex gap-4 flex-wrap pb-10">
        {#each images as image}
          <Image
            on:edit={() => (editTarget = image.src)}
            interactive
            {...image}
          />
        {/each}
      </div>
    {/each}
  </main>
{:else}
  <div class="flex flex-col items-center justify-center h-screen">
    <Logo />
    <div class="h-3" />
    <h1 class="text-3xl text-primary-900">No images uploaded yet</h1>
    <div class="h-1" />
    <p class="text-primary-500 max-w-xl text-center">
      Upload your first image by drag and dropping the file on the screen or
      click the button below
    </p>
    <div class="h-2" />
    <Upload
      on:upload={({ detail }) => startUpload(detail)}
      on:progress={({ detail }) => progressUpload(detail)}
      on:complete={({ detail }) => completeUpload(detail)}
    />
  </div>
{/if}

{#if editTarget}
  <Backdrop interactive on:dismiss={() => (editTarget = "")}>
    <Button class="absolute top-8 right-8"
      ><Icon name="close" /> Close editor</Button
    >
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
    <form
      use:enhance={() => ((editTarget = ""), undefined)}
      method="post"
      action="?/caption"
      class="flex flex-col gap-7 items-center"
      on:click|stopPropagation
    >
      <h2 class="text-2xl text-primary-900">Set custom label</h2>
      <div class="flex flex-col gap-5">
        <Image src={editTarget} />
        <div class="flex flex-col gap-3">
          <input type="hidden" name="src" value={editTarget} />
          <!-- svelte-ignore a11y-autofocus -->
          <input
            class="text-center bg-transparent text-lg text-accent-800 focus-visible:outline-none"
            type="text"
            autofocus={true}
            name="caption"
            maxlength="100"
            on:keypress|stopPropagation
          />
          <p class="text-sm text-primary-500">100 chars max</p>
        </div>
      </div>
      <Button><Icon name="tick" /> Save</Button>
    </form>
  </Backdrop>
{/if}
