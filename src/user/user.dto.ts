import { GenderEnum } from '../enums';

export interface UserDto {
  firstName?: string;
  lastName: string;
  username?: string;
  password?: string;
  email?: string;
  mobile: string;
  salt?: string;
  gender: GenderEnum;
  userType: string;
}
