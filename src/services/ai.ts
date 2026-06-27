// ── Uphold AI Service ─────────────────────────────────────────────────────────
// Generates predictive insights, briefings, and assistant answers derived from
// the organisation's live data. The shapes here are LLM-ready: each method
// returns structured output that could later be produced by a model call
// (e.g. Claude) without changing any of the consuming UI.

import {
  tenants, certificates, properties, starAssessments, users,
} from '../data/mockData';
import type { RiskLevel } from '../types';

const delay = (ms = 700) => new Promise(resolve => setTimeout(resolve, ms));

const today = new Date();
const daysBetween = (a: Date, b: Date) => Math.round((a.getTime() - b.getTime()) / 86_400_000);
const propertyName = (id: string) => {
  const p = properties.find(p => p.id === id);
  return p ? `${p.address}, ${p.city}` : 'Unknown property';
};
const keyWorkerName = (id: string) => users.find(u => u.id === id)?.name ?? 'Unassigned';

const certLabels: Record<string, string> = {
  gas_safety: 'Gas Safety', fire_safety: 'Fire Safety', electrical_eicr: 'Electrical (EICR)',
  buildings_insurance: 'Buildings Insurance', hmo_licence: 'HMO Licence', epc: 'EPC',
  pat_testing: 'PAT Testing', legionella: 'Legionella',
};

// ── Types ──────────────────────────────────────────────────────────────────────
export interface RiskInsight {
  tenantId: string;
  tenantName: string;
  keyWorker: string;
  score: number;              // 0–100 AI risk score
  level: RiskLevel;
  factors: string[];         // human-readable contributing signals
  recommendation: string;    // suggested next action
}

export interface AIAction {
  id: string;
  priority: 'high' | 'medium' | 'low';
  title: string;
  detail: string;
  category: 'Wellbeing' | 'Compliance' | 'Financial' | 'Documentation';
}

export interface AIBriefing {
  greeting: string;
  summary: string;
  highlights: { label: string; value: string; tone: 'positive' | 'neutral' | 'negative' }[];
  generatedAt: string;
}

export interface ComplianceForecast {
  id: string;
  property: string;
  type: string;
  expiryDate: string;
  daysUntil: number;
  risk: 'expired' | 'urgent' | 'soon' | 'ok';
  recommendation: string;
}

export interface AIMessage {
  role: 'user' | 'assistant';
  content: string;
  suggestions?: string[];
}

// ── Risk scoring ────────────────────────────────────────────────────────────────
const scoreToLevel = (score: number): RiskLevel =>
  score >= 75 ? 'critical' : score >= 55 ? 'high' : score >= 30 ? 'medium' : 'low';

function computeRisk(tenantId: string): RiskInsight {
  const t = tenants.find(t => t.id === tenantId)!;
  const base: Record<RiskLevel, number> = { low: 8, medium: 30, high: 55, critical: 78 };
  let score = base[t.riskLevel];
  const factors: string[] = [];

  const gap = t.supportHoursRequired - t.supportHoursWeek;
  if (gap > 0) {
    score += Math.min(22, (gap / t.supportHoursRequired) * 30);
    factors.push(`Receiving ${t.supportHoursWeek}h vs ${t.supportHoursRequired}h required support (−${gap.toFixed(1)}h)`);
  }
  if (t.rentBalance < 0) {
    score += 16;
    factors.push(`Rent arrears of £${Math.abs(t.rentBalance).toLocaleString()}`);
  }
  if (t.housingBenefitStatus !== 'confirmed') {
    score += 8;
    factors.push(`Housing benefit ${t.housingBenefitStatus.replace('_', ' ')}`);
  }
  const sinceContact = daysBetween(today, new Date(t.lastContactDate));
  if (sinceContact > 14) {
    score += 10;
    factors.push(`No contact logged for ${sinceContact} days`);
  }
  const missedAppointments = /miss|disengag|struggl/i.test(t.notes ?? '');
  if (missedAppointments) {
    score += 8;
    factors.push('Engagement concerns noted in recent support records');
  }
  if (t.status === 'at_risk') {
    score += 6;
    factors.push('Flagged at risk by key worker');
  }

  score = Math.max(0, Math.min(100, Math.round(score)));
  const level = scoreToLevel(score);

  let recommendation = 'Continue scheduled support and monitor.';
  if (gap > 0) recommendation = `Schedule a welfare visit to close the ${gap.toFixed(1)}h support gap this week.`;
  else if (t.rentBalance < 0) recommendation = 'Arrange an income & arrears review; check housing benefit status.';
  else if (sinceContact > 14) recommendation = `Re-establish contact — last touchpoint was ${sinceContact} days ago.`;
  else if (level === 'high' || level === 'critical') recommendation = 'Escalate to senior support and review the risk assessment.';

  return {
    tenantId: t.id,
    tenantName: `${t.firstName} ${t.lastName}`,
    keyWorker: keyWorkerName(t.keyWorkerId),
    score, level, factors, recommendation,
  };
}

// ── Service ──────────────────────────────────────────────────────────────────────
export const aiService = {
  async getRiskInsights(): Promise<RiskInsight[]> {
    await delay(800);
    return tenants
      .filter(t => t.status !== 'moved_on')
      .map(t => computeRisk(t.id))
      .sort((a, b) => b.score - a.score);
  },

  async getBriefing(): Promise<AIBriefing> {
    await delay(900);
    const insights = tenants.filter(t => t.status !== 'moved_on').map(t => computeRisk(t.id));
    const highRisk = insights.filter(i => i.level === 'high' || i.level === 'critical');
    const arrears = tenants.filter(t => t.rentBalance < 0);
    const arrearsTotal = arrears.reduce((s, t) => s + Math.abs(t.rentBalance), 0);
    const expiredCerts = certificates.filter(c => c.status === 'expired').length;
    const expiringCerts = certificates.filter(c => c.status === 'expiring_soon').length;
    const overdueStar = starAssessments.filter(a => a.status === 'overdue').length;
    const reviewsThisWeek = tenants.filter(t => {
      const d = daysBetween(new Date(t.nextReviewDate), today);
      return d >= 0 && d <= 7;
    }).length;

    const hour = today.getHours();
    const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';

    const summary =
      `${highRisk.length} tenant${highRisk.length === 1 ? '' : 's'} need${highRisk.length === 1 ? 's' : ''} attention today` +
      `${highRisk[0] ? `, with ${highRisk[0].tenantName} showing the highest risk signals` : ''}. ` +
      `${reviewsThisWeek} support review${reviewsThisWeek === 1 ? '' : 's'} fall due this week. ` +
      (expiredCerts > 0
        ? `${expiredCerts} compliance certificate${expiredCerts === 1 ? ' is' : 's are'} expired and need${expiredCerts === 1 ? 's' : ''} immediate renewal. `
        : expiringCerts > 0
          ? `${expiringCerts} certificate${expiringCerts === 1 ? '' : 's'} expiring soon — book renewals to stay ahead. `
          : 'All compliance certificates are currently valid. ') +
      (arrearsTotal > 0 ? `Rent arrears total £${arrearsTotal.toLocaleString()} across ${arrears.length} tenant${arrears.length === 1 ? '' : 's'}.` : 'No outstanding rent arrears.');

    return {
      greeting,
      summary,
      highlights: [
        { label: 'High-risk tenants', value: String(highRisk.length), tone: highRisk.length ? 'negative' : 'positive' },
        { label: 'Reviews due this week', value: String(reviewsThisWeek), tone: reviewsThisWeek ? 'neutral' : 'positive' },
        { label: 'Overdue STAR assessments', value: String(overdueStar), tone: overdueStar ? 'negative' : 'positive' },
        { label: 'Certificates expiring/expired', value: String(expiredCerts + expiringCerts), tone: (expiredCerts + expiringCerts) ? 'negative' : 'positive' },
      ],
      generatedAt: today.toISOString(),
    };
  },

  async getRecommendedActions(): Promise<AIAction[]> {
    await delay(700);
    const actions: AIAction[] = [];
    const insights = tenants.map(t => computeRisk(t.id));

    insights.filter(i => i.level === 'critical' || i.level === 'high').slice(0, 3).forEach(i => {
      actions.push({
        id: `act-risk-${i.tenantId}`,
        priority: i.level === 'critical' ? 'high' : 'medium',
        title: `Review ${i.tenantName}`,
        detail: i.recommendation,
        category: 'Wellbeing',
      });
    });

    certificates.filter(c => c.status === 'expired').slice(0, 2).forEach(c => {
      actions.push({
        id: `act-cert-${c.id}`,
        priority: 'high',
        title: `Renew ${certLabels[c.type] ?? c.type}`,
        detail: `${propertyName(c.propertyId)} — certificate expired ${new Date(c.expiryDate).toLocaleDateString('en-GB')}.`,
        category: 'Compliance',
      });
    });

    starAssessments.filter(a => a.status === 'overdue').slice(0, 2).forEach(a => {
      const t = tenants.find(t => t.id === a.tenantId);
      actions.push({
        id: `act-star-${a.id}`,
        priority: 'medium',
        title: `Complete STAR assessment`,
        detail: `${t ? `${t.firstName} ${t.lastName}` : 'Tenant'} — assessment overdue since ${new Date(a.scheduledDate).toLocaleDateString('en-GB')}.`,
        category: 'Documentation',
      });
    });

    tenants.filter(t => t.rentBalance < 0).slice(0, 2).forEach(t => {
      actions.push({
        id: `act-rent-${t.id}`,
        priority: Math.abs(t.rentBalance) > 300 ? 'high' : 'low',
        title: `Arrears review — ${t.firstName} ${t.lastName}`,
        detail: `£${Math.abs(t.rentBalance).toLocaleString()} outstanding. ${t.housingBenefitStatus !== 'confirmed' ? 'Housing benefit not confirmed.' : 'Arrange a repayment plan.'}`,
        category: 'Financial',
      });
    });

    const order = { high: 0, medium: 1, low: 2 };
    return actions.sort((a, b) => order[a.priority] - order[b.priority]).slice(0, 6);
  },

  async getComplianceForecast(): Promise<ComplianceForecast[]> {
    await delay(600);
    return certificates
      .map(c => {
        const daysUntil = daysBetween(new Date(c.expiryDate), today);
        const risk: ComplianceForecast['risk'] =
          daysUntil < 0 ? 'expired' : daysUntil <= 30 ? 'urgent' : daysUntil <= 90 ? 'soon' : 'ok';
        const recommendation =
          risk === 'expired' ? 'Renew immediately — property is non-compliant.' :
          risk === 'urgent' ? 'Book renewal now to avoid a compliance gap.' :
          risk === 'soon' ? 'Schedule renewal within the next month.' :
          'On track — no action needed yet.';
        return {
          id: c.id,
          property: propertyName(c.propertyId),
          type: certLabels[c.type] ?? c.type,
          expiryDate: c.expiryDate,
          daysUntil,
          risk,
          recommendation,
        };
      })
      .filter(c => c.risk !== 'ok')
      .sort((a, b) => a.daysUntil - b.daysUntil);
  },

  // Lightweight grounded assistant — matches intent against live data.
  async ask(query: string): Promise<AIMessage> {
    await delay(900);
    const q = query.toLowerCase();
    const reply = (content: string, suggestions?: string[]): AIMessage => ({ role: 'assistant', content, suggestions });

    if (/arrear|rent|owe|debt|balance/.test(q)) {
      const arrears = tenants.filter(t => t.rentBalance < 0).sort((a, b) => a.rentBalance - b.rentBalance);
      const total = arrears.reduce((s, t) => s + Math.abs(t.rentBalance), 0);
      if (!arrears.length) return reply('No tenants are currently in rent arrears. 🎉');
      const lines = arrears.map(t => `• ${t.firstName} ${t.lastName} — £${Math.abs(t.rentBalance).toLocaleString()} (${t.housingBenefitStatus.replace('_', ' ')})`).join('\n');
      return reply(`There are ${arrears.length} tenants in arrears totalling £${total.toLocaleString()}:\n\n${lines}\n\nI'd prioritise the largest balances and confirm housing benefit status first.`);
    }

    if (/risk|at.?risk|vulnerab|concern|safeguard/.test(q)) {
      const insights = tenants.map(t => computeRisk(t.id)).filter(i => i.level === 'high' || i.level === 'critical');
      if (!insights.length) return reply('No tenants are currently scoring as high or critical risk. Keep monitoring scheduled reviews.');
      const lines = insights.slice(0, 5).map(i => `• ${i.tenantName} — ${i.level} (${i.score}/100): ${i.factors[0] ?? 'multiple signals'}`).join('\n');
      return reply(`${insights.length} tenants need closer attention:\n\n${lines}\n\nTop recommendation: ${insights[0].recommendation}`);
    }

    if (/cert|complian|gas|electric|fire|inspect|expir/.test(q)) {
      const expired = certificates.filter(c => c.status === 'expired');
      const expiring = certificates.filter(c => c.status === 'expiring_soon');
      const lines = [...expired, ...expiring].slice(0, 6).map(c => `• ${certLabels[c.type] ?? c.type} — ${propertyName(c.propertyId)} (${c.status.replace('_', ' ')}, exp. ${new Date(c.expiryDate).toLocaleDateString('en-GB')})`).join('\n');
      if (!lines) return reply('All compliance certificates are currently valid. ✅');
      return reply(`${expired.length} expired and ${expiring.length} expiring soon:\n\n${lines}\n\nRenew expired certificates first to close any compliance gaps.`);
    }

    if (/occupan|vacan|room|empty/.test(q)) {
      const totalRooms = properties.reduce((s, p) => s + p.totalRooms, 0);
      const occupied = properties.reduce((s, p) => s + p.occupiedRooms, 0);
      const pct = Math.round((occupied / totalRooms) * 100);
      return reply(`Current occupancy is ${pct}% — ${occupied} of ${totalRooms} rooms filled across ${properties.length} properties. There ${totalRooms - occupied === 1 ? 'is' : 'are'} ${totalRooms - occupied} vacant room${totalRooms - occupied === 1 ? '' : 's'} available for new referrals.`);
    }

    if (/support hour|hours|caseload|under.?support/.test(q)) {
      const below = tenants.filter(t => t.supportHoursWeek < t.supportHoursRequired);
      if (!below.length) return reply('Every tenant is receiving their required support hours. Great coverage this week.');
      const lines = below.map(t => `• ${t.firstName} ${t.lastName} — ${t.supportHoursWeek}h / ${t.supportHoursRequired}h`).join('\n');
      return reply(`${below.length} tenants are below their required support hours:\n\n${lines}\n\nConsider re-balancing key-worker caseloads to close these gaps.`);
    }

    if (/summary|brief|overview|today|how are we|status/.test(q)) {
      const b = await this.getBriefing();
      return reply(b.summary, ['Who is most at risk?', 'Any compliance gaps?', 'Show rent arrears']);
    }

    return reply(
      `I can help with tenant wellbeing, risk, compliance, occupancy, support hours and finances — all from your live Uphold data. Try one of these:`,
      ['Who is most at risk right now?', 'Show me rent arrears', 'Any certificates expiring?', "What's our occupancy?"],
    );
  },
};

export const aiSuggestedPrompts = [
  'Give me today\'s briefing',
  'Who is most at risk right now?',
  'Show me rent arrears',
  'Any certificates expiring?',
];
