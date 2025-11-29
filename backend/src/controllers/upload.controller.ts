
// import { Request, Response } from 'express';
// import { v2 as cloudinary } from 'cloudinary';
// import { Readable } from 'stream';

// // Configure Cloudinary - FIX: Ensure proper initialization
// cloudinary.config({
//   cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//   api_key: process.env.CLOUDINARY_API_KEY,
//   api_secret: process.env.CLOUDINARY_API_SECRET
// });

// // Validate configuration on startup
// if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
//   console.error('⚠️ Cloudinary credentials missing in .env file!');
// }

// export class UploadController {
//   /**
//    * Upload image to Cloudinary
//    */
//   static async uploadImage(req: Request, res: Response) {
//     try {
//       console.log('📤 Upload request received');
      
//       if (!req.file) {
//         return res.status(400).json({ error: 'No file uploaded' });
//       }
      
//       console.log('📁 File details:', {
//         originalname: req.file.originalname,
//         mimetype: req.file.mimetype,
//         size: req.file.size
//       });
      
//       // Validate file type
//       const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
//       if (!allowedTypes.includes(req.file.mimetype)) {
//         return res.status(400).json({ error: 'Only image files are allowed' });
//       }
      
//       // Validate file size (5MB max)
//       if (req.file.size > 5 * 1024 * 1024) {
//         return res.status(400).json({ error: 'File size must be less than 5MB' });
//       }
      
//       console.log('☁️ Uploading to Cloudinary...');
      
//       // Upload to Cloudinary
//       const result = await new Promise((resolve, reject) => {
//         const uploadStream = cloudinary.uploader.upload_stream(
//           {
//             folder: 'form-uploads',
//             resource_type: 'image',
//             transformation: [
//               { width: 1200, height: 1200, crop: 'limit' },
//               { quality: 'auto:good' }
//             ]
//           },
//           (error, result) => {
//             if (error) {
//               console.error('❌ Cloudinary error:', error);
//               reject(error);
//             } else {
//               console.log('✅ Upload successful:', result?.secure_url);
//               resolve(result);
//             }
//           }
//         );
        
//         const readableStream = Readable.from(req.file!.buffer);
//         readableStream.pipe(uploadStream);
//       });
      
//       const uploadResult = result as any;
      
//       res.json({
//         success: true,
//         url: uploadResult.secure_url,
//         publicId: uploadResult.public_id
//       });
//     } catch (error: any) {
//       console.error('Upload error:', error);
//       res.status(500).json({ error: 'Failed to upload image' });
//     }
//   }

//   /**
//    * Delete image from Cloudinary
//    */
//   static async deleteImage(req: Request, res: Response) {
//     try {
//       const { publicId } = req.body;
      
//       if (!publicId) {
//         return res.status(400).json({ error: 'Public ID is required' });
//       }
      
//       await cloudinary.uploader.destroy(publicId);
      
//       res.json({
//         success: true,
//         message: 'Image deleted successfully'
//       });
//     } catch (error: any) {
//       console.error('Delete error:', error);
//       res.status(500).json({ error: 'Failed to delete image' });
//     }
//   }
// }

import { Request, Response } from 'express';
import { v2 as cloudinary } from 'cloudinary';
import { Readable } from 'stream';

// Lazy Cloudinary configuration - only configure when needed
let cloudinaryConfigured = false;
let configurationAttempted = false;

function ensureCloudinaryConfigured(): boolean {
  // If already configured, return true
  if (cloudinaryConfigured) {
    return true;
  }
  
  // If we've already tried and failed, don't try again
  if (configurationAttempted) {
    return false;
  }
  
  configurationAttempted = true;
  
  // Configure Cloudinary - supports both CLOUDINARY_URL and individual variables
  if (process.env.CLOUDINARY_URL) {
    try {
      // Cloudinary SDK v2 can use cloudinary_url in config
      // But it also auto-detects from CLOUDINARY_URL env var, so we can just verify it's set
      // However, explicitly setting it ensures it works
      cloudinary.config({
        cloudinary_url: process.env.CLOUDINARY_URL
      });
      
      // Verify configuration by checking if we can read the config
      const config = cloudinary.config();
      if (config.cloud_name && config.api_key) {
        console.log('✅ Cloudinary configured via CLOUDINARY_URL');
        console.log(`   Cloud Name: ${config.cloud_name}`);
        console.log(`   API Key: ${config.api_key.substring(0, 5)}...`);
        cloudinaryConfigured = true;
        return true;
      } else {
        // If config didn't work, try parsing the URL manually
        console.log('⚠️ cloudinary_url property not recognized, parsing URL manually...');
        const urlMatch = process.env.CLOUDINARY_URL.match(/cloudinary:\/\/([^:]+):([^@]+)@(.+)/);
        if (urlMatch) {
          const [, apiKey, apiSecret, cloudName] = urlMatch;
          cloudinary.config({
            cloud_name: cloudName,
            api_key: apiKey,
            api_secret: apiSecret
          });
          console.log('✅ Cloudinary configured via parsed CLOUDINARY_URL');
          console.log(`   Cloud Name: ${cloudName}`);
          cloudinaryConfigured = true;
          return true;
        }
        throw new Error('Failed to parse CLOUDINARY_URL');
      }
    } catch (error: any) {
      console.error('❌ Failed to configure Cloudinary with CLOUDINARY_URL:', error.message);
      return false;
    }
  } else if (process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET) {
    // Fallback to individual variables
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET
    });
    console.log('✅ Cloudinary configured via individual variables');
    console.log(`   Cloud Name: ${process.env.CLOUDINARY_CLOUD_NAME}`);
    cloudinaryConfigured = true;
    return true;
  } else {
    console.error('⚠️ Cloudinary credentials missing!');
    console.error('   Please set either CLOUDINARY_URL or CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET');
    console.error('   Current env check - CLOUDINARY_URL:', !!process.env.CLOUDINARY_URL);
    console.error('   Current env check - CLOUDINARY_CLOUD_NAME:', !!process.env.CLOUDINARY_CLOUD_NAME);
    console.error('   Current env check - CLOUDINARY_API_KEY:', !!process.env.CLOUDINARY_API_KEY);
    return false;
  }
}

export class UploadController {
  /**
   * Upload image to Cloudinary
   */
  static async uploadImage(req: Request, res: Response) {
    try {
      console.log('📤 Upload request received');
      
      if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
      }
      
      console.log('📁 File details:', {
        originalname: req.file.originalname,
        mimetype: req.file.mimetype,
        size: req.file.size
      });
      
      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
      if (!allowedTypes.includes(req.file.mimetype)) {
        return res.status(400).json({ error: 'Only image files are allowed' });
      }
      
      // Validate file size (5MB max)
      if (req.file.size > 5 * 1024 * 1024) {
        return res.status(400).json({ error: 'File size must be less than 5MB' });
      }
      
      // Ensure Cloudinary is configured (lazy initialization)
      if (!ensureCloudinaryConfigured()) {
        return res.status(500).json({ error: 'Cloudinary is not configured. Please check your environment variables.' });
      }
      
      console.log('☁️ Uploading to Cloudinary...');
      
      // Upload to Cloudinary
      const result = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            folder: 'form-uploads',
            resource_type: 'image',
            transformation: [
              { width: 1200, height: 1200, crop: 'limit' },
              { quality: 'auto:good' }
            ]
          },
          (error, result) => {
            if (error) {
              console.error('❌ Cloudinary error:', error);
              reject(error);
            } else {
              console.log('✅ Upload successful:', result?.secure_url);
              resolve(result);
            }
          }
        );
        
        const readableStream = Readable.from(req.file!.buffer);
        readableStream.pipe(uploadStream);
      });
      
      const uploadResult = result as any;
      
      res.json({
        success: true,
        url: uploadResult.secure_url,
        publicId: uploadResult.public_id
      });
    } catch (error: any) {
      console.error('Upload error:', error);
      res.status(500).json({ error: 'Failed to upload image' });
    }
  }

  /**
   * Delete image from Cloudinary
   */
  static async deleteImage(req: Request, res: Response) {
    try {
      const { publicId } = req.body;
      
      if (!publicId) {
        return res.status(400).json({ error: 'Public ID is required' });
      }
      
      await cloudinary.uploader.destroy(publicId);
      
      res.json({
        success: true,
        message: 'Image deleted successfully'
      });
    } catch (error: any) {
      console.error('Delete error:', error);
      res.status(500).json({ error: 'Failed to delete image' });
    }
  }
}
