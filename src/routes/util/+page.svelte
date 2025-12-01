<script lang="ts">
    import { onMount } from "svelte";
    import { compile } from "mdsvex";

    let iso = $state(new Date().toISOString());

    onMount(() => {
        const interval = setInterval(() => {
            iso = new Date().toISOString();
        }, 1000);
        return () => clearInterval(interval);
    });

//     let title = $state("");
//     let content = $state("");

//     const outputText = $derived(`---
// title: ${title}
// ---

// ${content}
// `);

//     const outputContent = $derived.by(async () => {
//         return await compile(outputText);
//     })
</script>

<!-- <div>
    <input type="text" bind:value={title} />
    <textarea bind:value={content}></textarea>
    <code> {outputText} </code>

    {#await outputContent}
        <p>Loading...</p>
    {:then content} 
        <p>Loaded</p>
        {@html content?.code}
        
    {/await}
</div> -->


<span>{iso}</span>