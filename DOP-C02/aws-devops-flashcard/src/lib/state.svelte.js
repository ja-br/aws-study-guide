import { shuffle } from './utils.js';
import { CARDS } from '../data/cards.js';
import { DOMAIN_COLORS } from '../data/domains.js';

class FlashState {
  screen = $state('menu');
  selectedDomains = $state(new Set([1, 2, 3, 4, 5, 6]));
  deck = $state([]);
  idx = $state(0);
  flipped = $state(false);
  known = $state([]);
  learning = $state([]);
  animDir = $state(null);
  isAnimating = $state(false);

  get card() { return this.deck[this.idx]; }
  get colors() { return DOMAIN_COLORS[this.card?.domain ?? 1]; }
  get progress() { return this.deck.length > 0 ? ((this.idx + 1) / this.deck.length) * 100 : 0; }
  get pct() {
    const total = this.known.length + this.learning.length;
    return total > 0 ? Math.round((this.known.length / total) * 100) : 0;
  }
  get cardCount() {
    return CARDS.filter(c => this.selectedDomains.has(c.domain)).length;
  }

  toggleDomain(d) {
    const next = new Set(this.selectedDomains);
    next.has(d) ? next.delete(d) : next.add(d);
    this.selectedDomains = next;
  }

  selectAll() { this.selectedDomains = new Set([1, 2, 3, 4, 5, 6]); }
  deselectAll() { this.selectedDomains = new Set(); }

  startGame(cards) {
    const source = cards ?? CARDS.filter(c => this.selectedDomains.has(c.domain));
    if (!source.length) return;
    this.deck = shuffle(source);
    this.idx = 0;
    this.flipped = false;
    this.known = [];
    this.learning = [];
    this.animDir = null;
    this.screen = 'play';
  }

  mark(type) {
    if (this.isAnimating) return;
    this.isAnimating = true;
    const card = this.card;
    this.animDir = type === 'know' ? 'right' : 'left';
    setTimeout(() => {
      if (this.screen !== 'play') {
        this.animDir = null;
        this.isAnimating = false;
        return;
      }
      if (type === 'know') this.known = [...this.known, card];
      else this.learning = [...this.learning, card];
      if (this.idx + 1 < this.deck.length) {
        this.idx++;
        this.flipped = false;
      } else {
        this.screen = 'results';
      }
      this.animDir = null;
      this.isAnimating = false;
    }, 350);
  }

  reStudy() {
    if (!this.learning.length) return;
    this.startGame([...this.learning]);
  }

  restart() {
    this.startGame();
  }
}

export const flash = new FlashState();
export { CARDS };
