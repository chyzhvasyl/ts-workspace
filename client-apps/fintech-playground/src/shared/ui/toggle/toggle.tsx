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
        aria-checked={checked}
        className={`${styles.track} ${checked ? styles.on : ''}`}
        disabled={disabled}
        role="switch"
        type="button"
        onClick={() => onCheckedChange(!checked)}
      >
        <span className={styles.thumb} />
      </button>
      {label && <span className={styles.label}>{label}</span>}
    </label>
  );
}
