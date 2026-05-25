import React from 'react';
import { useState, useEffect } from 'react';
import { AppRootProps } from '@grafana/data';
import axios from 'axios';

interface Recommendation {
  metric_name: string;
  status: "pending";
  problem_label: string;
  remaining_labels: string[];
  estimated_current_series: number;
  estimated_after_series: number;
  estimated_reduction_percent: number;
  explanation: string;
}

interface RecommendationProps {
  rec: Recommendation
}

function Recommendation(props: RecommendationProps) {
  const rec = props.rec
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
      <button>accept</button>
      <button>reject</button>
    </li>
  )
}

function App(_props: AppRootProps) {
  const [recs, setRecs] = useState<Recommendation[]>([]);

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
      {recs.map(rec => <Recommendation rec={rec} />)}
    </div>
  );
}

export default App;
