import { useRef } from 'react';

import styles from './render-count.module.scss';

interface RenderCountProps {
  label?: string;
}

export function RenderCount({ label = 'Renders' }: RenderCountProps) {
  const countRef = useRef(0);

  countRef.current++;

  return (
    <span className={styles.count}>
      {label}: <strong>{countRef.current}</strong>
    </span>
  );
}
