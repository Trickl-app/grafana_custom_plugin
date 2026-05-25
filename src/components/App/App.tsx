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

interface RecommendationItemProps {
  rec: Recommendation,
  handleAccept: (rec: Recommendation) => void,
  handleDecline: (rec: Recommendation) => void;
}

interface AcceptedLabels {
  [key: string]: {
    problemLabels: string[];
    allLabels: string[];
  }
}

function RecommendationItem({ rec, handleAccept, handleDecline }: RecommendationItemProps) {

  const executeHandleAccept = (event: React.SyntheticEvent): void => {
    event.preventDefault();
    handleAccept(rec);
  }

  const executeHandleDecline = (event: React.SyntheticEvent): void => {
    event.preventDefault();
    handleDecline(rec);
  }
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
      <button onClick={executeHandleAccept}>Accept</button>
      <button onClick={executeHandleDecline}>Decline</button>
    </li>
  )
}

// type Decision = 'accepted' | 'declined' | 'pending';

function App(_props: AppRootProps) {
  const [recs, setRecs] = useState<Recommendation[]>([]);
  const handleAccept = (rec: Recommendation) => {
    setRecs(prev => prev.map(currRec => currRec === rec ? {...rec, status: 'accepted' } : currRec));
  };

  const handleDecline = (rec: Recommendation) => {
    setRecs(prev => prev.map(currRec => currRec === rec ? {...rec, status: 'declined' } : currRec));
  };

  const handleSubmit = async (event: React.SyntheticEvent) => {
    event?.preventDefault();
    if (recs.some(rec => rec.status === "pending")) {
      alert("you have some pending decisions; please accept or reject all objects.");
      return;
    }
    const output: AcceptedLabels = {};
    recs.forEach(rec => {
      if (rec.status === "accepted") {
        if (rec.metric_name in output) {
          output[rec.metric_name].problemLabels.push(rec.problem_label);
        } else {
          output[rec.metric_name] = {
            problemLabels: [rec.problem_label],
            allLabels: [...rec.remaining_labels, rec.problem_label]
          }
        }
      }
    })
    console.log(output);
    await axios.post("http://localhost:3001/api/acceptedRecommendations", output);
  }

  useEffect(() => {
    console.log(recs);
  }, [recs])

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
    <form onSubmit={handleSubmit}>
      <h3>recommendations:</h3>
      {recs.map(rec => <RecommendationItem 
        key={rec.metric_name + ' ' + rec.problem_label} 
        rec={rec}
        handleAccept={handleAccept}
        handleDecline={handleDecline}
      />)}
      <button type='submit'>Submit</button>
    </form>
  );
}

export default App;
