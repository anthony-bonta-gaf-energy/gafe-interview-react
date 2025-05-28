export enum UserType {
  Admin = 'admin',
  Basic = 'basic',
}

export interface User {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  type: UserType;
}

export interface ExistingUser extends User {
  id: string;
}
