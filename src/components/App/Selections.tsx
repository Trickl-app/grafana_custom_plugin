import React from 'react';
import { Button, useStyles2 } from '@grafana/ui';
import axios from 'axios';
import { AcceptedLabels } from './types';
import { getStyles } from './styles';

interface SelectionsProps {
  selections: AcceptedLabels;
  apiUrl: string;
  onBack: () => void;
}

function Selections({ selections, apiUrl, onBack }: SelectionsProps) {
  const styles = useStyles2(getStyles);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    await axios.post(`${apiUrl}/api/acceptedRecommendations`, selections);
    alert('The bike is operational! Check the VM Agent yaml file; it should now reflect your accepted recommendations.');
  };

  return (
    <form onSubmit={handleSubmit} className={styles.container}>
      <h3 className={styles.title}>Your Selections</h3>
      <ul className={styles.list}>
        {Object.entries(selections).map(([metricName, { problemLabels }]) => (
          <li key={metricName} className={styles.card}>
            <div className={styles.metricName}>{metricName}</div>
            <div className={styles.detail}>Labels to drop: {problemLabels.join(', ')}</div>
          </li>
        ))}
      </ul>
      <div className={styles.submitRow}>
        <Button type="submit" variant="primary">Submit</Button>
        <Button variant="secondary" onClick={onBack}>Back</Button>
      </div>
    </form>
  );
}

export default Selections;
