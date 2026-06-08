import React from 'react';
import { Button, IconButton, useStyles2 } from '@grafana/ui';
import { Recommendation } from './types';
import { getStyles } from './styles';

interface RecommendationItemProps {
  rec: Recommendation;
  handleAccept: (rec: Recommendation) => void;
  handleDecline: (rec: Recommendation) => void;
  handleReset: (rec: Recommendation) => void;
}

function RecommendationItem({ rec, handleAccept, handleDecline, handleReset }: RecommendationItemProps) {
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
    <li className={`${styles.card} ${rec.isPrimeTarget ? styles.cardPrimeTarget : ''}`}>
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
          <IconButton name="history" tooltip="Change decision" onClick={() => handleReset(rec)} aria-label="Change decision" />
        </div>
      )}
    </li>
  );
}

export default RecommendationItem;
