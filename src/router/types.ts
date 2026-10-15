import type { RouteObject } from 'react-router-dom';

export interface RouteMenuMetadata {
  name?: string;
  title?: string;
}

export type AppRouteObject = RouteObject &
  RouteMenuMetadata & {
    children?: AppRouteObject[];
    handle?: RouteMenuMetadata;
    meta?: RouteMenuMetadata;
  };
