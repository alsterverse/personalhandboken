<script>
  import { useChat } from "ai/svelte";

  const { input, handleSubmit, messages } = useChat();
</script>

<svelte:head>
  <title>Personalhandboken</title>
  <meta name="description" content="ai chatbot" />
</svelte:head>

<section>
  <h1>personalhandboken</h1>
  <ul>
    {#each $messages as message}
      <li>{message.role}: {message.content}</li>
    {/each}
  </ul>
  <form on:submit={handleSubmit} class="form">
    <input bind:value={$input} class="form-input" />
    <button type="submit" class="form-button">Skicka</button>
  </form>
</section>

<style>
  section {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    flex: 0.6;
  }

  h1 {
    width: 100%;
    text-align: start;
  }

  .form {
    display: flex;
    gap: 1rem;
  }

  .form-input {
    padding: 0.5rem;
    border: none;
    border-radius: 20px;
    background-color: #fff;
    color: #333;
  }

  .form-button {
    padding: 0.5rem 1rem;
    border: none;
    border-radius: 20px;
    background-color: #4d545b;
    color: #fff;
    cursor: pointer;
    transition: background-color 0.3s ease;
  }

  .form-button:hover {
    background-color: #242424;
  }
</style>
