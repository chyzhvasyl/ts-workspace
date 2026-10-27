import { DemoBlock } from '../../shared/demo-block/demo-block';

import { ContextRerenderDemo, SplitContextDemo } from './demos/context-rerender-demo';

import styles from './context-page.module.scss';

export function ContextPage() {
  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <span className={styles.tag}>Частина 3</span>
        <h1 className={styles.title}>Context</h1>
        <p className={styles.subtitle}>
          Ре-рендер всього дерева при зміні контексту — і як це вирішити
        </p>
      </div>

      <DemoBlock
        title="Проблема: один великий контекст"
        badge="danger"
        badgeText="❌ Антипатерн"
        description="Якщо всі дані в одному контексті — будь-яка зміна будь-якого значення ре-рендерить ВСІХ споживачів. Header ре-рендериться при зміні cart, хоча cart не читає."
        code={`// ❌ Один великий контекст — всі споживачі ре-рендеряться при будь-якій зміні
const AppContext = createContext({ user: null, theme: 'light', cart: [] });

function App() {
  const [user, setUser] = useState(null);
  const [theme, setTheme] = useState('light');
  const [cart, setCart] = useState([]);

  return (
    <AppContext.Provider value={{ user, theme, cart }}>
      <Header />   {/* ре-рендер при зміні cart! */}
      <Cart />
      <ThemeToggle />
    </AppContext.Provider>
  );
}

function Header() {
  const { user } = useContext(AppContext); // читає тільки user...
  // ...але ре-рендериться при зміні cart теж 😢
}`}
      >
        <ContextRerenderDemo />
      </DemoBlock>

      <DemoBlock
        title="Рішення: розбити на окремі контексти"
        badge="success"
        badgeText="✅ Best Practice"
        description="Розбий контекст за доменом. Споживач підписується тільки на той контекст, який реально використовує. Зміна cart не зачіпає Header і Theme."
        code={`// ✅ Окремі контексти за доменом
const UserContext = createContext(null);
const ThemeContext = createContext('light');
const CartContext = createContext([]);

function App() {
  return (
    <UserContext.Provider value={user}>
      <ThemeContext.Provider value={theme}>
        <CartContext.Provider value={cart}>
          <Header />      {/* підписаний тільки на UserContext */}
          <Cart />        {/* підписаний тільки на CartContext */}
          <ThemeToggle /> {/* підписаний тільки на ThemeContext */}
        </CartContext.Provider>
      </ThemeContext.Provider>
    </UserContext.Provider>
  );
}

// Тепер Header ре-рендериться ТІЛЬКИ при зміні user ✓`}
      >
        <SplitContextDemo />
      </DemoBlock>

      <div className={styles.table}>
        <h3 className={styles.tableTitle}>Context vs зовнішній стейт</h3>
        <table>
          <thead>
            <tr>
              <th>Сценарій</th>
              <th>Рекомендація</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Тема, локаль, поточний юзер</td>
              <td className={styles.good}>✅ Context — рідко змінюється</td>
            </tr>
            <tr>
              <td>Форми, локальний стейт фічі</td>
              <td className={styles.good}>✅ useState / useReducer</td>
            </tr>
            <tr>
              <td>Глобальний стейт з частими змінами</td>
              <td className={styles.warn}>⚡ Zustand або Redux Toolkit</td>
            </tr>
            <tr>
              <td>Серверний стейт (API дані)</td>
              <td className={styles.warn}>⚡ TanStack Query (React Query)</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
