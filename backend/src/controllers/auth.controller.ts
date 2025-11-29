// import { Request, Response } from 'express';
// import User from '../models/User';
// import jwt from 'jsonwebtoken';

// export class AuthController {
//   /**
//    * Sign up new user
//    */
//   static async signup(req: Request, res: Response) {
//     try {
//       const { email, password, name } = req.body;
      
//       // Validation
//       if (!email || !password || !name) {
//         return res.status(400).json({ error: 'All fields are required' });
//       }
      
//       if (password.length < 6) {
//         return res.status(400).json({ error: 'Password must be at least 6 characters' });
//       }
      
//       // Check if user exists
//       const existingUser = await User.findOne({ email });
//       if (existingUser) {
//         return res.status(400).json({ error: 'Email already registered' });
//       }
      
//       // Create user
//       const user = await User.create({
//         email,
//         password,
//         name
//       });
      
//       // Generate JWT
//       const token = jwt.sign(
//         { userId: user._id },
//         process.env.JWT_SECRET!,
//         { expiresIn: process.env.JWT_EXPIRES_IN }
//       );
      
//       res.status(201).json({
//         success: true,
//         token,
//         user: {
//           id: user._id,
//           email: user.email,
//           name: user.name
//         }
//       });
//     } catch (error: any) {
//       console.error('Signup error:', error);
//       res.status(500).json({ error: error.message });
//     }
//   }

//   /**
//    * Login user
//    */
//   static async login(req: Request, res: Response) {
//     try {
//       const { email, password } = req.body;
      
//       // Validation
//       if (!email || !password) {
//         return res.status(400).json({ error: 'Email and password are required' });
//       }
      
//       // Find user
//       const user = await User.findOne({ email });
//       if (!user) {
//         return res.status(401).json({ error: 'Invalid credentials' });
//       }
      
//       // Check password
//       const isMatch = await user.comparePassword(password);
//       if (!isMatch) {
//         return res.status(401).json({ error: 'Invalid credentials' });
//       }
      
//       // Generate JWT
//       const token = jwt.sign(
//         { userId: user._id },
//         process.env.JWT_SECRET!,
//         { expiresIn: process.env.JWT_EXPIRES_IN }
//       );
      
//       res.json({
//         success: true,
//         token,
//         user: {
//           id: user._id,
//           email: user.email,
//           name: user.name
//         }
//       });
//     } catch (error: any) {
//       console.error('Login error:', error);
//       res.status(500).json({ error: error.message });
//     }
//   }

//   /**
//    * Get current user
//    */
//   static async getMe(req: Request, res: Response) {
//     try {
//       const user = await User.findById(req.user!._id).select('-password');
      
//       res.json({
//         success: true,
//         user
//       });
//     } catch (error: any) {
//       res.status(500).json({ error: error.message });
//     }
//   }
// }
import { Request, Response } from 'express';
import User from '../models/User';
import jwt, { SignOptions } from 'jsonwebtoken';

export class AuthController {
  /**
   * Sign up new user
   */
  static async signup(req: Request, res: Response) {
    try {
      const { email, password, name } = req.body;
      
      // Validation
      if (!email || !password || !name) {
        return res.status(400).json({ error: 'All fields are required' });
      }
      
      if (password.length < 6) {
        return res.status(400).json({ error: 'Password must be at least 6 characters' });
      }
      
      // Check if user exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ error: 'Email already registered' });
      }
      
      // Create user
      const user = await User.create({
        email,
        password,
        name
      });
      
      // Generate JWT
      const jwtSecret = process.env.JWT_SECRET;
      if (!jwtSecret) {
        throw new Error('JWT_SECRET is not defined');
      }
      const token = jwt.sign(
        { userId: user._id },
        jwtSecret,
        { expiresIn: process.env.JWT_EXPIRES_IN || '7d' } as SignOptions
      );
      
      res.status(201).json({
        success: true,
        token,
        user: {
          id: user._id,
          email: user.email,
          name: user.name
        }
      });
    } catch (error: any) {
      console.error('Signup error:', error);
      res.status(500).json({ error: error.message });
    }
  }

  /**
   * Login user
   */
  static async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;
      
      // Validation
      if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required' });
      }
      
      // Find user
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }
      
      // Check password
      const isMatch = await user.comparePassword(password);
      if (!isMatch) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }
      
      // Generate JWT
      const jwtSecret = process.env.JWT_SECRET;
      if (!jwtSecret) {
        throw new Error('JWT_SECRET is not defined');
      }
      const token = jwt.sign(
        { userId: user._id },
        jwtSecret,
        { expiresIn: process.env.JWT_EXPIRES_IN || '7d' } as SignOptions
      );
      
      res.json({
        success: true,
        token,
        user: {
          id: user._id,
          email: user.email,
          name: user.name
        }
      });
    } catch (error: any) {
      console.error('Login error:', error);
      res.status(500).json({ error: error.message });
    }
  }

  /**
   * Get current user
   */
  static async getMe(req: Request, res: Response) {
    try {
      const user = await User.findById(req.user!._id).select('-password');
      
      res.json({
        success: true,
        user
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
}
