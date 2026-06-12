import type { ReactNode } from 'react';
type ProgressMetricCellProps = {
    topLabel?: ReactNode;
    primaryLabel: ReactNode;
    secondaryLabel?: ReactNode;
    percent: number;
    bottomLabel?: ReactNode;
    bottomLeftLabel?: ReactNode;
    bottomRightLabel?: ReactNode;
};
export default function ProgressMetricCell({ topLabel, primaryLabel, secondaryLabel, percent, bottomLabel, bottomLeftLabel, bottomRightLabel, }: ProgressMetricCellProps): import("react/jsx-runtime").JSX.Element;
export {};
