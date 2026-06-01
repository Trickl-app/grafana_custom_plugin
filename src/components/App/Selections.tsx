import React from 'react';
import { AppEvents } from '@grafana/data';
import { getAppEvents } from '@grafana/runtime';
import { Button, Combobox, ComboboxOption, RadioButtonGroup, useStyles2 } from '@grafana/ui';
import axios from 'axios';
import { AcceptedLabels } from './types';
import { getStyles } from './styles';

interface SelectionsProps {
  selections: AcceptedLabels;
  setSelections: React.Dispatch<React.SetStateAction<AcceptedLabels>>;
  apiUrl: string;
  onBack: () => void;
  onRefresh: () => Promise<void>;
}

const modeOptions = [
  { label: 'Drop labels only', value: false },
  { label: 'Aggregate', value: true },
];

const intervalOptions: Array<ComboboxOption<string>> = [
  { label: '1m', value: '1m' },
  { label: '5m', value: '5m' },
  { label: '15m', value: '15m' },
];

function Selections({ selections, setSelections, apiUrl, onBack, onRefresh }: SelectionsProps) {
  const styles = useStyles2(getStyles);

  const handleModeChange = (metricName: string, aggregate: boolean) => {
    setSelections(prev => ({
      ...prev,
      [metricName]: {
        ...prev[metricName],
        aggregate,
        interval: aggregate ? (prev[metricName].interval ?? '1m') : undefined,
      },
    }));
  };

  const handleIntervalChange = (metricName: string, option: ComboboxOption<string>) => {
    setSelections(prev => ({
      ...prev,
      [metricName]: { ...prev[metricName], interval: option.value as '1m' | '5m' | '15m' },
    }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    console.log(selections);
    await axios.post(`${apiUrl}/api/acceptedRecommendations`, selections);
    getAppEvents().publish({ type: AppEvents.alertSuccess.name, payload: ['Recommendations submitted successfully. Redirecting to recommendations.'] });
    await onRefresh();
    onBack();
  };

  return (
    <form onSubmit={handleSubmit} className={styles.container}>
      <h3 className={styles.title}>Your Selections</h3>
      <ul className={styles.list}>
        {Object.entries(selections).map(([metricName, { problemLabels, aggregate, interval }]) => (
          <li key={metricName} className={styles.card}>
            <div className={styles.metricName}>{metricName}</div>
            <div className={styles.detail}>Labels to drop: {problemLabels.join(', ')}</div>
            <div className={styles.actions}>
              <RadioButtonGroup
                options={modeOptions}
                value={aggregate ?? false}
                onChange={(value) => handleModeChange(metricName, value)}
              />
              {aggregate && (
                <Combobox
                  options={intervalOptions}
                  value={interval ?? null}
                  onChange={(option) => handleIntervalChange(metricName, option)} // option is the selected ComboboxOption object ({ label, value }) passed automatically by Combobox
                  placeholder="Select interval"
                  width={12}
                />
              )}
            </div>
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
