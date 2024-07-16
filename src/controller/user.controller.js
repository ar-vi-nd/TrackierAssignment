import { ApiResponse } from "../utility/ApiResponse.js";
import { asyncHandler } from "../utility/asyncHandler.js";
import { ApiError } from "../utility/ApiError.js";
import User from "../model/user.model.js";

const generateAccessToken = async (existingUser) => {
  try {
    const accessToken = await existingUser.generateAccessToken();

    if (!accessToken) {
      throw new ApiError("Error generating tokens");
    }

    return { accessToken };
  } catch (error) {
    console.log(error);
    throw new ApiError(500, "Error generating tokens or saving tokens ");
  }
};

const userRegister = asyncHandler(async (req, res) => {
  return res
    .status(200)
    .json(new ApiResponse(200, {}, "User Registered Successfully"));
});
const userSignup = asyncHandler(async (req, res) => {
  const { fullName, email, password } = req.body;

  // console.log([fullName, email, password]);

  if (
    [fullName, email, password].some((element) => {
      return element ? element.trim() === "" : true;
    })
  ) {
    return res.status(400).json(new ApiError(400, "All fields are required"))
  }

  const existingUser = await User.findOne({ email });

  console.log("existingUser : ", existingUser);

  if (existingUser) {
    return res.status(400).json(new ApiError(400, "Email already exists"))

  }

  const user = await User.create({
    fullName,
    email,
    password,
  });

  const createdUser = await User.findById(user._id).select("-password");

  if (!createdUser) {
    throw new ApiError(400, "Something went wrong while creating user");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, createdUser, "User Registered Successfully"));
});

const userLogin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!(email && password)) {
    return res.status(400).json(new ApiError(400, "Credentials required"))
  }

  const existingUser = await User.findOne({ email });
  if (!existingUser) {
    return res.status(400).json(new ApiError(400, "Credentials Invalid"))

  }
  const isPasswordCorrect = await existingUser.isPasswordCorrect(password);

  if (!isPasswordCorrect) {
    return res.status(400).json(new ApiError(400, "Invalid Credentials"))

  }
  const { accessToken } = await generateAccessToken(existingUser);

  const options = {
    httpOnly: true,
    // if i keep secure : true I am unable to send request along with cookies in thunderclient
    secure: false,
    sameSite: 'lax', // Adjust if necessary
    maxAge: 24 * 60 * 60 * 1000, // Cookie expires in 24 hours
  };
  existingUser.password = undefined;

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .json(new ApiResponse(200, { user: existingUser, accessToken }));
});

const userLogout = asyncHandler(async (req, res) => {
  const user = await User.findById(req?.user?._id);

  if (!user) {
    throw new ApiError(400, "Error while logging out");
  }

  const options = {
    httpOnly: true,
    secure: false,
    sameSite: 'lax',
  };

  return res
    .status(200)
    .clearCookie("accessToken", options)
    .json(new ApiResponse(200, "User Logout Successfully"));
});

export { userRegister, userSignup, userLogin, userLogout };
