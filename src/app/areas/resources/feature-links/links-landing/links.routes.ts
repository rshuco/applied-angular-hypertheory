import { Routes } from '@angular/router';

import { HomePage } from './internal/pages/home';
import { Home } from './internal/home';

export const linksFeatureRoutes: Routes = [
  {
    path: '',
    providers: [],
    component: Home,
    children: [
      {
        path: '',
        component: HomePage,
      },
    ],
  },
];
