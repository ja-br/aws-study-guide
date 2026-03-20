<script>
  import { flash } from './lib/state.svelte.js';
  import MenuScreen from './components/MenuScreen.svelte';
  import PlayScreen from './components/PlayScreen.svelte';
  import ResultsScreen from './components/ResultsScreen.svelte';
</script>

{#if flash.screen === 'menu'}
  <MenuScreen />
{:else if flash.screen === 'play'}
  <PlayScreen />
{:else if flash.screen === 'results'}
  <ResultsScreen />
{/if}
