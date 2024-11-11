const UserService = require("../services/user.service");
const { getPagination, getPaginationData } = require("../helper/common");
const { sendSuccessResponse, sendErrorResponse } = require("../helper/response");
const messageConstants = require("../contants/messageConstants");

/**
 * @method get
 * @description for get list of all active user with pagination
 * @returns {list}
 */
exports.findAll = async (req, res) => {
  try {
    const { page = 1, size = 100 } = req.query;
    const { limit, offset } = getPagination(page, size);

    const { users, totalRecordOfUsers } = await UserService.getAllUsers();

    return sendSuccessResponse(
      res,
      getPaginationData(
        { totalRecords: totalRecordOfUsers, docs: users },
        page,
        limit
      )
    );
  } catch (error) {
    return sendErrorResponse(res, error.message);
  }
};

/**
 * @method get
 * @description for get list of all active user with pagination
 * @returns {list}
 */
exports.findAllWithPagination = async (req, res) => {
  try {
    const { page, size, type } = req.query;
    const { limit, offset } = getPagination(page, size);

    const { users, totalRecordOfUsers } = await UserService.getAllUsersData({
      offset,
      limit,
      type,
    });

    return sendSuccessResponse(
      res,
      getPaginationData(
        { totalRecords: totalRecordOfUsers, docs: users },
        page,
        limit
      )
    );
  } catch (error) {
    return sendErrorResponse(res, error.message);
  }
};
/**
 * @method put
 * @description for update user
 * @returns {object}
 */
exports.updateById = async (req, res) => {
  try {
    const { id } = req.params;
    const { userNotFound, updateUser } = await UserService.updateUserById(
      id,
      req.body
    );
    if (userNotFound) {
      return sendErrorResponse(
        res,
        stringFormate(messageConstants.common.NOT_FOUND, "User")
      );
    }
    return sendSuccessResponse(res, { data: updateUser });
  } catch (error) {
    if (`${error.message}`.match(/E11000/)) {
      if (`${error.message}`.match(`email`)) {
        return sendErrorResponse(
          res,
          messageConstants.user.EMAIL_ALREADY_EXISTS,
          400
        );
      }
    } else {
      return sendErrorResponse(res, error.message);
    }
  }
};

/**
 * @method delete
 * @description for delete user
 * @returns success message
 */
exports.removeUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { deleteRecord } = await UserService.deleteUserById(
      id,
      req.user._id
    );
    if (!deleteRecord) {
      return sendErrorResponse(res, messageConstants.user.REMOVE_USER_FAILURE);
    }
    return sendSuccessResponse(res, messageConstants.user.REMOVE_USER_SUCCESS);
  } catch (error) {
    return sendErrorResponse(res, error.message);
  }
};

/**
 * @method post
 * @description for create new user
 * @returns {object}
 */
exports.createUser = async (req, res) => {
  try {
    
    const { findUser = false, saveUser = [] } =
      await UserService.createUser(req.body);

    if (findUser) {
      return sendErrorResponse(
        res,
        messageConstants.auth.EMAIL_MOBILE_EXISTS,
        400
      );
    }

    // Send auto generated password to admin email address
    if (saveUser && saveUser.email) {
      if (error) {
        return sendErrorResponse(res, messageConstants.user.ERROR_SEND_EMAIL);
      } else if (errorInMail) {
        return sendSuccessResponse(res, {
          message: messageConstants.user.USER_ACCOUNT_CREATE_SUCCESS,
          data: saveUser,
        });
      } else {
        return sendSuccessResponse(res, {
          message: messageConstants.user.AUTO_GENERATE_PASSWORD_SUCCESS,
          data: saveUser,
        });
      }
    }

    return sendSuccessResponse(res, {
      message: messageConstants.user.USER_ACCOUNT_CREATE_SUCCESS,
      data: saveUser,
    });
  } catch (error) {
    return sendErrorResponse(res, error.message);
  }
};

/**
 * @method get
 * @description for get user detail by user id
 * @returns {object}
 */
exports.findOne = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await UserService.getUserDetailsById(id);
    return sendSuccessResponse(res, { data: user });
  } catch (error) {
    return sendErrorResponse(res, error.message);
  }
};