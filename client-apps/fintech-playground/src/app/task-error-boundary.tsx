import { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}
interface State {
  error: Error | null;
}

/**
 * Catches errors thrown by not-yet-implemented task stubs (e.g. a TODO that
 * throws) so the whole app doesn't white-screen — you see a friendly hint.
 */
export class TaskErrorBoundary extends Component<Props, State> {
  override state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  override componentDidCatch(error: Error, info: ErrorInfo): void {
    console.warn('[task stub not implemented]', error.message, info.componentStack);
  }

  override componentDidUpdate(prev: Props): void {
    if (prev.children !== this.props.children && this.state.error) {
      this.setState({ error: null });
    }
  }

  override render(): ReactNode {
    if (this.state.error) {
      return (
        <div style={wrap}>
          <span style={{ fontSize: 28 }}>🛠️</span>
          <h2 style={{ fontSize: 18, margin: '10px 0 6px' }}>Логіку ще не реалізовано</h2>
          <p
            style={{
              color: 'var(--text-muted)',
              fontSize: 14,
              maxWidth: 520,
              lineHeight: 1.6,
            }}
          >
            Цей екран кинув помилку, бо в одному з файлів завдання лишився{' '}
            <code>// TODO</code>. Знайди функцію/хук зі стабом і реалізуй її — екран
            оновиться сам.
          </p>
          <pre style={code}>{this.state.error.message}</pre>
        </div>
      );
    }
    return this.props.children;
  }
}

const wrap = {
  display: 'flex',
  flexDirection: 'column' as const,
  alignItems: 'center',
  textAlign: 'center' as const,
  padding: '80px 32px',
};
const code = {
  marginTop: 16,
  background: '#1e1e2e',
  color: '#f38ba8',
  padding: '10px 16px',
  borderRadius: 8,
  fontSize: 13,
};
