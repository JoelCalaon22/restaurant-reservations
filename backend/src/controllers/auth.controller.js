import * as authService from "../services/auth.service.js";

export async function register(req, res) {
  try {
    const user = await authService.register(req.body);
    return res.status(201).json(user);
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
}

export async function login(req, res) {
  try {
    const result = await authService.login(req.body);
    return res.json(result);
  } catch (err) {
    return res.status(401).json({ message: err.message });
  }
}

export async function forgotPassword(req, res) {
  await authService.forgotPassword(req.body);
  return res.json({ message: "if the email exists, a reset link was sent." });
}

export async function resetPassword(req, res) {
  try {
    await authService.resetPassword(req.body);
    return res.json({ message: "password updated successfully." });
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
}
