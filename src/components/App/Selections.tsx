import React from 'react';
import { useStyles2 } from '@grafana/ui';
import { AcceptedLabels } from './types';
import { getStyles } from './styles';

interface SelectionsProps {
  selections: AcceptedLabels;
}

function Selections({ selections }: SelectionsProps) {
  const styles = useStyles2(getStyles);

  return (
    <div className={styles.container}>
      <h3 className={styles.title}>Your Selections</h3>
      <ul className={styles.list}>
        {Object.entries(selections).map(([metricName, { problemLabels }]) => (
          <li key={metricName} className={styles.card}>
            <div className={styles.metricName}>{metricName}</div>
            <div className={styles.detail}>Labels to drop: {problemLabels.join(', ')}</div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Selections;
