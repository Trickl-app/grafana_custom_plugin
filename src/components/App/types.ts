export type ActiveTab = 'recommendations' | 'aggregations' | 'droppedLabels';

export interface Recommendation {
  metric_name: string;
  status: string;
  problem_label: string;
  remaining_labels: string[];
  estimated_current_series: number;
  estimated_after_series: number;
  estimated_reduction_percent: number;
  explanation: string;
}

export interface AcceptedLabels {
  [key: string]: {
    problemLabels: string[];
    allLabels: string[];
    aggregate?: boolean;
    interval?: '1m' | '5m' | '15m';
  };
}

export interface Aggregation {
  id: number;
  metric_name: string;
  labels: string[];
  json_snippet: {
    match: string,
    outputs: string[],
    without: string[],
    interval: string
    aggregate: boolean;
  };
};
