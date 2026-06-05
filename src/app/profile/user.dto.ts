export interface UserDto {
  id: number;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  userType: string;
  password: string;
  latitude?: number;
  longitude?: number;
  address: string;
}