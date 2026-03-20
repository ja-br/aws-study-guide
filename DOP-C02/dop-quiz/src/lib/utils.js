export function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function toggleInSet(set, value) {
  const next = new Set(set);
  if (next.has(value)) {
    next.delete(value);
  } else {
    next.add(value);
  }
  return next;
}

export function validateQuestions(questions, domains, services) {
  const svcSet = new Set(services.map(s => s.id));
  const errors = [];
  questions.forEach((q, idx) => {
    if (q.options.length < 2)
      errors.push(`Q${idx}: fewer than 2 options`);
    if (!q.q)
      errors.push(`Q${idx}: empty question text`);
    if (!q.explanation)
      errors.push(`Q${idx}: missing explanation`);
    if (!domains[q.domain])
      errors.push(`Q${idx}: invalid domain ${q.domain}`);
    if (!svcSet.has(q.service))
      errors.push(`Q${idx}: unknown service "${q.service}"`);
  });
  if (errors.length > 0) {
    throw new Error(`Question validation failed:\n${errors.join('\n')}`);
  }
}
