import { AG_GRID_LOCALE_CN } from '@ag-grid-community/locale';
import type { GridOptions } from 'ag-grid-community';

export const DEFAULT_AG_GRID_OPTIONS = {
  headerHeight: 32,
  rowHeight: 28,
  localeText: AG_GRID_LOCALE_CN,
  suppressCellFocus: true,
} satisfies Pick<GridOptions, 'headerHeight' | 'rowHeight' | 'localeText' | 'suppressCellFocus'>;
