'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { loginUser } from '../services/AuthService';

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
        const res = await loginUser(form);
        localStorage.setItem('token', res.token);
        localStorage.setItem('userId', res.userId); // <-- Add this
        router.push('/dashboard');
        
    } catch (err) {
      setError('Login failed. Please check your credentials.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
       
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded shadow-md w-full max-w-md"
      >
        <h2 className="text-4xl font-bold mb-6 text-black bold ">SmartBank</h2>
        <h2 className="text-2xl font-bold mb-6 text-black">Login</h2>

        {error && <p className="text-red-500 mb-4">{error}</p>}
        <label className="block mb-2 font-medium text-black">Enter Email</label>

        <input
          name="email"
          placeholder="Enter Email"
          className="w-full p-2 border mb-4 rounded text-black"
          onChange={handleChange}
          required
        />
        <label className="block mb-2 font-medium text-black">Enter Password</label>
        <input
          name="password"
          type="password"
          placeholder="Enter Password"
          className="w-full p-2 border mb-4 rounded text-black"
          onChange={handleChange}
          required
        />

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Login
        </button>

        <p className="mt-4 text-center text-black">
          New here?{' '}
          <a href="/register" className="text-blue-600 hover:underline">
            Register
          </a>
        </p>
      </form>
    </div>
  );
}
