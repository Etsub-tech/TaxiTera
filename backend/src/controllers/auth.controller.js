import { findOne, create } from '../models/User.model';
import { hash, compare } from 'bcryptjs';
import { sign } from 'jsonwebtoken';

export async function signup(req, res) {
  const { username, password } = req.body;

  if (!username || !password)
    return res.status(400).json({ message: 'Please fill in both fields.' });

  const exists = await findOne({ username });
  if (exists)
    return res.status(400).json({ message: 'Username already in use.' });

  const hashed = await hash(password, 10);
  const user = await create({ username, password: hashed });

  res.json({ message: 'Sign In successful.' });
}

export async function login(req, res) {
  const { username, password } = req.body;

  const user = await findOne({ username });
  if (!user)
    return res.status(401).json({ message: 'Incorrect username or password.' });

  const match = await compare(password, user.password);
  if (!match)
    return res.status(401).json({ message: 'Incorrect username or password.' });

  const token = sign({ id: user._id }, process.env.JWT_SECRET);
  res.json({ message: 'Login successful.', token });
}
