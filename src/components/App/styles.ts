import { GrafanaTheme2 } from '@grafana/data';
import { css } from '@emotion/css';

export const getStyles = (theme: GrafanaTheme2) => ({
  container: css`
    padding: ${theme.spacing(2)};
  `,
  title: css`
    margin-bottom: ${theme.spacing(2)};
    font-size: ${theme.typography.h4.fontSize};
    font-weight: ${theme.typography.fontWeightMedium};
  `,
  list: css`
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    flex-direction: column;
    gap: ${theme.spacing(2)};
  `,
  card: css`
    background: ${theme.colors.background.secondary};
    border: 1px solid ${theme.colors.border.weak};
    border-radius: ${theme.shape.borderRadius(2)};
    padding: ${theme.spacing(2)};
  `,
  metricName: css`
    font-size: ${theme.typography.h5.fontSize};
    font-weight: ${theme.typography.fontWeightMedium};
    margin-bottom: ${theme.spacing(1)};
    color: ${theme.colors.text.primary};
  `,
  detail: css`
    color: ${theme.colors.text.secondary};
    margin-bottom: ${theme.spacing(0.5)};
    font-size: ${theme.typography.bodySmall.fontSize};
  `,
  answerText: css`
    color: ${theme.colors.text.primary};
    margin-bottom: ${theme.spacing(2)};
    line-height: 1.5;
    white-space: pre-wrap;
  `,
  metadataRow: css`
    display: flex;
    flex-wrap: wrap;
    gap: ${theme.spacing(1.5)};
    color: ${theme.colors.text.secondary};
    font-size: ${theme.typography.bodySmall.fontSize};
    margin-bottom: ${theme.spacing(0.75)};
  `,
  explanation: css`
    color: ${theme.colors.text.secondary};
    font-style: italic;
    margin-bottom: ${theme.spacing(1.5)};
    font-size: ${theme.typography.bodySmall.fontSize};
  `,
  sectionTitle: css`
    color: ${theme.colors.text.primary};
    font-weight: ${theme.typography.fontWeightMedium};
    margin-top: ${theme.spacing(1.5)};
    margin-bottom: ${theme.spacing(0.5)};
  `,
  textArea: css`
    width: 100%;
    min-height: 96px;
    resize: vertical;
    color: ${theme.colors.text.primary};
    background: ${theme.colors.background.primary};
    border: 1px solid ${theme.colors.border.medium};
    border-radius: ${theme.shape.borderRadius(2)};
    padding: ${theme.spacing(1)};
    font-family: ${theme.typography.fontFamily};
  `,
  evidenceList: css`
    color: ${theme.colors.text.secondary};
    margin-top: 0;
    padding-left: ${theme.spacing(3)};
  `,
  suggestionTitle: css`
    color: ${theme.colors.text.secondary};
    font-size: ${theme.typography.bodySmall.fontSize};
    margin-top: ${theme.spacing(1.5)};
    margin-bottom: ${theme.spacing(1)};
  `,
  suggestionList: css`
    display: flex;
    flex-wrap: wrap;
    gap: ${theme.spacing(1)};
  `,
  errorText: css`
    color: ${theme.colors.error.text};
    margin-top: ${theme.spacing(2)};
  `,
  actions: css`
    display: flex;
    gap: ${theme.spacing(1)};
    margin-top: ${theme.spacing(1.5)};
  `,
  statusAccepted: css`
    color: ${theme.colors.success.text};
    font-weight: ${theme.typography.fontWeightMedium};
  `,
  statusDeclined: css`
    color: ${theme.colors.error.text};
    font-weight: ${theme.typography.fontWeightMedium};
  `,
  submitRow: css`
    margin-top: ${theme.spacing(3)};
    display: flex;
    gap: ${theme.spacing(1)};
  `,
});
