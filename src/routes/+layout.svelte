<script>
  import "./styles.css";
</script>

<div class="app">
  <img src="logo.png" alt="Logo" class="logo" />
  <main>
    <slot />
  </main>
</div>

<style>
  .app {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    min-height: 100vh;
    background-color: #0f1217;
    color: white;
    text-align: left;
  }

  .logo {
    position: absolute;
    top: 50px;
    left: 50px;
    width: 120px;
  }

  main {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    padding-top: 200px;
    padding-left: 100px;
    padding-right: 100px;
    line-height: 140%;
  }
</style>
