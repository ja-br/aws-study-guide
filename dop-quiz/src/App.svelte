<script>
  import MenuScreen from './components/MenuScreen.svelte';
  import QuizScreen from './components/QuizScreen.svelte';
  import ResultsScreen from './components/ResultsScreen.svelte';
  import { quiz } from './lib/state.svelte.js';
</script>

{#if quiz.screen === 'menu'}
  <MenuScreen />
{:else if quiz.screen === 'quiz'}
  <QuizScreen />
{:else if quiz.screen === 'results'}
  <ResultsScreen />
{/if}
