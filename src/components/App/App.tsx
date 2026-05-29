import React, { useState, useEffect } from 'react';
import { AppRootProps } from '@grafana/data';
import { Button, useStyles2 } from '@grafana/ui';
import axios from 'axios';
import { mockRecs } from './mockData';
import { Recommendation, AcceptedLabels } from './types';
import { getStyles } from './styles';
import RecommendationItem from './RecommendationItem';
import Selections from './Selections';

// const submitSelections = async (apiUrl: string, output: AcceptedLabels) => {
//   await axios.post(`${apiUrl}/api/acceptedRecommendations`, output);
//   alert('The bike is operational! Check the VM Agent yaml file; it should now reflect your accepted recommendations.');
// };

function App(props: AppRootProps) {
  // apiUrl is provisioned at container startup via apps.yaml → SMART_METRICS_API_URL.
  // Fallback to localhost only for local development (docker-compose).
  const apiUrl = (props.meta.jsonData as { apiUrl?: string })?.apiUrl ?? 'http://localhost:3001';
  const [recs, setRecs] = useState<Recommendation[]>([]);
  const [showSelections, setShowSelections] = useState(false);
  const [selections, setSelections] = useState<AcceptedLabels>({});
  const styles = useStyles2(getStyles);

  const handleAccept = (rec: Recommendation) => {
    setRecs(prev => prev.map(currRec => currRec === rec ? { ...rec, status: 'accepted' } : currRec));
  };

  const handleDecline = (rec: Recommendation) => {
    setRecs(prev => prev.map(currRec => currRec === rec ? { ...rec, status: 'declined' } : currRec));
  };

  const handleReset = (rec: Recommendation) => {
    setRecs(prev => prev.map(currRec => currRec === rec ? { ...rec, status: 'pending' } : currRec));
  };

  const handleAcceptAll = () => setRecs(prev => prev.map(rec => ({ ...rec, status: 'accepted' })));
  const handleDeclineAll = () => setRecs(prev => prev.map(rec => ({ ...rec, status: 'declined' })));
  const handleResetAll = () => setRecs(prev => prev.map(rec => ({ ...rec, status: 'pending' })));

  const handleProceed = () => {
    let resolvedRecs = recs;
    if (recs.some(rec => rec.status === 'pending')) {
      const proceed = window.confirm(
        'You have pending recommendations. If you proceed, they will be marked as declined. Proceed?'
      );
      if (!proceed) {
        return;
      }
      resolvedRecs = recs.map(rec => rec.status === 'pending' ? { ...rec, status: 'declined' } : rec);
      setRecs(resolvedRecs);
    }
    const output: AcceptedLabels = {};
    resolvedRecs.forEach(rec => {
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
    setSelections(output);
    setShowSelections(true);
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

  if (showSelections) {
    return <Selections selections={selections} onBack={() => setShowSelections(false)} />;
  }

  return (
    <div className={styles.container}>
      <h3 className={styles.title}>Recommendations</h3>
      <ul className={styles.list}>
        {recs.map(rec => (
          <RecommendationItem
            key={rec.metric_name + ' ' + rec.problem_label}
            rec={rec}
            handleAccept={handleAccept}
            handleDecline={handleDecline}
            handleReset={handleReset}
          />
        ))}
      </ul>
      <div className={styles.submitRow}>
        <Button variant="primary" onClick={handleProceed}>Proceed</Button>
        <Button variant="secondary" onClick={handleAcceptAll}>Mark all accepted</Button>
        <Button variant="secondary" onClick={handleDeclineAll}>Mark all declined</Button>
        <Button variant="secondary" onClick={handleResetAll}>Reset all</Button>
      </div>
    </div>
  );
}

export default App;
