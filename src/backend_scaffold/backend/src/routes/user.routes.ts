/**
 * User Routes
 * 
 * Endpoints for user management (Admin only for most operations)
 */

import { Router } from 'express';
// import { UserController } from '@controllers/user.controller';
// import { authenticationMiddleware } from '@middlewares/authentication.middleware';
// import { authorizationMiddleware } from '@middlewares/authorization.middleware';
// import { Permission } from '@config/rbac.config';

const router = Router();
// const userController = new UserController();

/**
 * GET /api/v1/users
 * List all users
 * Requires: USER_VIEW_ALL permission (Admin/Support only)
 */
router.get(
  '/',
  // authenticationMiddleware,
  // authorizationMiddleware([Permission.USER_VIEW_ALL]),
  (req, res, next) => {
    // userController.listUsers(req, res, next);
    res.status(501).json({ message: 'Not implemented' });
  }
);

/**
 * GET /api/v1/users/:id
 * Get user details
 * Requires: USER_VIEW permission (own profile) or USER_VIEW_ALL (any user)
 */
router.get(
  '/:id',
  // authenticationMiddleware,
  // Custom authorization middleware to check if user is viewing own profile
  (req, res, next) => {
    // userController.getUser(req, res, next);
    res.status(501).json({ message: 'Not implemented' });
  }
);

/**
 * POST /api/v1/users
 * Create new user
 * Requires: USER_CREATE permission (Admin only)
 */
router.post(
  '/',
  // authenticationMiddleware,
  // authorizationMiddleware([Permission.USER_CREATE]),
  (req, res, next) => {
    // userController.createUser(req, res, next);
    res.status(501).json({ message: 'Not implemented' });
  }
);

/**
 * PUT /api/v1/users/:id
 * Update user
 * Requires: USER_UPDATE permission (Admin only)
 */
router.put(
  '/:id',
  // authenticationMiddleware,
  // authorizationMiddleware([Permission.USER_UPDATE]),
  (req, res, next) => {
    // userController.updateUser(req, res, next);
    res.status(501).json({ message: 'Not implemented' });
  }
);

/**
 * DELETE /api/v1/users/:id
 * Delete user
 * Requires: USER_DELETE permission (Admin only)
 */
router.delete(
  '/:id',
  // authenticationMiddleware,
  // authorizationMiddleware([Permission.USER_DELETE]),
  (req, res, next) => {
    // userController.deleteUser(req, res, next);
    res.status(501).json({ message: 'Not implemented' });
  }
);

/**
 * PATCH /api/v1/users/:id/password
 * Change user password
 * Requires: USER_VIEW permission (own password) or USER_UPDATE (any user)
 */
router.patch(
  '/:id/password',
  // authenticationMiddleware,
  (req, res, next) => {
    // userController.changePassword(req, res, next);
    res.status(501).json({ message: 'Not implemented' });
  }
);

export default router;
