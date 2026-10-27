import { PayoutErrors, PayoutForm } from './validators';

export interface UseFormResult {
  values: PayoutForm;
  errors: PayoutErrors;
  touched: Partial<Record<keyof PayoutForm, boolean>>;
  setValue: <K extends keyof PayoutForm>(key: K, value: PayoutForm[K]) => void;
  setTouched: (key: keyof PayoutForm) => void;
  /** Validates everything, marks all touched. Returns true if valid. */
  submit: () => boolean;
  reset: () => void;
}

/**
 * 🎯 TODO: a tiny form hook (the kind you'd build instead of pulling Formik).
 *  - Hold `values`, `errors`, `touched` in state.
 *  - setValue updates one field (immutably) and re-validates.
 *  - errors should only surface for touched fields (let the component decide,
 *    or expose full errors + touched and let UI gate them).
 *  - submit(): validate all, mark all touched, call onValid(values) if clean,
 *    return whether it was valid.
 */
export function useForm(
  initial: PayoutForm,
  onValid: (values: PayoutForm) => void,
): UseFormResult {
  // TODO: implement with useState + validatePayout.
  throw new Error('useForm is not implemented yet');
}
