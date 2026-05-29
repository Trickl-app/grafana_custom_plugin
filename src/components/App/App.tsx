import React, { useState, useEffect } from 'react';
import { AppRootProps } from '@grafana/data';
import { Button, useStyles2 } from '@grafana/ui';
import axios from 'axios';
import { mockRecs } from './mockData';
import { Recommendation } from './types';
import { getStyles } from './styles';
import RecommendationItem from './RecommendationItem';

interface AcceptedLabels {
  [key: string]: {
    problemLabels: string[];
    allLabels: string[];
  };
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
      if (process.env.NODE_ENV === 'development') {
        setRecs(mockRecs.sort((a, b) => b.estimated_reduction_percent - a.estimated_reduction_percent));
        return;
      }
      try {
        const res = await axios.get<Recommendation[]>(`${apiUrl}/api/recommendations`);
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
