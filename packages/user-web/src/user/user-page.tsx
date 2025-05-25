import { useFormik } from 'formik';
import { useNavigate, useParams } from 'react-router';
import { v4 as uuidv4 } from 'uuid';

import { useGetUser, useMutateUser } from '../hooks/user';

import { UserSchema } from '../schemas/user';

import { User, UserType } from './user.mjs';

import Input from '../components/form/Input';

import { useEffect } from 'react';
import styles from './user-page.module.css';

const initialValues: User = {
  id: '',
  firstName: '',
  lastName: '',
  email: '',
  phoneNumber: '',
  type: UserType.Basic,
}

const options = [
  { value: UserType.Admin, label: 'Admin' },
  { value: UserType.Basic, label: 'Basic' },
]

export function UserPage() {
  const navigate = useNavigate();
  const { id } = useParams()

  const { mutate, loading } = useMutateUser();
  const { loading: fetchingUser, user } = useGetUser(id);


  const { values, handleChange, handleSubmit, isValid, dirty, resetForm } = useFormik({
    initialValues,
    validationSchema: UserSchema,
    onSubmit: async (values) => {
      if (!id) values.id = uuidv4();

      await mutate(values);
      alert('User added successfully')
      navigate('/');
    },
  })

  const disabled = Boolean(id && fetchingUser)

  useEffect(() => {
    if (user) {
      resetForm({ values: user })
    }
  }, [user])

  return <div className={styles['user-page']}>
    <form onSubmit={handleSubmit}>
      <Input disabled={disabled} required label="First Name" name="firstName" type="text" value={values.firstName} onChange={handleChange} />
      <Input disabled={disabled} required label="Last Name" name="lastName" type="text" value={values.lastName} onChange={handleChange} />
      <Input disabled={disabled} label="Phone Number" name="phoneNumber" type="tel" value={values.phoneNumber} onChange={handleChange} />
      <Input disabled={disabled} required label="Email" name="email" type="email" value={values.email} onChange={handleChange} />
      <Input disabled={disabled} required label="Type" name="type" type="select" value={values.type} onChange={handleChange} options={options} />
      <div>
        <button onClick={() => navigate('/')} disabled={loading || disabled}>Cancel</button>
        <button type="submit" disabled={!(isValid && dirty) || loading || disabled}>Submit</button>
      </div>

    </form>
  </div>;
}
