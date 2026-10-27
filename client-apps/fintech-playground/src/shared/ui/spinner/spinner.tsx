import styles from './spinner.module.scss';

interface SpinnerProps {
  label?: string;
}

export function Spinner({ label }: SpinnerProps) {
  return (
    <div className={styles.wrap}>
      <span className={styles.ring} />
      {label && <span>{label}</span>}
    </div>
  );
}
