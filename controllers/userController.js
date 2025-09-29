import User from "../models/user.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from 'dotenv';
dotenv.config();//load .env file in .env file


export function createUser(req ,res){
    if(req.body.role == "admin"){
        if(req.user!= null){
            if(req.user.role != "admin"){
                res.status(403).josn({
                    message : "You are not Authorized to create admin accounts"
                })
                return
            }

        }
        else{
            res.status(403).json({
                    message: "You are not Authorized Create an admin account Please Login first"
                })
                return
        }
    }

    const hashedPassword = bcrypt.hashSync(req.body.password, 10)
    
    const user = new User({
        firstName : req.body.firstName,
        lastName : req.body.lastName,
        email : req.body.email,
        password : hashedPassword,
        role : req.body.role
    })

    user.save().then(
        ()=>{
            res.json(
                {
                    message : "User created Successfully"
                }
            )
        }
    ).catch(
        ()=>{
            res.json(
                {
                    message : "Failed To Create User"
                }
            )
        }
    )
}

export function loginUser(req, res){
    const email = req.body.email
    const password = req.body.password

    User.findOne({email : email}).then(
    (user)=>{
        if(user == null){
            res.status(404).json(
                {
                    message : "User Not Found"
                }

            )
        }else{

            const   isPasswordCorrect = bcrypt.compareSync(password, user.password)
            if(isPasswordCorrect){

                
                const token = jwt.sign(
                    {
                        email : user.email,
                        firstName : user.firstName,
                        lastName : user.lastName,
                        role : user.role,
                        img : user.img
                    },
                    process.env.JWT_KEY
                )


                res.json(
                    {
                        message : "Login Successfull",
                        token : token
                    }
                )
            }else{
                res.status(401).json(
                    {
                        message : "Invalid Password"
                    }
                )
            }
        }
    }
    )
}
export function isAdmin(req){
    if(req.user == null){
         return false
    }
    if(req.user.role != "admin"){
        return false
    }
    return true
}
