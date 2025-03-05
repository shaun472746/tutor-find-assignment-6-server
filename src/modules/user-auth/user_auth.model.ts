import { model, Schema } from 'mongoose';
import { TUser, UserModel, ITutorProfile } from './user_auth.interface';
import bcrypt from 'bcrypt';
import config from '../../app/config';

const userSchema = new Schema<TUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['tutor', 'student'] },
    isBlocked: { type: Boolean, default: false },
    updateProfile: { type: Boolean, default: true },
  },
  {
    timestamps: true,
  }
);

userSchema.pre('save', async function (next) {
  const user = this;
  user.password = await bcrypt.hash(user.password, Number(config.bcrypt_salt));
  next();
});

userSchema.statics.isUserExistsByEmail = async function (email: string) {
  return await User.findOne({ email });
};

userSchema.statics.isPasswordMatched = async function (
  plainTextPassword,
  hashedPassword
) {
  return await bcrypt.compare(plainTextPassword, hashedPassword);
};

userSchema.statics.isJWTIssuedBeforePasswordChanged = function (
  passwordChangedTimestamp: Date,
  jwtIssuedTimestamp: number
) {
  const passwordChangedTime =
    new Date(passwordChangedTimestamp).getTime() / 1000;
  return passwordChangedTime > jwtIssuedTimestamp;
};

/**
 * update tutor profile
 */
const TutorProfileSchema = new Schema<ITutorProfile>({
  id: { type: String, required: true },
  expertise: { type: [String], required: true }, // ✅ Fix: Define as array
  subjects: { type: [String], required: true },
  rating: { type: Number },
  image: { type: String },
  address: { type: String, required: true },
  phone: { type: String, required: true },
  earning: { type: Number },
  availability_slot: { type: [String], required: true },
  hourly_rate: { type: Number, required: true },
});

export const TutorProfile = model<ITutorProfile>(
  'TutorProfile',
  TutorProfileSchema
);
export const User = model<TUser, UserModel>('User', userSchema);
