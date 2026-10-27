# Завдання 6 — Форма виплати (forms + custom useForm)

**Рівень:** middle · **Концепти:** controlled forms, validation, custom hook, `useRef`

## Що зробити

Реалізуй `validatePayout` (сума/IBAN/дата) і хук `useForm` (values/errors/touched/setValue/submit/reset). На невалідний submit фокусуй перше помилкове поле через ref.

## Філософія

> Контрольований компонент = стан React є єдиним джерелом правди для інпута. Логіку форми інкапсулюй у власний хук — так її легко перевикористати й протестувати. `useRef` — легальний місток до імперативного DOM (focus, scroll).
