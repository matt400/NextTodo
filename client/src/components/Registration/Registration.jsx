import { useState } from 'react';
import './Registration.css';
import './Registration-media.css';
import Heading from '../Heading.jsx';
import Field from '../Field.jsx';
import MailIcon from '../../assets/icons/MailIcon.jsx';
import PasswordIcon from '../../assets/icons/PasswordIcon.jsx';
import Button from '../Button.jsx';
import Linking from '../Linking.jsx';

const Registration = () => {
  const [values, setValues] = useState({
    email: '',
    password: '',
    confirmPassword: ''
  });

  const [errors, setErrors] = useState({});

  const validateLive = (field, value) => {
    let message = '';

    if (field === 'email') {
      if (!value) message = 'Email is required';
      else if (!/\S+@\S+\.\S+/.test(value))
        message = 'Enter a correct email address';
    }

    if (field === 'password') {
      if (!value) message = 'Password is required';
      else if (value.length < 8) message = 'Password must be at least 8 characters long';
      else if (value.length > 64) message = 'Password can have a maximum of 64 characters';
      else if (!/[a-z]/.test(value)) message = 'Password must contain at least one lowercase letter';
      else if (!/[A-Z]/.test(value)) message = 'Password must contain at least one uppercase letter';
      else if (!/[0-9]/.test(value)) message = 'Password must contain at least one digit';
      else if (!/[!@#$%^&*()_\-+=\[\]{};:\'",.<>/?`~\\|]/.test(value))
        message = 'Password must contain at least one special character';
      else if (/\s/.test(value)) message = 'Password cannot contain spaces';
    }

    if (field === 'confirmPassword') {
      if (!value) message = 'Please repeat your password';
      else if (value !== values.password) message = 'Passwords do not match';
    }

    setErrors(prev => ({
      ...prev,
      [field]: message
    }));
  };

  const handleChange = (e) => {
    const { id, value } = e.target;

    setValues(prev => ({
      ...prev,
      [id]: value
    }));

    validateLive(id, value);

    if (id === 'password') {
      validateLive('confirmPassword', values.confirmPassword);
    }
  };

  return (
    <div className='registration'>
      <Heading title='Create Account' text='Sign up to get started' />

      <Field
        innerText='Enter your email'
        Icon={MailIcon}
        id='email'
        type='email'
        label='Email'
        value={values.email}
        onChange={handleChange}
        error={errors.email}
      />

      <Field
        innerText='Enter your password'
        Icon={PasswordIcon}
        id='password'
        type='password'
        label='Password'
        value={values.password}
        onChange={handleChange
        }
        error={errors.password}
      />

      <Field
        innerText='Confirm your password'
        Icon={PasswordIcon}
        id='confirmPassword'
        type='password'
        label='Confirm password'
        value={values.confirmPassword}
        onChange={handleChange}
        error={errors.confirmPassword}
      />

      <Button inner='Sign up' />

      <Linking to='/login' innerText='Already have an account? Sign in' />
    </div>
  );
};

export default Registration;
