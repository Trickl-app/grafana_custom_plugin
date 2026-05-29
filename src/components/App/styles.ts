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
  explanation: css`
    color: ${theme.colors.text.secondary};
    font-style: italic;
    margin-bottom: ${theme.spacing(1.5)};
    font-size: ${theme.typography.bodySmall.fontSize};
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
  `,
});
