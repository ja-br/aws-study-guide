<script>
  import { flash } from '../lib/state.svelte.js';

  const total = $derived(flash.known.length + flash.learning.length);
</script>

<div class="screen">
  <div class="inner">
    <div class="score-display">
      <div class="pct">{flash.pct}%</div>
      <div class="pct-label">cards mastered</div>
    </div>

    <h2>Session Complete!</h2>
    <p class="subtitle">{total} cards reviewed</p>

    <div class="stat-boxes">
      <div class="stat-box">
        <div class="stat-num green">{flash.known.length}</div>
        <div class="stat-label">Got It</div>
      </div>
      <div class="stat-box">
        <div class="stat-num red">{flash.learning.length}</div>
        <div class="stat-label">Still Learning</div>
      </div>
    </div>

    <div class="btn-row">
      {#if flash.learning.length > 0}
        <button class="btn-danger" onclick={() => flash.reStudy()}>
          Re-study {flash.learning.length} Missed Cards
        </button>
      {/if}
      <button class="btn-restart" onclick={() => flash.restart()}>
        Shuffle &amp; Restart
      </button>
      <button class="btn-ghost" onclick={() => flash.screen = 'menu'}>
        Back to Menu
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
    max-width: 480px;
    width: 100%;
    text-align: center;
  }

  .score-display {
    margin-bottom: 28px;
  }

  .pct {
    font-size: 4.5rem;
    font-weight: 700;
    color: var(--accent);
    line-height: 1;
  }

  .pct-label {
    color: var(--text-muted);
    font-size: 14px;
    margin-top: 8px;
  }

  h2 {
    color: var(--font-color);
    font-size: 28px;
    margin-bottom: 8px;
  }

  .subtitle {
    color: var(--text-muted);
    font-size: 15px;
    margin-bottom: 32px;
  }

  .stat-boxes {
    display: flex;
    gap: 16px;
    justify-content: center;
    margin-bottom: 40px;
  }

  .stat-box {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 0;
    padding: 20px 32px;
    flex: 1;
  }

  .stat-num {
    font-size: 36px;
    font-weight: 700;
  }
  .stat-num.green { color: var(--green); }
  .stat-num.red   { color: var(--red); }

  .stat-label {
    color: var(--text-muted);
    font-size: 13px;
    margin-top: 4px;
  }

  .btn-row {
    display: flex;
    gap: 12px;
    justify-content: center;
    flex-wrap: wrap;
  }
</style>
