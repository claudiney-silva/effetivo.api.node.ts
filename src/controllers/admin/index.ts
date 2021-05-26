import { ClassMiddleware, ClassOptions, Controller } from '@overnightjs/core';
import { Role } from '@src/models/userModel';
import { authJwtMiddleware } from '@src/middlewares/authJwt';
import { roleMiddleware } from '@src/middlewares/role';
// import { AdminPostsController } from './posts';
// import { AdminUsersController } from './users';

@Controller('admin')
@ClassMiddleware(authJwtMiddleware())
@ClassMiddleware(roleMiddleware(Role.ADMIN))
@ClassOptions({ mergeParams: true })
// @ChildControllers([new AdminUsersController(), new AdminPostsController()])
export class AdminController {}
