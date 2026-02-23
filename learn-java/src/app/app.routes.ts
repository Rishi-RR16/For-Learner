import { Routes } from '@angular/router';
import { TopicList } from './components/topic-list/topic-list';
import { TopicDetail } from './components/topic-detail/topic-detail';
import { Login } from './components/login/login';
import { AdminDashboard } from './components/admin/admin-dashboard/admin-dashboard';
import { TopicForm } from './components/admin/topic-form/topic-form';
import { authGuard } from './services/auth-guard';

export const routes: Routes = [
    { path: '', redirectTo: '/topics', pathMatch: 'full' },
    { path: 'topics', component: TopicList },
    { path: 'topic/:id', component: TopicDetail },
    { path: 'login', component: Login },
    {
        path: 'admin',
        canActivate: [authGuard],
        children: [
            { path: '', component: AdminDashboard },
            { path: 'new', component: TopicForm },
            { path: 'edit/:id', component: TopicForm }
        ]
    },
    { path: '**', redirectTo: '/topics' }
];
