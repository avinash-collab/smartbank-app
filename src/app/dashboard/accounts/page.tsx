'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '../../services/api';

interface Account {
  id: number;
  accountType: string;
  accountNumber: string;
  balance: number;
  userId: number;
}

export default function AccountsPage() {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }

    api
      .get('/api/accounts/my-accounts')
      .then((response) => {
        console.log('API Response:', response.data);
        setAccounts(response.data);
      })
      .catch((error) => {
        console.error('Error fetching accounts:', error);
        router.push('/login');
      })
      .finally(() => setLoading(false));
  }, [router]);

  if (loading) return <p className="p-10 text-center">Loading accounts...</p>;

  return (
    <div className="p-10 text-black">
      <h1 className="text-2xl font-bold mb-6">Your Bank Accounts</h1>
      <button
      onClick={() => router.push('/dashboard')}
      className="mb-6 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
    >
      ← Back to Dashboard
    </button>
      {accounts.length === 0 ? (
        <p>No accounts found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {accounts.map((account) => (
            <div key={account.id} className="bg-white shadow p-4 rounded-lg">
              <p><strong>Type:</strong> {account.accountType}</p>
              <p><strong>Number:</strong> {account.accountNumber}</p>
              <p><strong>Balance:</strong> ₹{account.balance}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
