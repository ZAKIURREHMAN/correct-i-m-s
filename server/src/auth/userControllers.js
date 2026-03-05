import { registerUser, authenticateUser } from "./userHandlers.js";

export const register = async (req, res) => {
  try {
    const { name,email,password } = req.body || {};
    if (!name || !email || !password) {
      return res.status(400).json({ message: "name, email and password are required" });
    }

    const user = await registerUser({ name, email, password });

    return res.status(201).json({ user});
  } catch (err) {
    console.error("register error", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};



export const login = async (req, res) => {
  try {
    const { email, password  } = req.body || {};
    if (!email || !password) {
      return res.status(400).json({ message: "email and password are required" });
    }
    const user = await authenticateUser({ email, password });
    console.log(user)
    return res.status(200).json({ data:user});
  } catch (err) {
    console.error("login error", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};
