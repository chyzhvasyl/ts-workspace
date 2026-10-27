import { DemoBlock } from '../../shared/demo-block/demo-block';

import { BatchingDemo } from './demos/batching-demo';
import { KeysDemo } from './demos/keys-demo';
import { ReRenderDemo } from './demos/re-render-demo';

import styles from './rendering-page.module.scss';

export function RenderingPage() {
  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <span className={styles.tag}>Частина 1</span>
        <h1 className={styles.title}>Rendering & Reconciliation</h1>
        <p className={styles.subtitle}>
          Три причини ре-рендеру, React.memo, useCallback, key prop і batching
        </p>
      </div>

      <DemoBlock
        badge="info"
        badgeText="Ключова тема"
        code={`// ❌ ChildNoMemo ре-рендериться кожен раз
function ChildNoMemo({ name }: { name: string }) {
  return <div>{name}</div>;
}

// ✅ ChildMemo ре-рендериться тільки якщо name змінилась
const ChildMemo = memo(function ChildMemo({ name }: { name: string }) {
  return <div>{name}</div>;
});

// ❌ memo не допомагає — onClick нова функція кожен рендер
const handleClickBad = () => console.log('click'); // new ref!

// ✅ useCallback стабілізує посилання на функцію
const handleClickGood = useCallback(() => console.log('click'), []);`}
        description="Будь-який ре-рендер батька → ре-рендер дочірніх компонентів, навіть якщо props не змінились. React.memo вирішує це, але тільки якщо всі props стабільні за посиланням."
        title="Re-render та React.memo"
      >
        <ReRenderDemo />
      </DemoBlock>

      <DemoBlock
        badge="warning"
        badgeText="Часта помилка"
        code={`// ❌ Погано — index як key
{items.map((item, i) => (
  <ListItem key={i} {...item} />
))}
// При видаленні першого елементу — React перерендерить ВСЕ

// ✅ Добре — стабільний унікальний id
{items.map((item) => (
  <ListItem key={item.id} {...item} />
))}
// React точно знає: цей елемент переміщено, а не змінено`}
        description="key — це ідентичність елемента для React. З key=index при додаванні/видаленні на початку React 'думає' що змінились всі елементи. З key=item.id точно знає що змінилось."
        title="key prop та списки"
      >
        <KeysDemo />
      </DemoBlock>

      <DemoBlock
        badge="success"
        badgeText="React 18"
        code={`// Три setState → ОДИН ре-рендер (в будь-якому контексті React 18)
function handleClick() {
  setCount(c => c + 1);
  setName('Vasyl');
  setLoading(false);
  // React зробить ОДИН ре-рендер, не три
}

// React 18: теж один рендер (раніше — три!)
setTimeout(() => {
  setCount(c => c + 1);
  setName('Vasyl');
  setLoading(false);
}, 0);`}
        description="React групує кілька setState в один рендер. До React 18 це працювало тільки в event handlers. React 18 додав automatic batching — тепер навіть в setTimeout і Promise."
        title="Batching — групування setState"
      >
        <BatchingDemo />
      </DemoBlock>
    </div>
  );
}
