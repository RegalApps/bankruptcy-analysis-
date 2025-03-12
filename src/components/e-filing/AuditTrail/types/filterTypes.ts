
export interface FilterOptions {
  actionTypes: Set<string>;
  timeframe: string;
  users: Set<string>;
}

export interface TimeframeOption {
  value: string;
  label: string;
}
