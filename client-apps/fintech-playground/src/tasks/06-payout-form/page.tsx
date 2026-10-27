import { TaskPage } from '../../pages/task-page';

import { PayoutForm } from './payout-form';

export const meta = {
  id: 'payout-form',
  order: 6,
  title: 'Форма виплати',
  difficulty: 'middle' as const,
  concepts: [
    'controlled forms',
    'validation',
    'custom hook',
    'useRef',
    'touched/dirty state',
  ],
  summary:
    'Контрольовані форми — хліб фронтендера. Збери власний useForm (без Formik), із валідацією, станом touched і фокусом на першу помилку через ref.',
};

export function PayoutFormPage() {
  return (
    <TaskPage
      acceptance={[
        'Помилка показується лише після blur (touched), не одразу.',
        'Невалідна форма не сабмітиться; валідна викликає onValid.',
        'IBAN приводиться до uppercase і валідується регуляркою.',
        'Submit невалідної форми фокусує поле суми.',
      ]}
      hints={[
        'Контрольований інпут: value зі стану + onChange у стан. Єдине джерело правди — стан.',
        'touched: позначай поле при onBlur; показуй errors[key] лише якщо touched[key].',
        'useRef для імперативних дій (focus) — це валідний escape hatch із декларативного React.',
      ]}
      meta={meta}
      requirements={[
        <>
          Реалізуй <code>validatePayout</code> у <code>validators.ts</code> (сума, IBAN,
          дата).
        </>,
        <>
          Реалізуй хук <code>useForm</code> (values, errors, touched, setValue, submit,
          reset).
        </>,
        <>
          На невалідний submit — сфокусуй перше помилкове поле через <code>useRef</code>.
        </>,
      ]}
    >
      <PayoutForm />
    </TaskPage>
  );
}
