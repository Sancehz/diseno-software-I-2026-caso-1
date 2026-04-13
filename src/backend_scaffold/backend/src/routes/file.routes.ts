/**
 * File Routes
 * 
 * Endpoints for file upload, management, and processing
 */

import { Router } from 'express';
// import { FileController } from '@controllers/file.controller';
// import { authenticationMiddleware } from '@middlewares/authentication.middleware';
// import { authorizationMiddleware } from '@middlewares/authorization.middleware';
// import { Permission } from '@config/rbac.config';
// import multer from 'multer';

const router = Router();
// const fileController = new FileController();

// Multer configuration for file uploads
// const upload = multer({
//   dest: process.env.UPLOAD_DIR || '/tmp/dua-uploads',
//   limits: {
//     fileSize: parseInt(process.env.MAX_FILE_UPLOAD_SIZE || '10485760'),
//   },
// });

/**
 * POST /api/v1/files/upload
 * Upload files for processing
 * Requires: FILE_UPLOAD permission
 */
router.post(
  '/upload',
  // authenticationMiddleware,
  // authorizationMiddleware([Permission.FILE_UPLOAD]),
  // upload.array('files', 10),
  (req, res, next) => {
    // fileController.uploadFiles(req, res, next);
    res.status(501).json({ message: 'Not implemented' });
  }
);

/**
 * GET /api/v1/files
 * List user's uploaded files
 * Requires: FILE_VIEW permission
 */
router.get(
  '/',
  // authenticationMiddleware,
  // authorizationMiddleware([Permission.FILE_VIEW]),
  (req, res, next) => {
    // fileController.listFiles(req, res, next);
    res.status(501).json({ message: 'Not implemented' });
  }
);

/**
 * GET /api/v1/files/:id
 * Get file details
 * Requires: FILE_VIEW permission
 */
router.get(
  '/:id',
  // authenticationMiddleware,
  // authorizationMiddleware([Permission.FILE_VIEW]),
  (req, res, next) => {
    // fileController.getFile(req, res, next);
    res.status(501).json({ message: 'Not implemented' });
  }
);

/**
 * DELETE /api/v1/files/:id
 * Delete uploaded file
 * Requires: FILE_DELETE permission
 */
router.delete(
  '/:id',
  // authenticationMiddleware,
  // authorizationMiddleware([Permission.FILE_DELETE]),
  (req, res, next) => {
    // fileController.deleteFile(req, res, next);
    res.status(501).json({ message: 'Not implemented' });
  }
);

/**
 * GET /api/v1/files/:id/download
 * Download file
 * Requires: FILE_DOWNLOAD permission
 */
router.get(
  '/:id/download',
  // authenticationMiddleware,
  // authorizationMiddleware([Permission.FILE_DOWNLOAD]),
  (req, res, next) => {
    // fileController.downloadFile(req, res, next);
    res.status(501).json({ message: 'Not implemented' });
  }
);

export default router;
