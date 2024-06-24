const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
    },
    // Mật khẩu người dùng
    password: {
      type: String,
      required: true,
    },
    // Họ và tên của người dùng
    fullName: {
      type: String,
      required: true,
    },
    // Số điện thoại của người dùng
    phoneNumber: {
      type: Number,
      required: true,
    },
    // Email của người dùng
    email: {
      type: String,
      required: true,
    },
    resetToken: String,
    resetExpiration: Date,

    isClient: {
      type: Boolean,
      required: true,
    },
    isAdmin: {
      type: Boolean,
      required: true,
    },
  },
  { timestamps: true }
);

userSchema.statics.login = async function (username, password) {
  const user = await this.findOne({ username });
  if (user) {
    const auth = await bcrypt.compare(password, user.password);
    if (auth) {
      return user;
    }
    throw Error('incorrect password');
  }
  throw Error('incorrect username');
};

module.exports = mongoose.model('User', userSchema);
