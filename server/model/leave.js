import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    id: {
        type: String,
        required: true,
        unique: true
    },
    eid: {
        type: String,
        required: true,
    },
    leave_status: {
        type: String,
        required: true,
    },
    reason: {
        type: String,
        required: true,
    },
    dateofleave: {
        type: Date, // Changed to Date type for better date handling
        required: true,
    },
    endDate: {
        type: Date, // New field for end date of the leave
        required: true,
    },
    leave_type: {
        type: String,
        required: true, // New field for the type of leave
    },
});

const UserModelLeave = mongoose.model("leave", UserSchema);

export default UserModelLeave;
