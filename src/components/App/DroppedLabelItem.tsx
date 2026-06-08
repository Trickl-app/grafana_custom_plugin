import React from 'react';
import { DroppedLabel } from './types';
import { Button, useStyles2 } from '@grafana/ui';
import { getStyles } from './styles';

interface DroppedLabelItemProps {
  entry: DroppedLabel;
  deletedLabels: DroppedLabel[];
  handleDeleteLabel: (entry: DroppedLabel) => void;
  handleUndoDeleteLabel: (entry: DroppedLabel) => void;
}

function DroppedLabelItem({ entry, deletedLabels, handleDeleteLabel, handleUndoDeleteLabel }: DroppedLabelItemProps) {
  const styles = useStyles2(getStyles);
  const isDeleted = deletedLabels.some(d => d.id === entry.id);

  return (
    <li className={styles.card}>
      <div className={styles.metricName}>Metric Name: {entry.metric_name}</div>
      <div className={styles.detail}>Problem label/s: {entry.labels.join(', ')}</div>
      <div className={styles.actions}>
        {isDeleted ? (
          <>
            <span className={styles.statusDeclined}>Selected for Deletion</span>
            <Button variant="secondary" size="sm" onClick={() => handleUndoDeleteLabel(entry)}>Undo</Button>
          </>
        ) : (
          <Button variant="destructive" size="sm" onClick={() => handleDeleteLabel(entry)}>Delete</Button>
        )}
      </div>
    </li>
  );
}

export default DroppedLabelItem;
