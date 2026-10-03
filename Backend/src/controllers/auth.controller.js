import User from "../models/User.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import securityQuestions from "../constants/securityQuestions.constants.js";

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

    // 2. Validate question IDs and answers
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

    if (!username || !password) {
      return res.status(400).json({
        message: "Please fill in both username and password."
      });
    }

    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({
        message: "Incorrect username or password."
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        message: "Incorrect username or password."
      });
    }

    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET is not defined");
    }

    const token = jwt.sign(
      { id: user._id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

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
 * @desc    Forgot password – get user's security questions
 * @route   POST /api/auth/forgot-password
 * @access  Public
 */
export async function forgotPassword(req, res) {
  try {
    const { username } = req.body;

    if (!username) {
      return res.status(400).json({
        message: "Username is required."
      });
    }

    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({
        message: "User not found."
      });
    }

    // Return ONLY the questions (no answers)
    const questions = user.securityQuestions.map(q => {
      const question = securityQuestions.find(sq => sq.id === q.questionId);
      return {
        questionId: q.questionId,
        text: question.text
      };
    });

    return res.json({ questions });

  } catch (error) {
    console.error("Forgot password error:", error);
    return res.status(500).json({
      message: "Server error."
    });
  }
}

export function getSecurityQuestions(req, res) {
  return res.json(securityQuestions);
}

/**
 * @desc    Reset password after answering security questions
 * @route   POST /api/auth/reset-password
 * @access  Public
 */
export async function resetPassword(req, res) {
  try {
    const { username, answers, newPassword } = req.body;

    if (!username || !answers || answers.length !== 2 || !newPassword) {
      return res.status(400).json({
        message: "Invalid input."
      });
    }

    if (newPassword.length < 8) {
      return res.status(400).json({
        message: "Password must be at least 8 characters long."
      });
    }

    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({
        message: "User not found."
      });
    }

    // Verify each answer
    for (const userAnswer of answers) {
      const storedQuestion = user.securityQuestions.find(
        q => q.questionId === userAnswer.questionId
      );

      if (!storedQuestion) {
        return res.status(400).json({
          message: "Invalid security question."
        });
      }

      const isMatch = await bcrypt.compare(
        userAnswer.answer.toLowerCase(),
        storedQuestion.answer
      );

      if (!isMatch) {
        return res.status(401).json({
          message: "Incorrect security answers."
        });
      }
    }

    // Update password
    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    return res.json({
      message: "Password reset successful."
    });

  } catch (error) {
    console.error("Reset password error:", error);
    return res.status(500).json({
      message: "Server error."
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
