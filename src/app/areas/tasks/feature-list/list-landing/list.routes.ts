import { Routes } from '@angular/router';
import { Home } from './internal/home';
import { HomePage } from './internal/pages/home';

// import { tasksStore } from '../../../shared/data/stores/tasks/store';

export const listFeatureRoutes: Routes = [
  {
    path: '',
    // providers: [tasksStore],
    component: Home,
    children: [
      {
        path: '',
        component: HomePage,
      },
    ],
  },
];
