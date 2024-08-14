export type tradeStatusStage = 'negotiate' | 'accepted' | 'rejected';
export type tradeStatusResult = 'pending' | 'accept' | 'reject';

export const tradeStatusStages: Readonly<tradeStatusStage[]> = Object.freeze([
  'negotiate',
  'accepted',
  'rejected',
]);

export const tradeStatusResults: Readonly<tradeStatusResult[]> = Object.freeze([
  'pending',
  'accept',
  'reject',
]);
