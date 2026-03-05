import "dotenv/config";
import { hashingPassword, comparingPassword } from "./authUtils.js";
import { prisma } from "../config/db.js";

export const registerUser = async ({ name, email, password }) => {
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return { status: 409, message: "This user is already Register" };
  }

  const hash = await hashingPassword(password);

  const user = await prisma.user.create({
    data: { name, email, password: hash },
  });

  return {user, message:"Register Successfully" };
};

export const authenticateUser = async ({ email, password }) => {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    return { status: 401, message: "This user is not register" };
  }

  const comparePassword = await comparingPassword(password, user.password);
  if (comparePassword) {
    return { status: 200, message: "Login success",user };
  }

  return  { status: 401, message: "Enter a valid password" };;
};
