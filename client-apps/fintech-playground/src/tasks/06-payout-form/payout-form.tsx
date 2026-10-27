import { useRef, useState } from 'react';

import { Currency } from '../../shared/domain/money';
import {
  Button,
  Callout,
  Card,
  Field,
  NumberInput,
  Select,
  TextInput,
} from '../../shared/ui';
import { useForm } from './use-form';
import { PayoutForm as PayoutFormValues } from './validators';

const CURRENCIES = [
  { value: 'USD', label: 'USD' },
  { value: 'EUR', label: 'EUR' },
  { value: 'GBP', label: 'GBP' },
  { value: 'UAH', label: 'UAH' },
  { value: 'PLN', label: 'PLN' },
] as const;

const INITIAL: PayoutFormValues = {
  amountMajor: '',
  currency: 'USD',
  iban: '',
  scheduleAt: '',
};

export function PayoutForm() {
  const [submitted, setSubmitted] = useState<PayoutFormValues | null>(null);
  const amountRef = useRef<HTMLInputElement>(null);

  const form = useForm(INITIAL, (values) => {
    setSubmitted(values);
    // 🎯 BONUS: on invalid submit, focus the first errored field via a ref.
  });

  const showError = (key: keyof PayoutFormValues) =>
    form.touched[key] ? form.errors[key] : undefined;

  return (
    <Card
      title="Запит на виплату (payout)"
      subtitle="Контрольована форма з валідацією і фокусом на першу помилку"
    >
      <form
        onSubmit={(e) => {
          e.preventDefault();
          const ok = form.submit();
          if (!ok) amountRef.current?.focus();
        }}
        style={{ display: 'grid', gap: 16, maxWidth: 460 }}
      >
        <Field label="Сума" error={showError('amountMajor')}>
          <NumberInput
            ref={amountRef}
            value={form.values.amountMajor}
            onValueChange={(v) => form.setValue('amountMajor', v)}
            onBlur={() => form.setTouched('amountMajor')}
            invalid={Boolean(showError('amountMajor'))}
          />
        </Field>
        <Field label="Валюта">
          <Select
            value={form.values.currency}
            options={CURRENCIES}
            onValueChange={(v) => form.setValue('currency', v as Currency)}
          />
        </Field>
        <Field label="IBAN" hint="напр. DE89370400440532013000" error={showError('iban')}>
          <TextInput
            value={form.values.iban}
            onChange={(e) => form.setValue('iban', e.target.value.toUpperCase())}
            onBlur={() => form.setTouched('iban')}
            invalid={Boolean(showError('iban'))}
          />
        </Field>
        <Field label="Дата виплати" error={showError('scheduleAt')}>
          <TextInput
            type="date"
            value={form.values.scheduleAt}
            onChange={(e) => form.setValue('scheduleAt', e.target.value)}
            onBlur={() => form.setTouched('scheduleAt')}
            invalid={Boolean(showError('scheduleAt'))}
          />
        </Field>

        <div style={{ display: 'flex', gap: 10 }}>
          <Button type="submit">Створити виплату</Button>
          <Button
            type="button"
            variant="secondary"
            onClick={() => {
              form.reset();
              setSubmitted(null);
            }}
          >
            Скинути
          </Button>
        </div>
      </form>

      {submitted && (
        <div style={{ marginTop: 16 }}>
          <Callout tone="success" title="Виплату прийнято">
            <code>{JSON.stringify(submitted)}</code>
          </Callout>
        </div>
      )}
    </Card>
  );
}
