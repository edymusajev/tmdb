/* prettier-ignore-start */

/* eslint-disable */

// @ts-nocheck

// noinspection JSUnusedGlobalSymbols

// This file is auto-generated by TanStack Router

// Import Routes

import { Route as rootRoute } from './routes/__root'
import { Route as IndexImport } from './routes/index'
import { Route as TitleSlugImport } from './routes/title.$slug'

// Create/Update Routes

const IndexRoute = IndexImport.update({
  path: '/',
  getParentRoute: () => rootRoute,
} as any)

const TitleSlugRoute = TitleSlugImport.update({
  path: '/title/$slug',
  getParentRoute: () => rootRoute,
} as any)

// Populate the FileRoutesByPath interface

declare module '@tanstack/react-router' {
  interface FileRoutesByPath {
    '/': {
      id: '/'
      path: '/'
      fullPath: '/'
      preLoaderRoute: typeof IndexImport
      parentRoute: typeof rootRoute
    }
    '/title/$slug': {
      id: '/title/$slug'
      path: '/title/$slug'
      fullPath: '/title/$slug'
      preLoaderRoute: typeof TitleSlugImport
      parentRoute: typeof rootRoute
    }
  }
}

// Create and export the route tree

export const routeTree = rootRoute.addChildren({ IndexRoute, TitleSlugRoute })

/* prettier-ignore-end */

/* ROUTE_MANIFEST_START
{
  "routes": {
    "__root__": {
      "filePath": "__root.tsx",
      "children": [
        "/",
        "/title/$slug"
      ]
    },
    "/": {
      "filePath": "index.tsx"
    },
    "/title/$slug": {
      "filePath": "title.$slug.tsx"
    }
  }
}
ROUTE_MANIFEST_END */
