module.exports = {
  common: {
    NOT_FOUND: "{0} not found.",
    USER_NOT_AWARE: "We are not aware of this user.",
    INVALID_PARAMETER: "Invalid parameter",
    FILE_NOT_FOUND: "FILE_TYPE file content not found.",
    INVALID_FILE_TYPE_TO_EXPORT: "Failed to export invalid file type.",
    FILE_GENERATED_SUCCESS:
      "The FILE_TYPE file content generated successfully.",
  },
  middleware: {
    NOT_AUTHORIZE_PERSON: "You are not authorized to perform this operation.",
    UNAUTHORIZED_ACCESS: "Unauthorized Access.",
    INVALID_TOKEN: "Unauthorized! Invalid Token or Token was expired!",
    INACTIVE_ACCOUNT:
      "Your account is in-active, Contact to admin for more info.",
  },
  auth: {
    ERROR_IN_REGISTRATION: "Error in Register. Please try again later.",
    EMAIL_ALREADY_EXISTS: "Account with that email address already exists.",
    ERROR_IN_SAVE_REGISTER_USER:
      "Error in register user data. Please try again later.",
    SINGUP_SUCCESS:
      "Success! You account has been registered. The administrator will approve soon.",
    USER_ACCOUNT_NOT_ACTIVE:
      "Your account is in-active, Please contact Pondir support for more help.",
    EMAIL_PASSWORD_NOT_VALID: "Invalid email or password.",
    LOGIN_SUCCESS: "Success! You are logged in.",
    LOGOUT_SUCCESS: "User Logged out successfully!",
    FORGOT_PASSWORD_EMAIL_SENT_SUCCESS:
      "Email sent for reset password of your account with instructions.",
    FORGOT_PASSWORD_SUCCESS:
      "Reset password of your account with instructions.",
    RESET_PASSWORD_TOKEN_INVALID: "Token Expired or Invalid.",
    RESET_PASSWORD_SUCCESS: "Password Reset Successfully.",
    EMAIL_MOBILE_EXISTS:
      "Account with that phone number or email already exists.",
    ERROR_SEND_EMAIL: "Error in sending email, please try again later.",
    REFRESH_TOKEN_REQUIRED: "Refresh Token is required!",
    REFRESH_TOKEN_NOT_FOUND: "Refresh token is not in database!",
    REFRESH_TOKEN_EXPIRED:
      "Refresh token was expired. Please make a new signin request!",
    REFRESH_TOKEN_SUCCESS: "Success! Your access token generated",
    ERROR_IN_PMS_LOGIN: "Invalid username or password, Please try again later",
  },
  user: {
    EMAIL_ALREADY_EXISTS: "Account with that email address already exists.",
    REMOVE_USER_SUCCESS: "User removed successfully.",
    BLACKLIST_USER_SUCCESS: "User blacklisted successfully.",
    USER_ACCOUNT_CREATE_SUCCESS: "Success! User account is created.",
    PHONE_ALREADY_EXISTS: "Account with that phoneNumber already exists.",
    REMOVE_USER_FAILURE: "User not found with specified id",
    USER_SEASON_EXISTS: "User have already applied for change season pass.",
    REMOVE_USER_REQUEST_SUCCESS:
      "User terminate request scheduled successfully.",
    ERROR_SEND_EMAIL: "Error in sending email, please try again later.",
    AUTO_GENERATE_PASSWORD_SUCCESS:
      "Auto generated password has been sent to your email successfully.",
  },
};
