import React from 'react';
import { Aggregation } from './types';
import { Button, IconButton, useStyles2 } from '@grafana/ui';
import { getStyles } from './styles';

interface AggregationItemProps {
  agg: Aggregation;
  deletedAggs: Aggregation[];
  handleDeleteAgg: (agg: Aggregation) => void;
  handleUndoDeleteAgg: (agg: Aggregation) => void;
}

function AggregationItem({ agg, deletedAggs, handleDeleteAgg, handleUndoDeleteAgg }: AggregationItemProps) {
  const styles = useStyles2(getStyles);
  const isDeleted = deletedAggs.some(d => d.metric_name === agg.metric_name);

  return (
    <>
      <li className={styles.card}>
        <div className={styles.metricName}>Metric Name: {agg.metric_name}</div>
        <div className={styles.detail}>Interval: {agg.json_snippet.interval}</div>
        {agg.labels.length > 0 && (
          <div className={styles.detail}>Problem Labels: {agg.labels}</div>
        )}
        <div className={styles.actions}>
          {isDeleted ? (
            <>
              <span className={styles.statusDeclined}>Selected for Deletion</span>
              <Button variant="secondary" size="sm" onClick={() => handleUndoDeleteAgg(agg)}>Undo</Button>
            </>
          ) : (
            <Button variant="destructive" size="sm" onClick={() => handleDeleteAgg(agg)}>Delete</Button>
          )}
        </div>
      </li>
    </>
  );
}

export default AggregationItem