export interface Notification {
  ID: string;
  Type: string;
  Message: string;
  Timestamp: string;
}

export type FilterType = 'All' | 'Event' | 'Result' | 'Placement';
