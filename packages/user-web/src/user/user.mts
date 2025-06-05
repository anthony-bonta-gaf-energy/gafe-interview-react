export enum UserType {
  Admin = 'admin',
  Basic = 'basic',
}

export interface User {
  id?: string; // this was missing from the contract
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string; // this was set as optional base into the contract
  type: UserType;
}


export const USER_TYPE_LABELS: Record<UserType, string> = {
  [UserType.Admin]: 'Admin',
  [UserType.Basic]: 'Basic',
};