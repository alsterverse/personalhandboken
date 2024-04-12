<script>
  import { useChat } from "ai/svelte";

  const { input, handleSubmit, messages } = useChat();
</script>

<svelte:head>
  <title>Hem</title>
  <meta name="description" content="ai chatbot" />
</svelte:head>

<section>
  <h1>personalhandboken</h1>
  <ul>
    {#each $messages as message}
      <li>{message.role}: {message.content}</li>
    {/each}
  </ul>
  <form on:submit={handleSubmit}>
    <input bind:value={$input} />
    <button type="submit">Skicka</button>
  </form>
</section>

<style>
  section {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    flex: 0.6;
  }

  h1 {
    width: 100%;
  }
</style>
