function normalize(values) {
  if (!values.length) return 0;
  const average = values.reduce((sum, value) => sum + value, 0) / values.length;
  return Number((((average - 1) / 4) * 100).toFixed(2));
}

export function calculateScores(questions, answers) {
  const byId = new Map(questions.map((q) => [q.id, q]));
  const grouped = { STRESS: [], WORKLOAD: [], RECOVERY: [], SUPPORT: [] };

  for (const answer of answers) {
    const question = byId.get(answer.questionId);
    if (!question) continue;
    const positiveValue = question.is_negative ? 6 - answer.response : answer.response;
    grouped[question.domain].push(positiveValue);
  }

  const wellbeingStress = normalize(grouped.STRESS);
  const stressScore = Number((100 - wellbeingStress).toFixed(2));
  const workloadWellbeing = normalize(grouped.WORKLOAD);
  const workloadScore = Number((100 - workloadWellbeing).toFixed(2));
  const recoveryScore = normalize(grouped.RECOVERY);
  const supportScore = normalize(grouped.SUPPORT);

  let burnoutRisk = 'LOW';
  if (stressScore >= 80 && recoveryScore < 40) burnoutRisk = 'SEVERE';
  else if (stressScore >= 60 && recoveryScore < 60) burnoutRisk = 'HIGH';
  else if (stressScore >= 40 || workloadScore >= 70) burnoutRisk = 'MODERATE';

  return { stressScore, workloadScore, recoveryScore, supportScore, burnoutRisk };
}

export function createAlerts(scores) {
  const alerts = [];
  if (scores.stressScore >= 80) alerts.push({ alertType: 'CRITICAL_STRESS', message: 'Stress score is critical. HR follow-up is recommended.' });
  if (scores.recoveryScore < 40) alerts.push({ alertType: 'LOW_RECOVERY', message: 'Recovery score is poor. Recommend rest, leave, or coaching resources.' });
  if (['HIGH', 'SEVERE'].includes(scores.burnoutRisk)) alerts.push({ alertType: 'BURNOUT_RISK', message: `Burnout risk is ${scores.burnoutRisk.toLowerCase()}. Occupational health review is recommended.` });
  return alerts;
}
