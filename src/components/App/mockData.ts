import { Recommendation } from './types';

export const mockRecs: Recommendation[] = [
  {
    "metric_name": "container_cpu_usage_seconds_total",
    "status": "pending",
    "problem_label": "pod",
    "remaining_labels": ["container", "namespace", "image", "node"],
    "estimated_current_series": 15000,
    "estimated_after_series": 3000,
    "estimated_reduction_percent": 80,
    "explanation": "container_cpu_usage_seconds_total has a high-cardinality label that does not appear in captured Grafana usage. pod has 800 unique values, about 5.3% of the estimated current series count"
  },
  {
    "metric_name": "container_cpu_usage_seconds_total",
    "status": "pending",
    "problem_label": "image",
    "remaining_labels": ["pod", "container", "namespace", "node"],
    "estimated_current_series": 15000,
    "estimated_after_series": 11000,
    "estimated_reduction_percent": 26,
    "explanation": "container_cpu_usage_seconds_total has a high-cardinality label that does not appear in captured Grafana usage. image has 40 unique values, about 0.27% of the estimated current series count"
  },
  {
    "metric_name": "container_cpu_usage_seconds_total",
    "status": "pending",
    "problem_label": "container",
    "remaining_labels": ["pod", "namespace", "image", "node"],
    "estimated_current_series": 15000,
    "estimated_after_series": 12000,
    "estimated_reduction_percent": 20,
    "explanation": "container_cpu_usage_seconds_total has a high-cardinality label that does not appear in captured Grafana usage. container has 50 unique values, about 0.33% of the estimated current series count"
  },
  {
    "metric_name": "http_requests_total",
    "status": "pending",
    "problem_label": "user_id",
    "remaining_labels": ["path", "method", "status", "handler"],
    "estimated_current_series": 8000,
    "estimated_after_series": 400,
    "estimated_reduction_percent": 95,
    "explanation": "http_requests_total has a high-cardinality label that does not appear in captured Grafana usage. user_id has 2000 unique values, about 25% of the estimated current series count"
  },
  {
    "metric_name": "http_requests_total",
    "status": "pending",
    "problem_label": "path",
    "remaining_labels": ["user_id", "method", "status", "handler"],
    "estimated_current_series": 8000,
    "estimated_after_series": 6500,
    "estimated_reduction_percent": 18,
    "explanation": "http_requests_total has a high-cardinality label that does not appear in captured Grafana usage. path has 120 unique values, about 1.5% of the estimated current series count"
  },
  {
    "metric_name": "http_requests_total",
    "status": "pending",
    "problem_label": "handler",
    "remaining_labels": ["user_id", "path", "method", "status"],
    "estimated_current_series": 8000,
    "estimated_after_series": 7200,
    "estimated_reduction_percent": 10,
    "explanation": "http_requests_total has a high-cardinality label that does not appear in captured Grafana usage. handler has 30 unique values, about 0.37% of the estimated current series count"
  },
  {
    "metric_name": "node_disk_written_bytes_total",
    "status": "pending",
    "problem_label": "device",
    "remaining_labels": ["instance", "fstype", "job"],
    "estimated_current_series": 3500,
    "estimated_after_series": 100,
    "estimated_reduction_percent": 97,
    "explanation": "node_disk_written_bytes_total has a high-cardinality label that does not appear in captured Grafana usage. device has 700 unique values, about 20% of the estimated current series count"
  },
  {
    "metric_name": "node_disk_written_bytes_total",
    "status": "pending",
    "problem_label": "instance",
    "remaining_labels": ["device", "fstype", "job"],
    "estimated_current_series": 3500,
    "estimated_after_series": 2800,
    "estimated_reduction_percent": 20,
    "explanation": "node_disk_written_bytes_total has a high-cardinality label that does not appear in captured Grafana usage. instance has 50 unique values, about 1.42% of the estimated current series count"
  }
];