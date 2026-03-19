<script>
  import { DOMAINS } from '../data/domains.js';
  import { SERVICES } from '../data/services.js';
  import DomainCard from './DomainCard.svelte';
  import { quiz, servicesByDomain } from '../lib/state.svelte.js';

  const domainNums = Object.keys(DOMAINS).map(Number);

  const allSelected = $derived(quiz.selectedServices.size === SERVICES.length);
  const toggleLabel = $derived(allSelected ? 'Deselect All' : 'Select All');
</script>

<div>
  <div class="header">
    <h1>DOP-C02 Quiz</h1>
    <p>Select domains and services to study</p>
  </div>
  <div class="menu-grid">
    {#each domainNums as domainNum (domainNum)}
      <DomainCard {domainNum} services={servicesByDomain[domainNum] || []} />
    {/each}
  </div>
  <div class="menu-actions">
    <button class="btn-ghost" onclick={() => allSelected ? quiz.deselectAll() : quiz.selectAll()}>{toggleLabel}</button>
    <button class="btn-primary" disabled={!quiz.canStart} onclick={() => quiz.startQuiz()}>Start Quiz</button>
  </div>
</div>
