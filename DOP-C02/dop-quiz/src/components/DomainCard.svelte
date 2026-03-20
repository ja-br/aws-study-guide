<script>
  import { DOMAINS } from '../data/domains.js';
  import { quiz, questionCounts, domainQuestionCounts } from '../lib/state.svelte.js';

  let { domainNum, services } = $props();

  const domain = $derived(DOMAINS[domainNum]);
  const domainQCount = $derived(domainQuestionCounts[domainNum] || 0);

  const isChecked = $derived(
    services.length > 0
      ? services.every(s => quiz.selectedServices.has(s.id))
      : quiz.selectedDomains.has(domainNum)
  );

  const isExpanded = $derived(quiz.expandedDomains.has(domainNum));

  function handleHeaderClick() {
    if (services.length === 0) {
      quiz.toggleDomain(domainNum);
      return;
    }
    quiz.toggleExpanded(domainNum);
  }

  function handleHeaderKeydown(e) {
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      handleHeaderClick();
    }
  }

  function handleCheckboxClick(e) {
    e.stopPropagation();
    quiz.toggleDomain(domainNum);
  }
</script>

<div class="domain-card" style:--domain-color={domain.color}>
  <div
    class="domain-header"
    class:checked={isChecked}
    role="checkbox"
    aria-checked={isChecked}
    aria-expanded={isExpanded}
    aria-label="Domain {domainNum}: {domain.name} - {domainQCount} questions"
    tabindex="0"
    onclick={handleHeaderClick}
    onkeydown={handleHeaderKeydown}
  >
    <div class="domain-checkbox" aria-hidden="true" onclick={handleCheckboxClick}>
      <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
        <path d="M2 6l3 3 5-5" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    </div>
    <span class="domain-num" style:background={domain.bg} style:color={domain.color}>D{domainNum}</span>
    <span class="domain-name">{domain.name}</span>
    <span class="domain-count">{domainQCount}q</span>
    <span class="domain-expand" class:open={isExpanded}>&#9660;</span>
  </div>

  {#if services.length > 0 && isExpanded}
    <div class="domain-services">
      {#each services as svc (svc.id)}
        {@const svcChecked = quiz.selectedServices.has(svc.id)}
        <div
          class="service-row"
          class:checked={svcChecked}
          style:--domain-color={domain.color}
          role="checkbox"
          aria-checked={svcChecked}
          tabindex="0"
          onclick={() => quiz.toggleService(svc.id)}
          onkeydown={(e) => { if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); quiz.toggleService(svc.id); } }}
        >
          <div class="service-checkbox" aria-hidden="true">
            <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
              <path d="M2 6l3 3 5-5" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>
          <span class="service-badge" style:background={domain.bg} style:color={domain.color}>{svc.id}</span>
          <span class="service-count">{questionCounts[svc.id] || 0}q</span>
        </div>
      {/each}
    </div>
  {/if}
</div>
