import * as Yup from 'yup';

export const UserSchema = Yup.object().shape({
  firstName: Yup.string().required('Required'),
  lastName: Yup.string().required('Required'),
  email: Yup.string().email('Invalid email').required('Required'),
  type: Yup.string().required('Required'),
});