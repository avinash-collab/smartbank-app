'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '../../services/api';
import { AxiosError } from 'axios';

export default function CreateAccountPage() {
  const [type, setType] = useState('SAVING');
  const [initialBalance, setInitialBalance] = useState('');
  const [message, setMessage] = useState('');
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login'); 
    }
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const token = localStorage.getItem('token');
    if (!token) {
      setMessage('You must be logged in.');
      return;
    }

    try {
        const response = await api.post('api/accounts/create', {
          type,
          initialBalance: parseFloat(initialBalance),
        });
      
        setMessage(`Account Created: ${response.data.accountNumber}`);
        setTimeout(() => {
          router.push('/dashboard');
        }, 2000);
      } catch (error: unknown) {
        let errorMsg = 'Error creating account';
      
        if (isAxiosError(error)) {
          errorMsg =
            (error.response?.data as { message?: string })?.message ||
            (typeof error.response?.data === 'string' ? error.response.data : errorMsg);
        }
      
        setMessage(errorMsg);
      }
      
      // Reusable Axios error type guard
      function isAxiosError(error: unknown): error is AxiosError {
        return (error as AxiosError).isAxiosError === true;
      }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded shadow-md max-w-md w-full"
      >
         <button
      onClick={() => router.push('/dashboard')}
      className="mb-6 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
    >
      ← Back to Dashboard
    </button>
        <h2 className="text-xl font-bold mb-4 text-black">Create Bank Account</h2>
       
        <label className="block mb-2 font-medium text-black">Account Type</label>
        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="w-full border p-2 rounded mb-4 text-black"
        >
          <option value="SAVING">Saving</option>
          <option value="CURRENT">Current</option>
          <option value="CREDIT">Credit</option>
        </select>
        <label className="block mb-2 font-medium text-black">Initial Balance</label>
        <input
          type="number"
          placeholder="Initial Balance"
          value={initialBalance}
          onChange={(e) => setInitialBalance(e.target.value)}
          className="w-full border p-2 rounded mb-4 text-black"
          min="0"
          required
        />

        <button
          type="submit"
          className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
        >
          Create Account
        </button>

        {message && <p className="mt-4 text-center text-blue-600">{message}</p>}
      </form>
    </div>
  );
}
