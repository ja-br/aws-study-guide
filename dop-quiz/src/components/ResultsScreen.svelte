<script>
  import { DOMAINS } from '../data/domains.js';
  import { quiz } from '../lib/state.svelte.js';

  const totalCorrect = $derived(
    Object.values(quiz.results).reduce((s, r) => s + r.correct, 0)
  );
  const totalQuestions = $derived(quiz.queue.length);
  const pct = $derived(
    totalQuestions > 0 ? Math.round((totalCorrect / totalQuestions) * 100) : 0
  );

  const domainsInQuiz = $derived(
    [...new Set(quiz.queue.map(q => q.domain))].sort((a, b) => a - b)
  );

  function getDomainBreakdown(domainNum) {
    const domain = DOMAINS[domainNum];
    const domainServices = quiz.queue.filter(q => q.domain === domainNum).map(q => q.service);
    const uniqueServices = [...new Set(domainServices)];
    let domainCorrect = 0, domainTotal = 0;
    uniqueServices.forEach(svcId => {
      const r = quiz.results[svcId];
      if (r) { domainCorrect += r.correct; domainTotal += r.total; }
    });
    if (domainTotal === 0) return null;
    const ratio = domainCorrect / domainTotal;
    return { domain, domainCorrect, domainTotal, ratio, uniqueServices };
  }

  function scoreClass(ratio) {
    if (ratio === 1) return 'perfect';
    if (ratio === 0) return 'zero';
    return 'partial';
  }

  function barColor(ratio, domainColor) {
    if (ratio === 0) return 'var(--text-muted, #888)';
    return domainColor;
  }
</script>

<div>
  <div class="header"><h1>Quiz Complete</h1></div>
  <div class="results-score">
    <div class="big">{totalCorrect} / {totalQuestions}</div>
    <div class="pct">{pct}% correct</div>
  </div>
  <div class="breakdown-title">Per-Domain Breakdown</div>
  <div class="breakdown-grid">
    {#each domainsInQuiz as domainNum (domainNum)}
      {@const bd = getDomainBreakdown(domainNum)}
      {#if bd}
        <div class="domain-breakdown-header">
          <span class="domain-num" style:background={bd.domain.bg} style:color={bd.domain.color}>D{domainNum}</span>
          <span class="domain-breakdown-name">{bd.domain.name}</span>
          <div class="breakdown-bar-wrap">
            <div class="breakdown-bar" style:width="{Math.round(bd.ratio * 100)}%" style:background={barColor(bd.ratio, bd.domain.color)}></div>
          </div>
          <span class="breakdown-score {scoreClass(bd.ratio)}">{bd.domainCorrect}/{bd.domainTotal}</span>
        </div>

        {#each bd.uniqueServices as svcId (svcId)}
          {@const r = quiz.results[svcId]}
          {#if r && r.total > 0}
            {@const ratio = r.correct / r.total}
            <div class="breakdown-row">
              <span class="service-badge" style:background={bd.domain.bg} style:color={bd.domain.color} style:flex="1">{svcId}</span>
              <div class="breakdown-bar-wrap">
                <div class="breakdown-bar" style:width="{Math.round(ratio * 100)}%" style:background={barColor(ratio, bd.domain.color)}></div>
              </div>
              <span class="breakdown-score {scoreClass(ratio)}">{r.correct}/{r.total}</span>
            </div>
          {/if}
        {/each}
      {/if}
    {/each}
  </div>
  <div class="results-actions">
    {#if quiz.missedQuestions.length > 0}
      <button class="btn-ghost" onclick={() => quiz.requeueMissed()}>Re-quiz {quiz.missedQuestions.length} Missed</button>
    {/if}
    <button class="btn-primary" onclick={() => quiz.restart()}>&larr; Back to Menu</button>
  </div>
</div>
