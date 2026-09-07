import { Select } from '@chenhui996/gg-ui';
import { useEffect, useRef, useState, type KeyboardEvent, type PointerEvent } from 'react';
import { THEME_MODE_OPTIONS, type AppThemeMode } from '@/config/theme';
import styles from './index.module.less';

interface ThemeSwitcherProps {
  themeMode: AppThemeMode;
  onThemeChange: (themeMode: AppThemeMode) => void;
}

interface FloatingPosition {
  x: number;
  y: number;
}

interface DragState {
  offsetX: number;
  offsetY: number;
  pointerId: number;
}

const KEYBOARD_DRAG_STEP = 10;
const DRAG_DIRECTION_BY_KEY: Readonly<Partial<Record<string, FloatingPosition>>> = {
  ArrowDown: { x: 0, y: 1 },
  ArrowLeft: { x: -1, y: 0 },
  ArrowRight: { x: 1, y: 0 },
  ArrowUp: { x: 0, y: -1 },
};

const getBoundedPosition = (
  position: FloatingPosition,
  elementWidth: number,
  elementHeight: number,
): FloatingPosition => ({
  x: Math.min(Math.max(position.x, 0), Math.max(window.innerWidth - elementWidth, 0)),
  y: Math.min(Math.max(position.y, 0), Math.max(window.innerHeight - elementHeight, 0)),
});

const ThemeSwitcher: React.FC<ThemeSwitcherProps> = (props) => {
  const { onThemeChange, themeMode } = props;
  const themeSwitcherRef = useRef<HTMLDivElement>(null);
  const dragStateRef = useRef<DragState | null>(null);
  const [position, setPosition] = useState<FloatingPosition | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    const handleWindowResize = () => {
      const themeSwitcher = themeSwitcherRef.current;
      if (!themeSwitcher) {
        return;
      }

      const { width, height } = themeSwitcher.getBoundingClientRect();
      setPosition((currentPosition) => {
        if (!currentPosition) {
          return currentPosition;
        }

        const nextPosition = getBoundedPosition(currentPosition, width, height);
        return nextPosition.x === currentPosition.x && nextPosition.y === currentPosition.y
          ? currentPosition
          : nextPosition;
      });
    };

    window.addEventListener('resize', handleWindowResize);

    return () => {
      window.removeEventListener('resize', handleWindowResize);
    };
  }, []);

  const handleDragStart = (event: PointerEvent<HTMLButtonElement>) => {
    if (event.button !== 0 || !themeSwitcherRef.current) {
      return;
    }

    event.preventDefault();
    const { left, top } = themeSwitcherRef.current.getBoundingClientRect();
    dragStateRef.current = {
      offsetX: event.clientX - left,
      offsetY: event.clientY - top,
      pointerId: event.pointerId,
    };
    event.currentTarget.setPointerCapture?.(event.pointerId);
    setIsDragging(true);
  };

  const handleDragMove = (event: PointerEvent<HTMLButtonElement>) => {
    const dragState = dragStateRef.current;
    const themeSwitcher = themeSwitcherRef.current;
    if (!dragState || dragState.pointerId !== event.pointerId || !themeSwitcher) {
      return;
    }

    const { width, height } = themeSwitcher.getBoundingClientRect();
    setPosition(
      getBoundedPosition(
        {
          x: event.clientX - dragState.offsetX,
          y: event.clientY - dragState.offsetY,
        },
        width,
        height,
      ),
    );
  };

  const handleDragEnd = (event: PointerEvent<HTMLButtonElement>) => {
    if (dragStateRef.current?.pointerId !== event.pointerId) {
      return;
    }

    if (event.currentTarget.hasPointerCapture?.(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
    dragStateRef.current = null;
    setIsDragging(false);
  };

  const handleDragKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    const direction = DRAG_DIRECTION_BY_KEY[event.key];
    const themeSwitcher = themeSwitcherRef.current;
    if (!direction || !themeSwitcher) {
      return;
    }

    event.preventDefault();
    const { left, top, width, height } = themeSwitcher.getBoundingClientRect();
    const step = event.shiftKey ? 1 : KEYBOARD_DRAG_STEP;
    setPosition(
      getBoundedPosition(
        {
          x: left + direction.x * step,
          y: top + direction.y * step,
        },
        width,
        height,
      ),
    );
  };

  return (
    <div
      ref={themeSwitcherRef}
      aria-label="主题切换器"
      className={styles.themeSwitcher}
      data-dragging={isDragging}
      role="group"
      style={position ? { left: position.x, right: 'auto', top: position.y } : undefined}
    >
      <button
        aria-label="拖动主题切换器"
        className={styles.dragHandle}
        title="拖动主题切换器；方向键可调整位置"
        type="button"
        onKeyDown={handleDragKeyDown}
        onLostPointerCapture={handleDragEnd}
        onPointerCancel={handleDragEnd}
        onPointerDown={handleDragStart}
        onPointerMove={handleDragMove}
        onPointerUp={handleDragEnd}
      >
        <span aria-hidden="true">⠿</span>
      </button>
      <span>主题</span>
      <Select
        aria-label="切换主题"
        className={styles.themeSelect}
        options={[...THEME_MODE_OPTIONS]}
        value={themeMode}
        onChange={onThemeChange}
      />
    </div>
  );
};

export default ThemeSwitcher;
