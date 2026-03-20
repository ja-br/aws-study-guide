<script>
  import { flash } from '../lib/state.svelte.js';

  function handleKey(e) {
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      flash.flipped = !flash.flipped;
    }
    if (e.key === 'ArrowRight' && flash.flipped) flash.mark('know');
    if (e.key === 'ArrowLeft' && flash.flipped) flash.mark('learn');
  }
</script>

<svelte:window onkeydown={handleKey} />

<div class="screen">
  <!-- Top Bar -->
  <div class="top-bar">
    <button class="back-btn" onclick={() => flash.screen = 'menu'}>
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M19 12H5M12 19l-7-7 7-7"/>
      </svg>
      Menu
    </button>
    <div class="counter">{flash.idx + 1} / {flash.deck.length}</div>
  </div>

  <!-- Progress Bar -->
  <div class="progress-track">
    <div class="progress-fill" style="width: {flash.progress}%; background: {flash.colors.accent};"></div>
  </div>

  {#if flash.card}
  <!-- Domain Badge -->
  <div class="badge" style="border-color: {flash.colors.accent};">
    <div class="badge-dot" style="background: {flash.colors.accent};"></div>
    <span class="badge-text" style="color: {flash.colors.accent};">
      Domain {flash.card.domain}: {flash.card.cat}
    </span>
  </div>

  <!-- Card -->
  <div
    class="fc-card"
    class:slide-right={flash.animDir === 'right'}
    class:slide-left={flash.animDir === 'left'}
    onclick={() => !flash.isAnimating && (flash.flipped = !flash.flipped)}
    role="button"
    tabindex="0"
    onkeydown={(e) => e.key === 'Enter' && !flash.isAnimating && (flash.flipped = !flash.flipped)}
  >
    <div class="fc-inner" class:flipped={flash.flipped}>
      <!-- Front -->
      <div class="fc-front" style="background: var(--surface); border: 1px solid {flash.colors.accent};">
        <div class="card-label" style="color: {flash.colors.accent};">Question</div>
        <p class="card-text">{flash.card.q}</p>
        <div class="reveal-hint">
          Tap to reveal <span class="kbd">Space</span>
        </div>
      </div>
      <!-- Back -->
      <div class="fc-back" style="background: var(--surface); border: 1px solid {flash.colors.accent}44;">
        <div class="card-label" style="color: {flash.colors.accent};">Answer</div>
        <p class="card-text answer-text">{flash.card.a}</p>
      </div>
    </div>
  </div>

  <!-- Mark Buttons -->
  <div class="actions" class:active={flash.flipped}>
    <button
      class="mark-btn"
      onclick={() => flash.mark('learn')}
      style="background: var(--red-dim); color: var(--red); border-color: rgba(255,60,116,0.3);"
    >
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
        <path d="M18 6L6 18M6 6l12 12"/>
      </svg>
      Still Learning
      <span class="kbd" style="border-color: rgba(255,60,116,0.3); color: rgba(255,60,116,0.5);">←</span>
    </button>
    <button
      class="mark-btn"
      onclick={() => flash.mark('know')}
      style="background: var(--green-dim); color: var(--green); border-color: rgba(34,197,94,0.3);"
    >
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
        <path d="M20 6L9 17l-5-5"/>
      </svg>
      Got It
      <span class="kbd" style="border-color: rgba(34,197,94,0.3); color: rgba(34,197,94,0.5);">→</span>
    </button>
  </div>

  <!-- Score Strip -->
  <div class="score-strip">
    <span style="color: var(--green);">{flash.known.length} known</span>
    <span style="color: var(--border);">|</span>
    <span style="color: var(--red);">{flash.learning.length} learning</span>
  </div>
  {/if}
</div>

<style>
  .screen {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 20px 20px 40px;
  }

  .top-bar {
    width: 100%;
    max-width: 560px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 12px;
  }

  .back-btn {
    background: none;
    border: none;
    color: var(--text-muted);
    cursor: pointer;
    font-size: 14px;
    font-family: inherit;
    display: flex;
    align-items: center;
    gap: 6px;
  }
  .back-btn:hover { color: var(--font-color); }

  .counter {
    font-size: 13px;
    color: var(--text-muted);
  }

  .progress-track {
    width: 100%;
    max-width: 560px;
    height: 6px;
    border-radius: 0;
    background: var(--border);
    margin-bottom: 24px;
    overflow: hidden;
  }

  .progress-fill {
    height: 100%;
    border-radius: 0;
    transition: width 0.4s ease;
  }

  .badge {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    background: var(--surface);
    border: 1px solid;
    padding: 4px 12px;
    border-radius: 0;
    margin-bottom: 20px;
  }

  .badge-dot {
    width: 6px;
    height: 6px;
    border-radius: 0;
    flex-shrink: 0;
  }

  .badge-text {
    font-size: 11px;
    letter-spacing: 1.5px;
    text-transform: uppercase;
  }

  .card-label {
    font-size: 10px;
    letter-spacing: 2px;
    text-transform: uppercase;
    margin-bottom: 20px;
  }

  .card-text {
    color: var(--font-color);
    font-size: 20px;
    line-height: 1.55;
    font-weight: 500;
  }

  .answer-text {
    font-size: 17px;
    line-height: 1.65;
    font-weight: 400;
  }

  .reveal-hint {
    margin-top: auto;
    padding-top: 24px;
    color: var(--text-muted);
    font-size: 12px;
    text-align: center;
  }

  .actions {
    display: flex;
    gap: 16px;
    margin-top: 28px;
    opacity: 0.25;
    pointer-events: none;
    transition: opacity 0.3s;
  }
  .actions.active {
    opacity: 1;
    pointer-events: auto;
  }

  .score-strip {
    display: flex;
    gap: 24px;
    margin-top: 24px;
    font-size: 13px;
  }
</style>
