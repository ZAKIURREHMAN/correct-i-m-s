import jwt from 'jsonwebtoken';
import bcrypt from "bcrypt"
import dotenv from "dotenv"
dotenv.config()

export const hashingPassword = async (password)=>{
    const saltRounds = 10
    const hash = await bcrypt.hash(password, saltRounds);
    return hash;
}

export const comparingPassword = async (password,hashPassword)=>{
    const compare = await bcrypt.compare(password, hashPassword);
    return compare;
}

export const accessToken = async(data)=>{
    const {id,email,name} = data
    const accessToken = jwt.sign({id,email,name},process.env.SIGNATURE_KEY, {expiresIn:"1h"} )
    return accessToken
}

export const refreshToken = async(data)=>{
    const {id,email,name} = data
    const refreshToken = jwt.sign({id,email,name},process.env.SIGNATURE_KEY, {expiresIn:"7d"} )
    return refreshToken
}

export const verifyToken = async (token)=>{
    const verify = jwt.verify(token,process.env.SIGNATURE_KEY)
    return verify
}