export interface UserDto {
  firstName?: string;
  lastName: string;
  username?: string;
  password?: string;
  salt?: string;
  userType: string;
}
