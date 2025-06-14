export enum UserType {
  Admin = 'admin',
  Basic = 'basic',
}

// Added an empty string for the initial select option,
// making it a valid value for form initialization and required validation.
export const UserTypeSelect = {
  ...UserType,
  Empty: '',
} as const;

export interface User {
  id?: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string;
  type: UserType;
}
