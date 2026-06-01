import React, { useState, useEffect } from 'react';
import { AppRootProps } from '@grafana/data';
import { Button, Tab, TabsBar, TabContent, useStyles2 } from '@grafana/ui';
import axios from 'axios';
import { mockRecs } from './mockData';
import { ActiveTab, Recommendation, AcceptedLabels, Aggregation, DroppedLabel } from './types';
import { getStyles } from './styles';
import RecommendationItem from './RecommendationItem';
import Selections from './Selections';
import AggregationItem from './AggregationItem';
import DroppedLabelItem from './DroppedLabelItem';
import AiInvestigator from './AiInvestigator';


// const submitSelections = async (apiUrl: string, output: AcceptedLabels) => {
//   await axios.post(`${apiUrl}/api/acceptedRecommendations`, output);
//   alert('The bike is operational! Check the VM Agent yaml file; it should now reflect your accepted recommendations.');
// };

function App(props: AppRootProps) {
  // apiUrl is provisioned at container startup via apps.yaml → SMART_METRICS_API_URL.
  // Fallback to localhost only for local development (docker-compose).
  const apiUrl = (props.meta.jsonData as { apiUrl?: string })?.apiUrl ?? 'http://localhost:3001';
  const [activeTab, setActiveTab] = useState<ActiveTab>('recommendations');
  const [recs, setRecs] = useState<Recommendation[]>([]);
  const [aggs, setAggs] = useState<Aggregation[]>([]);
  const [droppedLabels, setDroppedLabels] = useState<DroppedLabel[]>([])
  const [deletedAggs, setDeletedAggs] = useState<Aggregation[]>([]);
  const [deletedLabels, setDeletedLabels] = useState<{ id: number; label: string }[]>([]);
  const [showSelections, setShowSelections] = useState(false);
  const [selections, setSelections] = useState<AcceptedLabels>({});
  const styles = useStyles2(getStyles);

  const handleAccept = (rec: Recommendation) => {
    setRecs(prev => prev.map(currRec => currRec === rec ? { ...rec, status: 'accepted' } : currRec));
  };

  const handleDecline = (rec: Recommendation) => {
    setRecs(prev => prev.map(currRec => currRec === rec ? { ...rec, status: 'declined' } : currRec));
  };

  const handleDeleteAgg = (agg: Aggregation) => {
    setDeletedAggs(prev => [...prev, agg]);
  };

  const handleUndoDeleteAgg = (agg: Aggregation) => {
    setDeletedAggs(prev => prev.filter(d => d.metric_name !== agg.metric_name));
  };

  const handleDeleteLabel = (entry: DroppedLabel, label: string) => {
    setDeletedLabels(prev => [...prev, { id: entry.id, label }]);
  };

  const handleUndoDeleteLabel = (entry: DroppedLabel, label: string) => {
    setDeletedLabels(prev => prev.filter(d => !(d.id === entry.id && d.label === label)));
  };

  const handleDeleteLabels = async () => {
    const labelIds = [...new Set(deletedLabels.map(d => d.id))];
    try {
      await axios.delete(`${apiUrl}/api/aggregations`, { data: labelIds });
    } catch (err) {
      console.error('Failed to send deleted labels:', err);
    }
  };

  const handleDeleteAggs = async() => {
    const aggIds = deletedAggs.map(agg => agg.id);
    const aggsKept = aggs.filter(agg => !deletedAggs.includes(agg))
    console.log(aggIds)
    try {
      await axios.delete(`${apiUrl}/api/aggregations`, { data: aggIds });
      setAggs(aggsKept)
    } catch (err) {
      console.error('Failed to send deleted aggregations:', err);
    }
  }

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
    // we actually use object.entries in both other components and backend, might just be worth changing
    // this here to that data structure in the first place and then saving the two entries calls.
    const output: AcceptedLabels = {};
    resolvedRecs.forEach(rec => {
      if (rec.status === 'accepted') {
        if (rec.metric_name in output) {
          output[rec.metric_name].problemLabels.push(rec.problem_label);
        } else {
          output[rec.metric_name] = {
            ...selections[rec.metric_name],
            problemLabels: [rec.problem_label],
            allLabels: [...rec.remaining_labels, rec.problem_label],
          };
        }
      }
    });
    setSelections(output);
    setShowSelections(true);
  };

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

  const getAndSetAggsAndDroppedLabels = async () => {
    try {
      const response = await axios.get<Aggregation[]>(`${apiUrl}/api/aggregations`);
      const aggregations: Aggregation[] = response.data.filter(aggregation => aggregation.json_snippet.aggregate)
      const droppedLabels: Aggregation[] = response.data.filter(aggregation => !aggregation.json_snippet.aggregate)
      setAggs([...aggregations]);
      setDroppedLabels([...droppedLabels])
    } catch (err) {
      console.error('Failed to fetch aggregations:', err);
    }
  };

  const fetchData = async () => {
    await getAndSetRecs();
    await getAndSetAggsAndDroppedLabels();
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (showSelections) {
    return <Selections selections={selections} setSelections={setSelections} apiUrl={apiUrl} onBack={() => setShowSelections(false)} onRefresh={fetchData} />;
  }

  return (
    <>
      <TabsBar>
        <Tab
          label="Recommendations"
          active={activeTab === 'recommendations'}
          onChangeTab={() => setActiveTab('recommendations')}
        />
        <Tab
          label="Aggregations"
          active={activeTab === 'aggregations'}
          onChangeTab={() => setActiveTab('aggregations')}
        />
        <Tab
          label="Dropped Labels"
          active={activeTab === 'droppedLabels'}
          onChangeTab={() => setActiveTab('droppedLabels')}
        />
        <Tab
          label="AI Investigator"
          active={activeTab === 'investigator'}
          onChangeTab={() => setActiveTab('investigator')}
        />
      </TabsBar>
      <TabContent>
        {activeTab === 'recommendations' && (
          <div className={styles.container}>
            {recs.length === 0 ? (
              <p>No recommendations at this time. Your metrics system is running efficiently with no high-cardinality issues detected.</p>
            ) : (
              <>
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
              </>
            )}
          </div>
        )}
        {activeTab === 'aggregations' && (
          <div className={styles.container}>
            {aggs.length === 0 ? (
              <p>No aggregations to display.</p>
            ) : (
              <>
                <ul className={styles.list}>
                  {aggs.map(agg => (
                    <AggregationItem
                      key={agg.metric_name + ' ' + agg.labels}
                      agg={agg}
                      deletedAggs={deletedAggs}
                      handleDeleteAgg={handleDeleteAgg}
                      handleUndoDeleteAgg={handleUndoDeleteAgg}
                    />
                  ))}
                </ul>
                <div className={styles.submitRow}>
                  <Button variant="primary" onClick={handleDeleteAggs}>Submit</Button>
                </div>
              </>
            )}
          </div>
        )}
        {activeTab === 'droppedLabels' && (
          <div className={styles.container}>
            {droppedLabels.length === 0 ? (
              <p>No dropped labels to display.</p>
            ) : (
              <>
                <ul className={styles.list}>
                  {droppedLabels.map(entry => (
                    <DroppedLabelItem
                      key={entry.id}
                      entry={entry}
                      deletedLabels={deletedLabels}
                      handleDeleteLabel={handleDeleteLabel}
                      handleUndoDeleteLabel={handleUndoDeleteLabel}
                    />
                  ))}
                </ul>
                <div className={styles.submitRow}>
                  <Button variant="primary" onClick={handleDeleteLabels}>Submit</Button>
                </div>
              </>
            )}
          </div>
        )}
        {activeTab === 'investigator' && (
          <AiInvestigator apiUrl={apiUrl} />
        )}
      </TabContent>
    </>
  );
}

export default App;
