import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResoponse.js";
const registerUser = asyncHandler(async (req, res) => {
  //  return res.status(200).json({
  //   message: "oejekdhdhdhd",
  // });

  const { fullName, email, username, password } = req.body;
  console.log("email", email);

  if (
    [fullName, email, username, password].some((field) => field?.trim() === "")
  ) {
    throw new ApiError(400, "All fields are required");
  }
  const existedUser = User.findOne({
    $or: [{ username }, { email }],
  });
  if (existedUser) {
    throw new ApiError(409, "User with email or username already exists");
  }
  // Check for images
  const avatarLocalPath = req.files?.avatar?.[0]?.path;
  const coverImageLocalPath = req.files?.coverImage?.[0]?.path;
  console.log("response data coverimageslocalpath ====>", coverImageLocalPath);

  // Avatar is required
  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar image is required");
  }
  //Upload avatar to Cloudinary
  const avatar = await uploadOnCloudinary(avatarLocalPath);
  const coverImage = await uploadOnCloudinary(coverImageLocalPath);
  if (!avatar) {
    throw new ApiError(400, "Avatar file is required");
  }
  // Create user object / entry in DB
   const user = await User.create({
    username: username.toLowerCase(),
    email: email.toLowerCase(),
    password,
    avatar: avatar.url,
    coverImage: coverImage?.url || "",
  });
  // Check if user was actually created
  const createdUser = await User.findById(user._id).select(
    "-password -refereshToken"
  );
   if (!createdUser) {
    throw new ApiError(
      500,
      "Something went wrong while registering user"
    );
  }
    // Return response
  return res
    .status(201)
    .json(new ApiResponse(201, createdUser, "User registered successfully"));
});

export { registerUser };
