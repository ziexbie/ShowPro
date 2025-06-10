import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-hot-toast';

const SignupSchema = Yup.object().shape({
  name: Yup.string()
    .min(2, 'Name must be at least 2 characters')
    .max(50, 'Name must be less than 50 characters')
    .matches(/^[a-zA-Z\s]*$/, 'Name can only contain letters and spaces')
    .required('Name is required')
    .trim(),
  email: Yup.string()
    .email('Please enter a valid email address')
    .required('Email is required')
    .matches(
      /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/,
      'Invalid email format'
    ),
  password: Yup.string()
    .min(8, 'Password must be at least 8 characters')
    .max(50, 'Password is too long')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
      'Password must contain at least one uppercase letter, one lowercase letter, one number and one special character'
    )
    .required('Password is required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password'), null], 'Passwords must match')
    .required('Please confirm your password'),
});

const Signup = () => {
  const navigate = useNavigate();
  
  const formik = useFormik({
    initialValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: ''
    },
    validationSchema: SignupSchema,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        const { confirmPassword, ...signupData } = values;
        const response = await axios.post('http://localhost:5000/user/signup', signupData);
        
        toast.success('Account created successfully!');
        navigate('/login');
      } catch (error) {
        toast.error(error.response?.data?.message || 'Failed to create account');
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4">
      <div className="max-w-md w-full space-y-8 bg-[#252525] p-8 rounded-xl border border-[#6A669D]/20">
        <div>
          <h2 className="text-3xl font-bold text-[#E5E3D4] text-center">
            Create Account
          </h2>
          <p className="mt-2 text-center text-[#E5E3D4]/70">
            Already have an account?{' '}
            <Link to="/login" className="text-[#9ABF80] hover:text-[#9ABF80]/80">
              Sign in
            </Link>
          </p>
        </div>

        <form onSubmit={formik.handleSubmit} className="mt-8 space-y-6">
          <div className="space-y-4">
            <div>
              <input
                type="text"
                name="name"
                placeholder="Full Name"
                {...formik.getFieldProps('name')}
                className="w-full px-4 py-3 bg-[#252525] border border-[#6A669D]/20 rounded-lg 
                         text-[#E5E3D4] placeholder-[#E5E3D4]/50 focus:outline-none focus:border-[#9ABF80]"
              />
              {formik.touched.name && formik.errors.name && (
                <p className="mt-1 text-sm text-red-400">{formik.errors.name}</p>
              )}
            </div>

            <div>
              <input
                type="email"
                name="email"
                placeholder="Email Address"
                {...formik.getFieldProps('email')}
                className="w-full px-4 py-3 bg-[#252525] border border-[#6A669D]/20 rounded-lg 
                         text-[#E5E3D4] placeholder-[#E5E3D4]/50 focus:outline-none focus:border-[#9ABF80]"
              />
              {formik.touched.email && formik.errors.email && (
                <p className="mt-1 text-sm text-red-400">{formik.errors.email}</p>
              )}
            </div>

            <div>
              <input
                type="password"
                name="password"
                placeholder="Password"
                {...formik.getFieldProps('password')}
                className="w-full px-4 py-3 bg-[#252525] border border-[#6A669D]/20 rounded-lg 
                         text-[#E5E3D4] placeholder-[#E5E3D4]/50 focus:outline-none focus:border-[#9ABF80]"
              />
              {formik.touched.password && formik.errors.password && (
                <p className="mt-1 text-sm text-red-400">{formik.errors.password}</p>
              )}
            </div>

            <div>
              <input
                type="password"
                name="confirmPassword"
                placeholder="Confirm Password"
                {...formik.getFieldProps('confirmPassword')}
                className="w-full px-4 py-3 bg-[#252525] border border-[#6A669D]/20 rounded-lg 
                         text-[#E5E3D4] placeholder-[#E5E3D4]/50 focus:outline-none focus:border-[#9ABF80]"
              />
              {formik.touched.confirmPassword && formik.errors.confirmPassword && (
                <p className="mt-1 text-sm text-red-400">{formik.errors.confirmPassword}</p>
              )}
            </div>
          </div>

          <button
            type="submit"
            disabled={formik.isSubmitting}
            className="w-full py-3 px-4 bg-[#9ABF80] hover:bg-[#9ABF80]/90 text-black 
                     font-medium rounded-lg transition-colors duration-300 disabled:opacity-50"
          >
            {formik.isSubmitting ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Signup;