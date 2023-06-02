import { Request, Response } from 'express'
import dotenv from 'dotenv'
dotenv.config();

export const verifyToken = (req:Request, res:Response, next) => {
    let token = req.headers['x-access-token'];
  
    if (!token) {
      return res.status(403).send({
        message: 'No token provided!'
      });
    }
    
    if(token !== process.env.X_ACCESS_TOKEN) {
      return res.status(401).send({
        message: 'Unauthorized!'
      });
    }
    next();
};

export const verifySocketToken = (handshake) => {
  let flag = false;
  const socketToken = handshake.headers['x-access-token'];
  const token = process.env.X_ACCESS_TOKEN;
  if(socketToken === token) {
    flag = true;
  }

  return flag  
}