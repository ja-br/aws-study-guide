<script>
  import { DOMAINS } from '../data/domains.js';
  import { shuffle } from '../lib/utils.js';
  import { quiz } from '../lib/state.svelte.js';

  const letters = ['A', 'B', 'C', 'D'];

  let feedbackText = $state('');
  let feedbackClass = $state('');
  let buttonStates = $state([]);

  // $derived.by() caches and only re-runs when dependencies change;
  // shuffle() non-determinism is fine — it runs once per question advance.
  const shuffled = $derived.by(() => {
    const q = quiz.currentQuestion;
    // Register as dependencies so derivation re-runs on question advance and re-quiz
    const _idx = quiz.currentIdx;
    const _round = quiz.round;
    if (!q) return { options: [], correctIdx: -1 };

    const indices = shuffle(q.options.map((_, i) => i));
    return {
      options: indices.map((origIdx, i) => ({
        text: q.options[origIdx],
        letter: letters[i],
        idx: i,
      })),
      correctIdx: indices.indexOf(0),
    };
  });

  // Side effect: reset UI state when question changes
  $effect(() => {
    const len = shuffled.options.length;
    feedbackText = '';
    feedbackClass = '';
    buttonStates = Array(len).fill('');
  });

  function handleSelect(chosenIdx) {
    if (quiz.answered) return;
    const isCorrect = chosenIdx === shuffled.correctIdx;
    quiz.recordAnswer(isCorrect);

    buttonStates = shuffled.options.map((_, i) => {
      if (i === shuffled.correctIdx) return 'correct';
      if (i === chosenIdx && !isCorrect) return 'wrong';
      return '';
    });

    if (isCorrect) {
      feedbackText = 'Correct!';
      feedbackClass = 'correct';
    } else {
      feedbackText = 'Incorrect';
      feedbackClass = 'wrong';
    }
  }

  const question = $derived(quiz.currentQuestion);
  const domain = $derived(question ? DOMAINS[question.domain] : null);
  const accentColor = $derived(domain ? domain.color : '#3b82f6');
  const accentBg = $derived(domain ? domain.bg : 'rgba(59,130,246,0.15)');
  const progress = $derived(quiz.progress);
  const progressPct = $derived(progress.total > 0 ? (progress.current / progress.total) * 100 : 0);

  function handleKeydown(e) {
    if (e.target.closest('button')) return;

    if (!quiz.answered && ['1', '2', '3', '4'].includes(e.key)) {
      const idx = parseInt(e.key) - 1;
      if (idx < shuffled.options.length) {
        e.preventDefault();
        handleSelect(idx);
      }
    }
    if (quiz.answered && (e.key === 'Enter' || e.key === ' ')) {
      e.preventDefault();
      quiz.advanceQuestion();
    }
  }
</script>

<svelte:window onkeydown={handleKeydown} />

<div style:--accent={accentColor} style:--accent-bg={accentBg}>
  {#if question}
    <div class="quiz-header">
      <div class="quiz-domain-label" style:color={accentColor}>
        {domain ? `Domain ${question.domain}: ${domain.name}` : ''}
      </div>
      <div class="progress-row">
        <span class="progress-label">{progress.current} / {progress.total}</span>
        <div class="progress-bar">
          <div class="progress-fill" style:width="{progressPct}%"></div>
        </div>
      </div>
      <span class="q-badge" style:background={accentBg} style:color={accentColor}>{question.service}</span>
      <div class="q-text" role="heading" aria-level="2">{question.q}</div>
    </div>

    <div class="options-grid">
      {#each shuffled.options as opt (opt.text)}
        <button
          class="option-btn {buttonStates[opt.idx]}"
          disabled={quiz.answered}
          onclick={() => handleSelect(opt.idx)}
        >
          <span class="option-letter">{opt.letter}</span>
          <span>{opt.text}</span>
        </button>
      {/each}
    </div>

    <div class="explanation-box" class:visible={quiz.answered} style:border-left-color={accentColor} aria-live="polite">
      {#if quiz.answered}
        <div class="explanation-label">Explanation</div>
        <div>{question.explanation || ''}</div>
      {/if}
    </div>

    <div class="quiz-footer">
      {#if feedbackText}
        <span class="feedback-text {feedbackClass}" aria-live="polite">{feedbackText}</span>
      {/if}
      {#if quiz.answered}
        <button class="btn-next" onclick={() => quiz.advanceQuestion()}>
          Next &rarr;
        </button>
      {/if}
    </div>

    <div class="kbd-hint">
      <kbd class="kbd">1</kbd><kbd class="kbd">2</kbd><kbd class="kbd">3</kbd><kbd class="kbd">4</kbd> to select &nbsp;&middot;&nbsp;
      <kbd class="kbd">Enter</kbd> / <kbd class="kbd">Space</kbd> to advance
    </div>
  {/if}
</div>
