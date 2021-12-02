import Mongoose from "mongoose";
import bycript from "bcrypt";
import config from "config";

export interface UserDocument extends Mongoose.Document {
  email: string;
  name: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const UserSchema = new Mongoose.Schema(
  {
    email: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    password: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

UserSchema.pre("save", async function (next) {
  let user = this as UserDocument;

  if (!user.isModified("password")) {
    return next();
  }

  const salt = await bycript.genSalt(config.get<number>("saltWorkFactor"));
  const hash = await bycript.hashSync(user.password, salt);

  user.password = hash;
  return next();
});

UserSchema.methods.comparePassword = async function (
  candidatePassword: string
): Promise<boolean> {
  const user = this as UserDocument;

  return await bycript.compare(candidatePassword, user.password).catch((e) => {
    return false;
  });
};

const UserModel = Mongoose.model<UserDocument>("user", UserSchema);

export default UserModel;
