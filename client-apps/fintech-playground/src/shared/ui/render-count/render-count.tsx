import { useRef } from 'react';

import styles from './render-count.module.scss';

interface RenderCountProps {
  label?: string;
}

/** Increments every render — handy to *see* re-renders in perf tasks. */
export function RenderCount({ label = 'Renders' }: RenderCountProps) {
  const count = useRef(0);
  count.current++;
  return (
    <span className={styles.count}>
      {label}: <strong>{count.current}</strong>
    </span>
  );
}
