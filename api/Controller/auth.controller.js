import User from "../Model/user.model.js";
import bcryptjs from "bcryptjs";
import { errorHandler } from "../Utils/error.js";
import jwt from "jsonwebtoken";

export const Signup = async (req, res, next) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password) {
    return next(
      errorHandler(400, "Username, email, and password are required")
    );
  }
  const hashpass = bcryptjs.hashSync(password, 12);
  const createUser = await User({ username, email, password: hashpass });
  try {
    await createUser.save();
    res.status(200).json("user has Created Successfully");
  } catch (error) {
    next(errorHandler(401, "Please use Unique Key Words"));
  }
};

export const Signin = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const userFind = await User.findOne({ email });
    if (!userFind) return next(errorHandler(401, "User not Found"));
    const passFind = bcryptjs.compareSync(password, userFind.password);
    if (!passFind) return next(errorHandler(401, "Credential Error"));
    const token = jwt.sign({ id: userFind._id }, process.env.JWT);
    const { password: sec, ...rest } = userFind._doc;
    res
      .cookie("access_token", token, { httpOnly: true })
      .status(200)
      .json(rest);
  } catch (error) {
    next(error);
  }
};

export const Google = async (req, res, next) => {
  const findUser = await User.findOne({ email: req.body.email });
  if (findUser) {
    const token = jwt.sign({ id: findUser._id }, process.env.JWT);
    const { password: sec, ...rest } = findUser._doc;
    res
      .cookie("access_token", token, { httpOnly: true })
      .status(200)
      .json(rest);
  }
  try {
    const GeneratePassword =
      Math.random().toString(36).slice(-8) +
      Math.random().toString(36).slice(-8);
    const hashpass = bcryptjs.hashSync(GeneratePassword, 10);
    const createUser = await User.create({
      username:
        req.body.name.split(" ").join("").toLowerCase() +
        Math.random().toString(36).slice(-4),
      email: req.body.email,
      password: hashpass,
      avatar: req.body.photo,
    });
    const token = jwt.sign({ id: createUser._id }, process.env.JWT);
    const { password: sec, ...rest } = createUser._doc;
    res
      .cookie("access_token", token, { httpOnly: true })
      .status(200)
      .json(rest);
  } catch (error) {
    next(error);
  }
};

export const signout = async (req, res, next) => {
  try {
    res.clearCookie("access_token");
    res.status(200).json("user has been Sign out");
  } catch (error) {
    next(error);
  }
};
