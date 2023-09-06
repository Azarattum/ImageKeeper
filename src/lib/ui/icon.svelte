<script lang="ts">
  const icons = import.meta.glob("../icons/*.svg", { eager: true, as: "raw" });
  export let name: keyof typeof icons;
  export let size = 24;

  const svg = icons["../icons/" + name + ".svg"];
</script>

<svg
  width="{size}px"
  height="{size}px"
  viewBox="0 0 24 24"
  class={$$props.class}
>
  {@html svg}
</svg>
