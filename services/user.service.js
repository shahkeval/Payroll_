const UserModel = require("../models/user.model");
const constants = require("../contants");
const { getCount } = require("../helper/common");

const UserService = {
  // This method is used to retrive a list of user with page and size
  async getAllUsers() {
    try {
      let whereClause = {};
      const users = await UserModel.find(whereClause).sort({ _id: -1 }).lean();
      console.log("users", { users });
      const totalRecordOfUsers = await getCount(UserModel, whereClause);
      return { users, totalRecordOfUsers };
    } catch (error) {
      throw error;
    }
  },

  // This method is used to retrive a list of user with page and size
  async getAllUsersData({ offset, limit, type }, status = "") {
    try {
      let whereClause = {};
      const users = await UserModel.find(whereClause)
        .sort({ _id: -1 })
        .skip(offset)
        .limit(limit)
        .lean();

      const totalRecordOfUsers = await getCount(UserModel, whereClause);
      return { users, totalRecordOfUsers };
    } catch (error) {
      throw error;
    }
  },

  // This method is used to retrieve a user detail by id
  async getUserDetailsById(id) {
    try {
      let user = await UserModel.findById(id);
      return user;
    } catch (error) {
      throw error;
    }
  },
  // This method is used to add user detail by admin
  async createUser(bodyData) {
    try {
      let { name, email, status } = bodyData;

      const user = new UserModel({
        name,
        email,
        status,
        userId: await UserService.generateUserId(),
      });

      const findUser = await UserModel.findOne({
        $or: [
          {
            email,
          },
        ],
      });

      if (findUser) {
        return { findUser };
      }
      const saveUser = await user.save();
      return { findUser, saveUser };
    } catch (error) {
      throw error;
    }
  },
  // This common method is used to update a user detail
  async updateUserData(bodyData, user) {
    try {
      let { name, email, status } = bodyData;

      let requestUser = {
        ...(name ? { name } : {}),
        ...(email ? { email } : {}),
        ...(status ? { status } : {}),
      };

      _.map(requestUser, (userField, key) => {
        user[key] = requestUser[key];
      });

      // add updatedBy to get track of the updates
      user.updatedBy = user._id;

      const updatedUser = await UserModel.findByIdAndUpdate(user._id, user, {
        new: true,
        upsert: true,
      }).lean();
      // eslint-disable-next-line no-unused-vars
      const { password: hash, ...data } = updatedUser;

      return data;
    } catch (error) {
      throw error;
    }
  },
  // This method is used to update a user detail by id
  async updateUserById(id, bodyData) {
    try {
      const user = await UserModel.findById(id).lean();
      if (!user) {
        return { userNotFound: true };
      }
      const updateUser = await this.updateUserData(bodyData, user);
      return { userNotFound: false, updateUser };
    } catch (error) {
      throw error;
    }
  },
  // This method is used to delete a user detail by id
  async deleteUserById(id, deletedBy) {
    try {
      const deleteRecord = await UserModel.findOne({ _id: id });
      if (!deleteRecord) {
        return { deleteRecord };
      }

      await UserModel.findByIdAndUpdate(id, {
        status: constants.userStatus.removed,
        email: deleteRecord.email,
        name: deleteRecord.name,
      });
      return { deleteRecord };
    } catch (error) {
      throw error;
    }
  },
  async generateUserId() {
    try {
      let pad = "00000";
      const randomNo = Math.floor(Math.random() * (1000 - 1 + 1) + 1);
      let ctxt = "" + randomNo;
      const num = pad.substr(0, pad.length - ctxt.length) + ctxt;
      return "A" + num;
    } catch (error) {
      throw error;
    }
    return;
  },
};

module.exports = UserService;
