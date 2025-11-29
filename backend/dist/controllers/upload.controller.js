"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UploadController = void 0;
const cloudinary_1 = require("cloudinary");
const stream_1 = require("stream");
// Configure Cloudinary
cloudinary_1.v2.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});
class UploadController {
    /**
     * Upload image to Cloudinary
     */
    static async uploadImage(req, res) {
        try {
            if (!req.file) {
                return res.status(400).json({ error: 'No file uploaded' });
            }
            // Validate file type
            const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
            if (!allowedTypes.includes(req.file.mimetype)) {
                return res.status(400).json({ error: 'Only image files are allowed' });
            }
            // Validate file size (5MB max)
            if (req.file.size > 5 * 1024 * 1024) {
                return res.status(400).json({ error: 'File size must be less than 5MB' });
            }
            // Upload to Cloudinary
            const result = await new Promise((resolve, reject) => {
                const uploadStream = cloudinary_1.v2.uploader.upload_stream({
                    folder: 'form-uploads',
                    resource_type: 'image',
                    transformation: [
                        { width: 1200, height: 1200, crop: 'limit' },
                        { quality: 'auto:good' }
                    ]
                }, (error, result) => {
                    if (error)
                        reject(error);
                    else
                        resolve(result);
                });
                const readableStream = stream_1.Readable.from(req.file.buffer);
                readableStream.pipe(uploadStream);
            });
            const uploadResult = result;
            res.json({
                success: true,
                url: uploadResult.secure_url,
                publicId: uploadResult.public_id
            });
        }
        catch (error) {
            console.error('Upload error:', error);
            res.status(500).json({ error: 'Failed to upload image' });
        }
    }
    /**
     * Delete image from Cloudinary
     */
    static async deleteImage(req, res) {
        try {
            const { publicId } = req.body;
            if (!publicId) {
                return res.status(400).json({ error: 'Public ID is required' });
            }
            await cloudinary_1.v2.uploader.destroy(publicId);
            res.json({
                success: true,
                message: 'Image deleted successfully'
            });
        }
        catch (error) {
            console.error('Delete error:', error);
            res.status(500).json({ error: 'Failed to delete image' });
        }
    }
}
exports.UploadController = UploadController;
