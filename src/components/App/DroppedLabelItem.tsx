import React from 'react';
import { DroppedLabel } from './types';
import { Button, useStyles2 } from '@grafana/ui';
import { getStyles } from './styles';

interface DroppedLabelItemProps {
  entry: DroppedLabel;
  deletedLabels: { id: number; label: string }[];
  handleDeleteLabel: (entry: DroppedLabel, label: string) => void;
  handleUndoDeleteLabel: (entry: DroppedLabel, label: string) => void;
}

function DroppedLabelItem({ entry, deletedLabels, handleDeleteLabel, handleUndoDeleteLabel }: DroppedLabelItemProps) {
  const styles = useStyles2(getStyles);

  console.log('entry.id type:', typeof entry.id, 'value:', entry.id);

  return (
    <li className={styles.card}>
      <div className={styles.metricName}>Metric Name: {entry.metric_name}</div>
      <ul className={styles.list}>
        {entry.labels.map(label => {
          const isDeleted = deletedLabels.some(d => d.id === entry.id && d.label === label);
          return (
            <li key={label} className={styles.card}>
              <div className={styles.actions}>
                <span className={styles.detail}>{label}</span>
                {isDeleted ? (
                  <>
                    <span className={styles.statusDeclined}>Selected for Deletion</span>
                    <Button variant="secondary" size="sm" onClick={() => handleUndoDeleteLabel(entry, label)}>Undo</Button>
                  </>
                ) : (
                  <Button variant="destructive" size="sm" onClick={() => handleDeleteLabel(entry, label)}>Delete</Button>
                )}
              </div>
            </li>
          );
        })}
      </ul>
    </li>
  );
}

export default DroppedLabelItem;
