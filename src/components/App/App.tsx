import React, { useState, useEffect } from 'react';
import { AppRootProps, GrafanaTheme2 } from '@grafana/data';
import { Button, useStyles2 } from '@grafana/ui';
import { css } from '@emotion/css';
import axios from 'axios';

interface Recommendation {
  metric_name: string;
  status: string;
  problem_label: string;
  remaining_labels: string[];
  estimated_current_series: number;
  estimated_after_series: number;
  estimated_reduction_percent: number;
  explanation: string;
}

interface RecommendationItemProps {
  rec: Recommendation;
  handleAccept: (rec: Recommendation) => void;
  handleDecline: (rec: Recommendation) => void;
}

interface AcceptedLabels {
  [key: string]: {
    problemLabels: string[];
    allLabels: string[];
  };
}

const getStyles = (theme: GrafanaTheme2) => ({
  container: css`
    padding: ${theme.spacing(2)};
  `,
  title: css`
    margin-bottom: ${theme.spacing(2)};
    font-size: ${theme.typography.h4.fontSize};
    font-weight: ${theme.typography.fontWeightMedium};
  `,
  list: css`
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    flex-direction: column;
    gap: ${theme.spacing(2)};
  `,
  card: css`
    background: ${theme.colors.background.secondary};
    border: 1px solid ${theme.colors.border.weak};
    border-radius: ${theme.shape.borderRadius(2)};
    padding: ${theme.spacing(2)};
  `,
  metricName: css`
    font-size: ${theme.typography.h5.fontSize};
    font-weight: ${theme.typography.fontWeightMedium};
    margin-bottom: ${theme.spacing(1)};
    color: ${theme.colors.text.primary};
  `,
  detail: css`
    color: ${theme.colors.text.secondary};
    margin-bottom: ${theme.spacing(0.5)};
    font-size: ${theme.typography.bodySmall.fontSize};
  `,
  explanation: css`
    color: ${theme.colors.text.secondary};
    font-style: italic;
    margin-bottom: ${theme.spacing(1.5)};
    font-size: ${theme.typography.bodySmall.fontSize};
  `,
  actions: css`
    display: flex;
    gap: ${theme.spacing(1)};
    margin-top: ${theme.spacing(1.5)};
  `,
  statusAccepted: css`
    color: ${theme.colors.success.text};
    font-weight: ${theme.typography.fontWeightMedium};
  `,
  statusDeclined: css`
    color: ${theme.colors.error.text};
    font-weight: ${theme.typography.fontWeightMedium};
  `,
  submitRow: css`
    margin-top: ${theme.spacing(3)};
  `,
});

function RecommendationItem({ rec, handleAccept, handleDecline }: RecommendationItemProps) {
  const styles = useStyles2(getStyles);

  const executeHandleAccept = (event: React.SyntheticEvent): void => {
    event.preventDefault();
    handleAccept(rec);
  };

  const executeHandleDecline = (event: React.SyntheticEvent): void => {
    event.preventDefault();
    handleDecline(rec);
  };

  return (
    <li className={styles.card}>
      <div className={styles.metricName}>Metric Name: {rec.metric_name}</div>
      <div className={styles.detail}>Problem label: {rec.problem_label}</div>
      <div className={styles.detail}>
        Series: {rec.estimated_current_series} → {rec.estimated_after_series} ({rec.estimated_reduction_percent}% reduction)
      </div>
      <div className={styles.explanation}>{rec.explanation}</div>
      {rec.status === 'pending' ? (
        <div className={styles.actions}>
          <Button variant="primary" size="sm" onClick={executeHandleAccept}>Accept</Button>
          <Button variant="destructive" size="sm" onClick={executeHandleDecline}>Decline</Button>
        </div>
      ) : (
        <div className={styles.actions}>
          <span className={rec.status === 'accepted' ? styles.statusAccepted : styles.statusDeclined}>
            {rec.status === 'accepted' ? 'Accepted' : 'Declined'}
          </span>
        </div>
      )}
    </li>
  );
}

function App(props: AppRootProps) {
  // apiUrl is provisioned at container startup via apps.yaml → SMART_METRICS_API_URL.
  // Fallback to localhost only for local development (docker-compose).
  const apiUrl = (props.meta.jsonData as { apiUrl?: string })?.apiUrl ?? 'http://localhost:3001';
  const [recs, setRecs] = useState<Recommendation[]>([]);
  const styles = useStyles2(getStyles);

  const handleAccept = (rec: Recommendation) => {
    setRecs(prev => prev.map(currRec => currRec === rec ? { ...rec, status: 'accepted' } : currRec));
  };

  const handleDecline = (rec: Recommendation) => {
    setRecs(prev => prev.map(currRec => currRec === rec ? { ...rec, status: 'declined' } : currRec));
  };

  const handleSubmit = async (event: React.SyntheticEvent) => {
    event.preventDefault();
    if (recs.some(rec => rec.status === 'pending')) {
      alert('You have pending decisions. Please accept or decline all recommendations before submitting.');
      return;
    }
    const output: AcceptedLabels = {};
    recs.forEach(rec => {
      if (rec.status === 'accepted') {
        if (rec.metric_name in output) {
          output[rec.metric_name].problemLabels.push(rec.problem_label);
        } else {
          output[rec.metric_name] = {
            problemLabels: [rec.problem_label],
            allLabels: [...rec.remaining_labels, rec.problem_label],
          };
        }
      }
    });
    await axios.post(`${apiUrl}/api/acceptedRecommendations`, output);
    alert('The bike is operational! Check the VM Agent yaml file; it should now reflect your accepted recommendations.');
  };

  useEffect(() => {
    const getAndSetRecs = async () => {
      try {
        const res = await axios.get<Recommendation[]>(`${apiUrl}/api/recommendations`);

          // sorted by percentage, top down. 
          setRecs([...res.data].sort((a, b) => b.estimated_reduction_percent - a.estimated_reduction_percent));
      } catch (err) {
        console.error('Failed to fetch recommendations:', err);
      }
    };
    getAndSetRecs();
  }, []);

  return (
    <form onSubmit={handleSubmit} className={styles.container}>
      <h3 className={styles.title}>Recommendations</h3>
      <ul className={styles.list}>
        {recs.map(rec => (
          <RecommendationItem
            key={rec.metric_name + ' ' + rec.problem_label}
            rec={rec}
            handleAccept={handleAccept}
            handleDecline={handleDecline}
          />
        ))}
      </ul>
      <div className={styles.submitRow}>
        <Button type="submit" variant="primary">Submit</Button>
      </div>
    </form>
  );
}

export default App;
