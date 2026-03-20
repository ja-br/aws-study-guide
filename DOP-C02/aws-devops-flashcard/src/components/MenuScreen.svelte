<script>
  import { flash } from '../lib/state.svelte.js';
  import { CARDS } from '../data/cards.js';
  import { DOMAIN_COLORS, DOMAIN_NAMES } from '../data/domains.js';

  const domains = [1, 2, 3, 4, 5, 6];

  const DOMAIN_CARD_COUNTS = Object.fromEntries(
    [1,2,3,4,5,6].map(d => [d, CARDS.filter(c => c.domain === d).length])
  );
</script>

<div class="screen">
  <div class="inner">
    <div class="header">
      <div class="eyebrow">AWS Certified</div>
      <h1>DevOps Engineer<br/><span class="accent">Flash Cards</span></h1>
      <p class="subtitle">{CARDS.length} cards across all 6 exam domains · DOP-C02</p>
    </div>

    <div class="domain-section">
      <div class="domain-header-row">
        <span class="section-label">Select domains to study</span>
        <button
          class="toggle-all"
          onclick={() => flash.selectedDomains.size === 6 ? flash.deselectAll() : flash.selectAll()}
        >
          {flash.selectedDomains.size === 6 ? 'Deselect All' : 'Select All'}
        </button>
      </div>

      <div class="domain-grid">
        {#each domains as d}
          {@const active = flash.selectedDomains.has(d)}
          {@const c = DOMAIN_COLORS[d]}
          <div
            class="domain-chip"
            role="checkbox"
            aria-checked={active}
            tabindex="0"
            onclick={() => flash.toggleDomain(d)}
            onkeydown={(e) => (e.key === 'Enter' || e.key === ' ') && flash.toggleDomain(d)}
            style="background: {active ? 'var(--surface)' : 'var(--background-color)'}; border-color: {active ? c.accent : 'var(--border)'};"
          >
            <div class="dot" style="background: {active ? c.accent : 'var(--border)'};"></div>
            <div>
              <div class="domain-name">D{d}: {DOMAIN_NAMES[d]}</div>
              <div class="domain-count">{DOMAIN_CARD_COUNTS[d]} cards</div>
            </div>
          </div>
        {/each}
      </div>
    </div>

    <div class="start-row">
      <button
        class="btn-primary"
        disabled={flash.selectedDomains.size === 0}
        onclick={() => flash.startGame()}
      >
        Study {flash.cardCount} Cards
      </button>
    </div>
  </div>
</div>

<style>
  .screen {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 20px;
  }

  .inner {
    max-width: 560px;
    width: 100%;
  }

  .header {
    text-align: center;
    margin-bottom: 48px;
  }

  .eyebrow {
    font-size: 13px;
    letter-spacing: 4px;
    color: var(--accent);
    margin-bottom: 12px;
    text-transform: uppercase;
  }

  h1 {
    font-size: 38px;
    font-weight: 700;
    color: var(--font-color);
    line-height: 1.15;
    margin-bottom: 8px;
  }

  .accent { color: var(--accent); }

  .subtitle {
    color: var(--text-muted);
    font-size: 15px;
    margin-top: 12px;
  }

  .domain-section {
    margin-bottom: 36px;
  }

  .domain-header-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;
  }

  .section-label {
    color: var(--font-color);
    font-size: 14px;
    font-weight: 500;
  }

  .toggle-all {
    background: none;
    border: 1px solid var(--border);
    border-radius: 0;
    color: var(--text-muted);
    padding: 6px 14px;
    font-size: 12px;
    font-family: inherit;
    cursor: pointer;
    transition: opacity 0.15s;
  }
  .toggle-all:hover { opacity: 0.85; }

  .domain-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 10px;
  }

  .dot {
    width: 8px;
    height: 8px;
    border-radius: 0;
    flex-shrink: 0;
  }

  .domain-name {
    color: var(--font-color);
    font-size: 13px;
    font-weight: 600;
  }

  .domain-count {
    color: var(--text-muted);
    font-size: 11px;
    margin-top: 2px;
  }

  .start-row {
    text-align: center;
  }
</style>
