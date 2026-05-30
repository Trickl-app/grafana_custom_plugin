import React from 'react';
import { DroppedLabel } from './types';
import { Button, useStyles2 } from '@grafana/ui';
import { getStyles } from './styles';

interface DroppedLabelItemProps {
  entry: DroppedLabel;
}

function DroppedLabelItem({ entry }: DroppedLabelItemProps) {
  const styles = useStyles2(getStyles);

  return (
    <li className={styles.card}>
      <div className={styles.metricName}>Metric Name: {entry.metric_name}</div>
      <ul className={styles.list}>
        {entry.labels.map(label => (
          <li key={label} className={styles.card}>
            <div className={styles.actions}>
              <span className={styles.detail}>{label}</span>
              <Button variant="destructive" size="sm" onClick={() => {}}>Delete</Button>
            </div>
          </li>
        ))}
      </ul>
    </li>
  );
}

export default DroppedLabelItem;
