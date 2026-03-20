import { DOMAINS } from '../data/domains.js';
import { SERVICES } from '../data/services.js';
import { QUESTIONS } from '../data/questions.js';
import { shuffle, toggleInSet, validateQuestions } from './utils.js';

// Precomputed lookups
export const servicesByDomain = {};
Object.keys(DOMAINS).forEach(d => { servicesByDomain[d] = []; });
SERVICES.forEach(s => {
  if (servicesByDomain[s.domain]) servicesByDomain[s.domain].push(s);
});

export const questionCounts = {};
QUESTIONS.forEach(q => {
  questionCounts[q.service] = (questionCounts[q.service] || 0) + 1;
});

export const domainQuestionCounts = {};
QUESTIONS.forEach(q => {
  domainQuestionCounts[q.domain] = (domainQuestionCounts[q.domain] || 0) + 1;
});

// Validate at module init
validateQuestions(QUESTIONS, DOMAINS, SERVICES);

class QuizState {
  screen = $state('menu');
  selectedServices = $state(new Set(SERVICES.map(s => s.id)));
  expandedDomains = $state(new Set());
  queue = $state([]);
  currentIdx = $state(0);
  answered = $state(false);
  results = $state({});
  missedQuestions = $state([]);
  round = $state(0);

  get selectedDomains() {
    const set = new Set();
    for (const key of Object.keys(DOMAINS)) {
      const domainNum = Number(key);
      const svcs = servicesByDomain[domainNum] || [];
      if (svcs.length > 0 && svcs.every(s => this.selectedServices.has(s.id))) {
        set.add(domainNum);
      }
    }
    return set;
  }

  get currentQuestion() { return this.queue[this.currentIdx]; }

  get progress() {
    return {
      current: this.currentIdx + 1,
      total: this.queue.length,
    };
  }

  get totalSelected() { return this.selectedServices.size; }

  get canStart() {
    return this.totalSelected > 0 && QUESTIONS.some(q => this.selectedServices.has(q.service));
  }

  toggleDomain(domainNum) {
    const svcs = servicesByDomain[domainNum] || [];
    const allSelected = svcs.length > 0
      ? svcs.every(s => this.selectedServices.has(s.id))
      : this.selectedDomains.has(domainNum);

    const next = new Set(this.selectedServices);
    if (allSelected) {
      svcs.forEach(s => next.delete(s.id));
    } else {
      svcs.forEach(s => next.add(s.id));
    }
    this.selectedServices = next;
  }

  toggleService(svcId) {
    this.selectedServices = toggleInSet(this.selectedServices, svcId);
  }

  selectAll() {
    this.selectedServices = new Set(SERVICES.map(s => s.id));
  }

  deselectAll() {
    this.selectedServices = new Set();
  }

  toggleExpanded(domainNum) {
    this.expandedDomains = toggleInSet(this.expandedDomains, domainNum);
  }

  startQuiz(questions) {
    const filtered = questions || QUESTIONS.filter(q => this.selectedServices.has(q.service));
    if (filtered.length === 0) return;
    const shuffled = shuffle(filtered);
    this.queue = shuffled;
    this.currentIdx = 0;
    this.answered = false;
    this.missedQuestions = [];
    this.round++;

    const r = {};
    shuffled.forEach(q => {
      if (!r[q.service]) r[q.service] = { correct: 0, total: 0 };
    });
    this.results = r;
    this.screen = 'quiz';
  }

  recordAnswer(isCorrect) {
    if (this.answered) return;
    this.answered = true;

    const q = this.queue[this.currentIdx];
    const r = { ...this.results };
    r[q.service] = { ...r[q.service] };
    r[q.service].total++;

    if (isCorrect) {
      r[q.service].correct++;
    } else {
      this.missedQuestions = [...this.missedQuestions, q];
    }
    this.results = r;
  }

  advanceQuestion() {
    if (!this.answered) return false;
    this.currentIdx++;
    this.answered = false;
    if (this.currentIdx >= this.queue.length) {
      this.screen = 'results';
      return true;
    }
    return false;
  }

  restart() {
    this.screen = 'menu';
  }

  requeueMissed() {
    if (this.missedQuestions.length > 0) {
      this.startQuiz([...this.missedQuestions]);
    }
  }
}

export const quiz = new QuizState();
