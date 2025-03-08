import { Router } from 'express';
import { UserRoutes } from '../../modules/user-auth/user_auth.route';
import { StudentRoutes } from '../../modules/student/student.route';
import { TutorRoutes } from '../../modules/tutor/tutor.route';

const router = Router();

const moduleRoutes = [
  {
    path: '/auth',
    route: UserRoutes,
  },
  {
    path: '/student',
    route: StudentRoutes,
  },
  {
    path: '/tutor',
    route: TutorRoutes,
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
