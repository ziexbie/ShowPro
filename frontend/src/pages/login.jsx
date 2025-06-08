import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-hot-toast';

const LoginSchema = Yup.object().shape({
    email: Yup.string()
        .email('Invalid email')
        .required('Email is required'),
    password: Yup.string()
        .required('Password is required')
});

const Login = () => {
    const navigate = useNavigate();

    const formik = useFormik({
        initialValues: {
            email: '',
            password: '',
        },
        validationSchema: LoginSchema,
        onSubmit: async (values, { setSubmitting }) => {
            try {
                const response = await axios.post('http://localhost:5000/user/authenticate', values);

                if (response.data && response.data.token) {
                    localStorage.setItem('token', response.data.token);
                    localStorage.setItem('user', JSON.stringify(response.data.user));
                    toast.success('Welcome back!');
                    navigate('/browse-projects');
                }
            } catch (error) {
                toast.error('Invalid email or password');
            } finally {
                setSubmitting(false);
            }
        },
    });

    return (
        <div className="min-h-screen bg-black flex items-center justify-center px-4">
            <div className="max-w-md w-full space-y-8 bg-[#252525]  p-8 rounded-xl border border-[#6A669D]/20">
                <div>
                    <h2 className="text-3xl font-bold text-[#E5E3D4] text-center">
                        Welcome Back
                    </h2>
                    <p className="mt-2 text-center text-[#E5E3D4]/70">
                        New here?{' '}
                        <Link to="/signup" className="text-[#9ABF80] hover:text-[#9ABF80]/80">
                            Create an account
                        </Link>
                    </p>
                </div>

                <form onSubmit={formik.handleSubmit} className="mt-8 space-y-6">
                    <div className="space-y-4">
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
                    </div>

                    <button
                        type="submit"
                        disabled={formik.isSubmitting}
                        className="w-full py-3 px-4 bg-[#9ABF80] hover:bg-[#9ABF80]/90 text-black 
                                 font-medium rounded-lg transition-colors duration-300 disabled:opacity-50"
                    >
                        {formik.isSubmitting ? 'Signing in...' : 'Sign in'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Login;