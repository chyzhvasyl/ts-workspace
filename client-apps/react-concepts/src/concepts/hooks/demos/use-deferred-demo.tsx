import { useState, useDeferredValue, memo } from 'react';

// ---------------------------------------------------------------------------
// Імітація дорогого рендеру — великий список результатів
// ---------------------------------------------------------------------------
const ResultsList = memo(function ResultsList({ query }: { query: string }) {
  // Штучне гальмування — імітує дорогий рендер (150ms блокування main thread)
  // Без useDeferredValue інпут би "підвисав" при кожному символі
  const start = performance.now();
  while (performance.now() - start < 500) {
    /* навантаження */
  }

  const items = Array.from({ length: 500 }, (_, i) => `Result ${i + 1}`).filter((item) =>
    item.toLowerCase().includes(query.toLowerCase()),
  );

  return (
    <ul style={{ maxHeight: 300, overflowY: 'auto', margin: 0, padding: '0 0 0 20px' }}>
      {items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  );
});

// ---------------------------------------------------------------------------
// Demo
// ---------------------------------------------------------------------------
export function UseDeferredValueDemo() {
  const [query, setQuery] = useState('');

  // query     — миттєво оновлюється (інпут не гальмує)
  // deferredQuery — React оновить коли буде вільний (список може "відставати")
  const deferredQuery = useDeferredValue(query);
  console.log('deferredQuery', deferredQuery);

  // Поки deferredQuery не наздогнав query — список "застарів"
  const isStale = query !== deferredQuery;

  return (
    <div style={{ fontFamily: 'sans-serif', padding: 24, maxWidth: 480 }}>
      <h3 style={{ marginBottom: 4 }}>useDeferredValue demo</h3>
      <p style={{ fontSize: 13, color: '#555', marginBottom: 16 }}>
        Друкуй в інпуті — він завжди responsive. Список оновлюється з затримкою.
      </p>

      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Шукай..."
        style={{
          width: '100%',
          padding: '8px 12px',
          fontSize: 15,
          boxSizing: 'border-box',
        }}
      />

      {/* Індикатор stale-стану */}
      <div style={{ fontSize: 12, color: '#888', margin: '8px 0', height: 16 }}>
        {isStale ? '⏳ список оновлюється...' : '✅ актуально'}
      </div>

      <div
        style={{
          opacity: isStale ? 0.4 : 1,
          transition: 'opacity 0.2s',
        }}
      >
        <ResultsList query={deferredQuery} />
      </div>
    </div>
  );
}
