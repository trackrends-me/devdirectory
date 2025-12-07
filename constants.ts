// Application Constants - Centralized configuration

export const PRICING_OPTIONS = ['all', 'Free', 'Open Source', 'Freemium', 'Paid'] as const;

export const STARS_FILTERS = [0, 1000, 10000, 50000] as const;

export const RATING_LABELS: Record<number, string> = {
  0: 'Any Rating',
  1000: '1k+ Stars',
  10000: '10k+ Stars',
  50000: '50k+ Stars',
};
