<script lang="ts">
  import { applyAction, deserialize } from "$app/forms";
  import { invalidateAll } from "$app/navigation";
  import type { ActionResult } from "@sveltejs/kit";
  import { createEventDispatcher } from "svelte";
  import Backdrop from "./backdrop.svelte";
  import Button from "./button.svelte";
  import Icon from "./icon.svelte";

  const dispatch = createEventDispatcher<{
    upload: { progress: number; size: number; src: string }[];
    progress: { file: string; value: number };
    complete: string[];
  }>();
  let input: HTMLInputElement;
  let form: HTMLFormElement;
  let over = false;

  async function upload(event: DragEvent | Event) {
    over = false;
    if ("dataTransfer" in event) input.files = event.dataTransfer?.files!;
    const data = new FormData(form);
    const files = data.getAll("images").map((x) => ({
      src: URL.createObjectURL(x as File),
      size: (x as File).size,
      progress: 0,
    }));

    dispatch("upload", files);

    let last = 0;
    const result = await new Promise<ActionResult>((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.upload.addEventListener("progress", (e) => {
        let left = e.loaded;
        const current = files.findIndex(
          (x) => left < x.size || ((left -= x.size), false)
        );
        if (!~current) return;
        if (last !== current) {
          dispatch("progress", { file: files[last].src, value: 1 });
          last = current;
        }
        dispatch("progress", {
          file: files[current].src,
          value: left / files[current].size,
        });
      });
      xhr.addEventListener("load", () => {
        if (xhr.status !== 200) reject(xhr.status);
        else resolve(deserialize(xhr.responseText));
      });
      xhr.open("POST", form.action, true);
      xhr.send(data);
    });

    if (result.type === "success") await invalidateAll();
    dispatch(
      "complete",
      files.map((x) => x.src)
    );
    applyAction(result);
  }
</script>

<form
  method="POST"
  action="?/upload"
  class="flex gap-3"
  enctype="multipart/form-data"
  on:submit|preventDefault={upload}
  bind:this={form}
>
  <label>
    <input
      multiple
      type="file"
      name="images"
      class="hidden"
      required
      bind:this={input}
      on:change={upload}
    />
    <Button type="button" tag="div">
      <Icon name="upload" /> Upload image
    </Button>
  </label>
  <noscript>
    <Button class="hidden [label:has(input:valid)+noscript>&]:block">
      <Icon name="tick" />
    </Button>
  </noscript>
</form>

{#if over}
  <Backdrop>
    <div class="flex flex-col gap-4 w-full h-full justify-center items-center">
      <Icon name="upload" size={80} class="text-action-green" />
      <h2 class="text-3xl text-primary-900">Upload file</h2>
      <div class="text-primary-500">Drop your file here to start uploading</div>
    </div>
  </Backdrop>
{/if}

<svelte:window
  on:dragleave|preventDefault={() => (over = false)}
  on:dragover|preventDefault={() => (over = true)}
  on:drop|preventDefault={upload}
/>
