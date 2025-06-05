import { User, UserType } from "./user.mjs";


export const mockUsers: User[] = [
  {
    id: '1',
    firstName: 'Alice',
    lastName: 'Smith',
    email: 'alice.smith@example.com',
    phoneNumber: '+1-555-111-2222',
    type: UserType.Admin,
  },
  {
    id: '2',
    firstName: 'Bob',
    lastName: 'Johnson',
    email: 'bob.johnson@example.com',
    type: UserType.Basic,
  },
  {
    id: '3',
    firstName: 'Charlie',
    lastName: 'Brown',
    email: 'charlie.brown@example.com',
    phoneNumber: '+1-555-333-4444',
    type: UserType.Basic,
  },
  {
    id: '4',
    firstName: 'Diana',
    lastName: 'Miller',
    email: 'diana.miller@example.com',
    phoneNumber: '+1-555-555-6666',
    type: UserType.Admin,
  },
  {
    id: '5',
    firstName: 'Edward',
    lastName: 'Davis',
    email: 'edward.davis@example.com',
    type: UserType.Admin,
  },
  {
    id: '6',
    firstName: 'Fiona',
    lastName: 'Wilson',
    email: 'fiona.wilson@example.com',
    phoneNumber: '+1-555-777-8888',
    type: UserType.Basic,
  },
  {
    id: '7',
    firstName: 'George',
    lastName: 'Clark',
    email: 'george.clark@example.com',
    type: UserType.Basic,
  },
  {
    id: '8',
    firstName: 'Hannah',
    lastName: 'Martinez',
    email: 'hannah.martinez@example.com',
    phoneNumber: '+1-555-999-0000',
    type: UserType.Admin,
  },
  {
    id: '9',
    firstName: 'Ivan',
    lastName: 'Lopez',
    email: 'ivan.lopez@example.com',
    type: UserType.Basic,
  },
  {
    id: '10',
    firstName: 'Julia',
    lastName: 'Taylor',
    email: 'julia.taylor@example.com',
    phoneNumber: '+1-555-123-4567',
    type: UserType.Admin,
  },
];

