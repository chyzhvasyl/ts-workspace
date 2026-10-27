import { useRef, useState } from 'react';

import type { Currency } from '../../shared/domain/money';
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
import type { PayoutForm as PayoutFormValues } from './validators';

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
      subtitle="Контрольована форма з валідацією і фокусом на першу помилку"
      title="Запит на виплату (payout)"
    >
      <form
        style={{ display: 'grid', gap: 16, maxWidth: 460 }}
        onSubmit={(e) => {
          e.preventDefault();
          const ok = form.submit();

          if (!ok) amountRef.current?.focus();
        }}
      >
        <Field error={showError('amountMajor')} label="Сума">
          <NumberInput
            invalid={Boolean(showError('amountMajor'))}
            ref={amountRef}
            value={form.values.amountMajor}
            onBlur={() => form.setTouched('amountMajor')}
            onValueChange={(v) => form.setValue('amountMajor', v)}
          />
        </Field>
        <Field label="Валюта">
          <Select
            options={CURRENCIES}
            value={form.values.currency}
            onValueChange={(v) => form.setValue('currency', v)}
          />
        </Field>
        <Field error={showError('iban')} hint="напр. DE89370400440532013000" label="IBAN">
          <TextInput
            invalid={Boolean(showError('iban'))}
            value={form.values.iban}
            onBlur={() => form.setTouched('iban')}
            onChange={(e) => form.setValue('iban', e.target.value.toUpperCase())}
          />
        </Field>
        <Field error={showError('scheduleAt')} label="Дата виплати">
          <TextInput
            invalid={Boolean(showError('scheduleAt'))}
            type="date"
            value={form.values.scheduleAt}
            onBlur={() => form.setTouched('scheduleAt')}
            onChange={(e) => form.setValue('scheduleAt', e.target.value)}
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
          <Callout title="Виплату прийнято" tone="success">
            <code>{JSON.stringify(submitted)}</code>
          </Callout>
        </div>
      )}
    </Card>
  );
}
