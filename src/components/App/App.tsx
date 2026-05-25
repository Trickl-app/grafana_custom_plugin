import React, { useState, useEffect } from 'react';
import { AppRootProps } from '@grafana/data';
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

interface RecommendationProps {
  rec: Recommendation,
  handleAccept: (rec: Recommendation) => void,
  handleDecline: (rec: Recommendation) => void;
}

function RecommendationItem({ rec, handleAccept, handleDecline }: RecommendationProps) {
  return (
    <li>
      <div>
        Metric Name: {rec.metric_name}
      </div>
      <div>
        Problem Labels: {rec.problem_label}
      </div>
      <div>
        Estimated reduction metric series: {rec.estimated_reduction_percent}%
      </div>
      <button onClick={() => {handleAccept(rec)}}>Accept</button>
      <button onClick={() => {handleDecline(rec)}}>Decline</button>
    </li>
  )
}

type Decision = 'accepted' | 'declined' | 'pending';

function App(_props: AppRootProps) {
  const [recs, setRecs] = useState<Recommendation[]>([]);

  const handleAccept = (rec: Recommendation) => {
    setRecs(recs.map(currRec => currRec === rec ? {...rec, status: 'accepted' } : currRec));
    console.log(recs)
  };

  const handleDecline = (rec: Recommendation) => {
    setRecs(recs.map(currRec => currRec === rec ? {...rec, status: 'declined' } : currRec));
    console.log(recs)
  };

  useEffect(() => {
    const getAndSetRecs = async () => {
      try {
        const res = await axios.get<Recommendation[]>('http://localhost:3001/api/recommendations');
        console.log('recommendations response:', res.data);
        setRecs(res.data);
      } catch (err) {
        console.error('Failed to fetch recommendations:', err);
      }
    };
    getAndSetRecs();
  }, []);

  return (
    <div>
      <h1>recommendations:</h1>
      {recs.map(rec => <RecommendationItem 
      key={rec.metric_name + ' ' + rec.problem_label} 
      rec={rec}
      handleAccept={handleAccept}
      handleDecline={handleDecline}
    />)}
    </div>
  );
}

export default App;
