<script lang="ts">
    /**
     * Emoji component that can display emoji from different platforms
     * currently just supports discord emojis and unicode emojis
     */
    type Props =
        { discord: `<:${string}:${number}>` } |
        { unicode: string };

    const props: Props = $props();

    const discord = "discord" in props ? props.discord : undefined;
    const unicode = "unicode" in props ? props.unicode : undefined;

    const discordEmojiId = $derived.by(() => {
        if (!discord) return undefined;
        if (/^\d+$/.test(discord)) return discord;
        return discord.split(":")[2].split(">")[0];
    });

    const discordEmojiUrl = $derived.by(() => {
        if (!discordEmojiId) return undefined;
        return `https://cdn.discordapp.com/emojis/${discordEmojiId}.png`;
    });
</script>

<div class="emoji">
    
    {#if unicode}
        <span>{unicode}</span>
    {/if}

    {#if discord}
        {@const emojiId = discord.split(":")[2].split(">")[0]}
        <img src={`https://cdn.discordapp.com/emojis/${emojiId}.png`} alt="Discord emoji" />
    {/if}

</div>

<style>
    .emoji {
        display: inline-block;
        width: 1em;
        height: 1em;
        vertical-align: -0.1em;
    }
</style>