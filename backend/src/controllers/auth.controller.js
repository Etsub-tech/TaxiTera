import User from "../models/User.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import securityQuestions from "../constants/securityQuestions.js";

/**
 * @desc    Register a new user
 * @route   POST /api/auth/signup
 * @access  Public
 */
export async function signup(req, res) {
  try {
    const { username, password, securityQuestions: userQuestions } = req.body;

    // 1. Basic validation
    if (!username || !password) {
      return res.status(400).json({
        message: "Please fill in both username and password."
      });
    }

    if (!userQuestions || userQuestions.length !== 2) {
      return res.status(400).json({
        message: "Please answer exactly two security questions."
      });
    }

    if (password.length < 8) {
      return res.status(400).json({
        message: "Password must be at least 8 characters long."
  });
  }

    // 2. Validate question IDs
    const validQuestionIds = securityQuestions.map(q => q.id);
    for (const q of userQuestions) {
      if (!validQuestionIds.includes(q.questionId)) {
        return res.status(400).json({
          message: "Invalid security question selected."
        });
      }
      if (!q.answer || q.answer.trim() === "") {
        return res.status(400).json({
          message: "Security question answers cannot be empty."
        });
      }
    }

    // 3. Check if username already exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({
        message: "Username already in use."
      });
    }

    // 4. Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 5. Hash security answers
    const hashedSecurityQuestions = await Promise.all(
      userQuestions.map(async q => ({
        questionId: q.questionId,
        answer: await bcrypt.hash(q.answer.toLowerCase(), 10)
      }))
    );

    // 6. Create user
    await User.create({
      username,
      password: hashedPassword,
      securityQuestions: hashedSecurityQuestions
    });

    // 7. Respond
    return res.status(201).json({
      message: "Sign up successful."
    });

  } catch (error) {
    console.error("Signup error:", error);
    return res.status(500).json({
      message: "Server error during signup."
    });
  }
}

/**
 * @desc    Login user
 * @route   POST /api/auth/login
 * @access  Public
 */
export async function login(req, res) {
  try {
    const { username, password } = req.body;

    // 1. Validate input
    if (!username || !password) {
      return res.status(400).json({
        message: "Please fill in both username and password."
      });
    }

    // 2. Find user
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({
        message: "Incorrect username or password."
      });
    }

    // 3. Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        message: "Incorrect username or password."
      });
    }

    // 4. Generate JWT
    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET is not defined");
    }

    const token = jwt.sign(
      {
        id: user._id,
        username: user.username
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    // 5. Respond
    return res.status(200).json({
      message: "Login successful.",
      token
    });

  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({
      message: "Server error during login."
    });
  }
}

/**
 * @desc    Logout user (JWT is stateless)
 * @route   POST /api/auth/logout
 * @access  Public
 */
export function logout(req, res) {
  return res.status(200).json({
    message: "Logged out successfully."
  });
}
