import React, { useState } from 'react';
import { Button, useStyles2 } from '@grafana/ui';
import axios from 'axios';
import { AiInvestigationResult } from './types';
import { getStyles } from './styles';

interface AiInvestigatorProps {
  apiUrl: string;
}

const suggestedQuestions = [
  'Why did cardinality spike today?',
  'What should I review first?',
  'Is request_id used in Grafana?',
  'Which metrics have the most series?',
  'What aggregation rules already exist?',
];

function AiInvestigator({ apiUrl }: AiInvestigatorProps) {
  const styles = useStyles2(getStyles);
  const [question, setQuestion] = useState('Why did cardinality spike today?');
  const [result, setResult] = useState<AiInvestigationResult | null>(null);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const askMetropolis = async () => {
    setError('');
    setResult(null);
    setIsLoading(true);

    try {
      const response = await axios.post<AiInvestigationResult>(`${apiUrl}/api/ai/investigate`, {
        question,
        date: new Date().toISOString().slice(0, 10),
      });

      setResult(response.data);
    } catch (err) {
      console.error('Failed to run AI investigation:', err);
      setError('Metropolis could not run the investigation.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.metricName}>Ask Metropolis</div>
        <textarea
          className={styles.textArea}
          value={question}
          onChange={event => setQuestion(event.currentTarget.value)}
        />
        <div className={styles.suggestionTitle}>Suggested questions</div>
        <div className={styles.suggestionList}>
          {suggestedQuestions.map(suggestedQuestion => (
            <Button
              key={suggestedQuestion}
              size="sm"
              variant="secondary"
              type="button"
              onClick={() => setQuestion(suggestedQuestion)}
            >
              {suggestedQuestion}
            </Button>
          ))}
        </div>
        <div className={styles.submitRow}>
          <Button variant="primary" onClick={askMetropolis} disabled={isLoading || question.trim() === ''}>
            {isLoading ? 'Investigating...' : 'Ask'}
          </Button>
        </div>
      </div>

      {error && <div className={styles.errorText}>{error}</div>}

      {result && (
        <div className={styles.card}>
          <div className={styles.metricName}>Cardinality risk: {result.riskLevel}</div>
          <div className={styles.detail}>Question class: {result.questionClass}</div>
          <div className={styles.detail}>{result.summary}</div>

          <div className={styles.sectionTitle}>Evidence</div>
          <ul className={styles.evidenceList}>
            {result.evidence.map(item => (
              <li key={item}>{item}</li>
            ))}
          </ul>

          <div className={styles.sectionTitle}>Likely cause</div>
          <div className={styles.detail}>{result.likelyCause}</div>

          <div className={styles.sectionTitle}>Suggested next action</div>
          <div className={styles.detail}>{result.suggestedNextAction}</div>
        </div>
      )}
    </div>
  );
}

export default AiInvestigator;
