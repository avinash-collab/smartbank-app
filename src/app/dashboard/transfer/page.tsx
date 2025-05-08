'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '../../services/api';

interface Account {
  id: string;
  accountNumber: string;
  accountType: string;
}

export default function TransferPage() {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [fromAccountId, setFromAccountId] = useState('');
  const [toAccountOption, setToAccountOption] = useState<'own' | 'other'>('own');
  const [toAccountId, setToAccountId] = useState('');
  const [manualToAccountNumber, setManualToAccountNumber] = useState('');
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

    if (toAccountOption === 'own' && fromAccountId === toAccountId) {
      setMessage('From and To accounts cannot be the same');
      return;
    }

    try {
      await api.post('/api/transactions/transfer', {
        fromAccountId,
        toAccountId: toAccountOption === 'own' ? toAccountId : null,
        toAccountNumber: toAccountOption === 'other' ? manualToAccountNumber : null,
        amount: parseFloat(amount),
        description,
      });

      setMessage('Transfer successful!');
      setAmount('');
      setDescription('');
      setToAccountId('');
      setManualToAccountNumber('');
      setTimeout(() => {
        router.push('/dashboard');
      }, 2000);
    } catch  {
      setMessage('Transfer failed. Please check your balance or account number.');
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
        <h1 className="text-2xl font-bold mb-6">Transfer Funds</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* From Account */}
          <div>
            <label className="block font-medium">From Account</label>
            <select
              value={fromAccountId}
              onChange={(e) => setFromAccountId(e.target.value)}
              required
              className="w-full border rounded px-3 py-2"
            >
              <option value="">-- Select From Account --</option>
              {accounts.map((acc) => (
                <option key={acc.id} value={acc.id}>
                  {acc.accountType} ({acc.accountNumber})
                </option>
              ))}
            </select>
          </div>

          {/* To Account */}
          <div>
            <label className="block font-medium">To Account</label>
            <div className="flex gap-4 mb-2">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="toOption"
                  value="own"
                  checked={toAccountOption === 'own'}
                  onChange={() => {
                    setToAccountOption('own');
                    setManualToAccountNumber('');
                  }}
                  className="mr-1"
                />
                My Account
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="toOption"
                  value="other"
                  checked={toAccountOption === 'other'}
                  onChange={() => {
                    setToAccountOption('other');
                    setToAccountId('');
                  }}
                  className="mr-1"
                />
                Other User
              </label>
            </div>

            {toAccountOption === 'own' ? (
              <select
                value={toAccountId}
                onChange={(e) => setToAccountId(e.target.value)}
                required
                className="w-full border rounded px-3 py-2"
              >
                <option value="">-- Select To Account --</option>
                {accounts
                  .filter((acc) => acc.id !== fromAccountId)
                  .map((acc) => (
                    <option key={acc.id} value={acc.id}>
                      {acc.accountType} ({acc.accountNumber})
                    </option>
                  ))}
              </select>
            ) : (
              <input
                type="text"
                placeholder="Enter recipient's account number"
                value={manualToAccountNumber}
                onChange={(e) => setManualToAccountNumber(e.target.value)}
                required
                className="w-full border rounded px-3 py-2"
              />
            )}
          </div>

          {/* Amount */}
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

          {/* Description */}
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

          {/* Submit Button */}
          <button
            type="submit"
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
          >
            Submit Transfer
          </button>
        </form>

        {/* Message */}
        {message && (
          <p className="mt-4 text-center font-medium text-blue-600">{message}</p>
        )}
      </div>
    </div>
  );
}
