import styles from './toggle.module.scss';

interface ToggleProps {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  label?: string;
  disabled?: boolean;
}

export function Toggle({
  checked,
  onCheckedChange,
  label,
  disabled = false,
}: ToggleProps) {
  return (
    <label className={`${styles.wrap} ${disabled ? styles.disabled : ''}`}>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        className={`${styles.track} ${checked ? styles.on : ''}`}
        onClick={() => onCheckedChange(!checked)}
      >
        <span className={styles.thumb} />
      </button>
      {label && <span className={styles.label}>{label}</span>}
    </label>
  );
}
