import { createContext, useContext, useRef, useState } from 'react';

import { RenderCount } from '../../../shared/render-count/render-count';

import styles from './context-rerender-demo.module.scss';

// ─── Один великий контекст (проблема) ─────────────────────────────────────────
interface BigContextValue {
  user: string;
  theme: string;
  cartCount: number;
}

const BigContext = createContext<BigContextValue>({
  user: 'Vasyl',
  theme: 'light',
  cartCount: 0,
});

function HeaderBad() {
  const { user } = useContext(BigContext); // читає тільки user

  return (
    <div className={styles.consumer}>
      <span>👤 Header: {user}</span>
      <RenderCount label="Header" />
    </div>
  );
}

function CartBad() {
  const { cartCount } = useContext(BigContext); // читає тільки cartCount

  return (
    <div className={styles.consumer}>
      <span>🛒 Cart: {cartCount}</span>
      <RenderCount label="Cart" />
    </div>
  );
}

function ThemeBad() {
  const { theme } = useContext(BigContext); // читає тільки theme

  return (
    <div className={styles.consumer}>
      <span>🎨 Theme: {theme}</span>
      <RenderCount label="Theme" />
    </div>
  );
}

export function ContextRerenderDemo() {
  const [user] = useState('Vasyl');
  const [theme] = useState('light');
  const [cartCount, setCartCount] = useState(0);

  return (
    <div className={styles.root}>
      <p className={styles.problem}>
        ⚠️ При зміні <strong>cartCount</strong> ре-рендеряться <em>всі</em> споживачі
        контексту — навіть Header і Theme, які cart не читають.
      </p>

      <button className={styles.btn} onClick={() => setCartCount((c) => c + 1)}>
        Додати до кошика (+)
      </button>

      <BigContext.Provider value={{ user, theme, cartCount }}>
        <div className={styles.consumers}>
          <HeaderBad />
          <CartBad />
          <ThemeBad />
        </div>
      </BigContext.Provider>

      <p className={styles.note}>
        Натисни кнопку і спостерігай: Header і Theme теж ре-рендеряться, хоча їхні дані не
        змінились.
      </p>
    </div>
  );
}

// ─── Розбиті контексти (рішення) ──────────────────────────────────────────────
const UserContext = createContext('Vasyl');
const ThemeContext = createContext('light');
const CartContext = createContext(0);

function HeaderGood() {
  const user = useContext(UserContext); // підписаний тільки на UserContext

  return (
    <div className={styles.consumer}>
      <span>👤 Header: {user}</span>
      <RenderCount label="Header" />
    </div>
  );
}

function CartGood() {
  const cartCount = useContext(CartContext); // підписаний тільки на CartContext

  return (
    <div className={styles.consumer}>
      <span>🛒 Cart: {cartCount}</span>
      <RenderCount label="Cart" />
    </div>
  );
}

function ThemeGood() {
  const theme = useContext(ThemeContext); // підписаний тільки на ThemeContext

  return (
    <div className={styles.consumer}>
      <span>🎨 Theme: {theme}</span>
      <RenderCount label="Theme" />
    </div>
  );
}

export function SplitContextDemo() {
  const [user] = useState('Vasyl');
  const [theme] = useState('light');
  const [cartCount, setCartCount] = useState(0);

  return (
    <div className={styles.root}>
      <p className={styles.solution}>
        ✅ З окремими контекстами — при зміні <strong>cartCount</strong> ре-рендериться
        тільки <strong>Cart</strong>.
      </p>

      <button className={styles.btn} onClick={() => setCartCount((c) => c + 1)}>
        Додати до кошика (+)
      </button>

      <UserContext.Provider value={user}>
        <ThemeContext.Provider value={theme}>
          <CartContext.Provider value={cartCount}>
            <div className={styles.consumers}>
              <HeaderGood />
              <CartGood />
              <ThemeGood />
            </div>
          </CartContext.Provider>
        </ThemeContext.Provider>
      </UserContext.Provider>

      <p className={styles.note}>
        Тепер тільки Cart ре-рендериться при кліку. Header і Theme не зачіпає!
      </p>
    </div>
  );
}
