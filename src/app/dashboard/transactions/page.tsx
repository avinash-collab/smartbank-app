'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '../../services/api';
import { AxiosError } from 'axios';

interface Account {
  id: string;
  accountNumber: string;
  accountType: string;
}

export default function MakeTransactionPage() {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [accountId, setAccountId] = useState('');
  const [type, setType] = useState('DEBIT');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [message, setMessage] = useState('');
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }

    api
      .get('/api/accounts/my-accounts')
      .then((res) => setAccounts(res.data))
      .catch(() => router.push('/login'));
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');

    try {
      await api.post('/api/transactions/make', {
        accountId,
        type,
        amount: parseFloat(amount),
        description,
      });
    
      setMessage('Transaction successful!');
      setAmount('');
      setDescription('');
      setTimeout(() => {
        router.push('/dashboard');
      }, 2000);
    } catch (error: unknown) {
      let errorMsg = 'Transaction failed. Please try again.';
    
      if (isAxiosError(error)) {
        errorMsg =
          (error.response?.data as { message?: string })?.message ||
          (typeof error.response?.data === 'string' ? error.response.data : errorMsg);
      }
    
      if (errorMsg.toLowerCase().includes('insufficient')) {
        setMessage('Transaction failed: Insufficient balance.');
      } else {
        setMessage(`Transaction failed: ${errorMsg}`);
      }
    
      setTimeout(() => {
        router.push('/dashboard');
      }, 2000);
    }
    
    // Utility function for safe Axios error check
    function isAxiosError(error: unknown): error is AxiosError {
      return (error as AxiosError).isAxiosError === true;
    }
    
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
    <div className="bg-white p-6 rounded shadow-md max-w-md w-full text-black">
    <button
      onClick={() => router.push('/dashboard')}
      className="mb-6 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
    >
      ← Back to Dashboard
    </button>
      <h1 className="text-2xl font-bold mb-6">Make a Transaction</h1>
      

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-medium">Select Account</label>
          <select
            value={accountId}
            onChange={(e) => setAccountId(e.target.value)}
            required
            className="w-full border rounded px-3 py-2"
          >
            <option value="">-- Choose an Account --</option>
            {accounts.map((acc) => (
              <option key={acc.id} value={acc.id}>
                {acc.accountType} ({acc.accountNumber})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block font-medium">Transaction Type</label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            required
            className="w-full border rounded px-3 py-2"
          >
            <option value="DEBIT">DEBIT</option>
            <option value="CREDIT">CREDIT</option>
          </select>
        </div>

        <div>
          <label className="block font-medium">Amount</label>
          <input
            type="number"
            min="0"
            step="0.01"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
            className="w-full border rounded px-3 py-2"
          />
        </div>

        <div>
          <label className="block font-medium">Description</label>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            className="w-full border rounded px-3 py-2"
          />
        </div>

        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
        >
          Submit Transaction
        </button>
      </form>

      {message && (
        <p className="mt-4 text-center font-medium text-green-600">{message}</p>
      )}
    </div>
    </div>
  );
}
