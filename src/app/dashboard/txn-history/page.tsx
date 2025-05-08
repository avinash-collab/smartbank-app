'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '../../services/api';

interface Transaction {
  type: number | string;
  status: string;
  timestamp: string;
  amount: number;
  description: string;
}

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [message, setMessage] = useState('');
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');
  
    if (!token || !userId) {
      console.warn('Missing token or userId');
      router.push('/login');  // Redirect to login
      return;
    }
  
    api.get(`/api/transactions/history/${userId}`)
      .then((res) => setTransactions(res.data))
      .catch(() => setMessage('Failed to fetch transactions'));
  }, [router]);
  
  
  
  

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white p-6 rounded shadow-md max-w-md w-full text-black">
      <button
      onClick={() => router.push('/dashboard')}
      className="mb-6 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
    >
      ← Back to Dashboard
    </button>
      <h1 className="text-2xl font-bold mb-4 text-center">Transaction History</h1>

      {message && <p className="text-red-600 text-center mb-4">{message}</p>}

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded shadow-md">
          <thead>
            <tr>
              <th className="px-4 py-2 border">Type</th>
              <th className="px-4 py-2 border">Amount</th>
              <th className="px-4 py-2 border">Status</th>
              <th className="px-4 py-2 border">Description</th>
              <th className="px-4 py-2 border">Timestamp</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((txn, idx) => (
              <tr key={idx} className="text-center">
                <td className="border px-4 py-2">{txn.type}</td>
                <td className="border px-4 py-2">₹ {txn.amount}</td>
                <td className="border px-4 py-2">{txn.status}</td>
                <td className="border px-4 py-2">{txn.description}</td>
                <td className="border px-4 py-2">
                  {new Date(txn.timestamp).toLocaleString()}
                </td>
              </tr>
            ))}
            {transactions.length === 0 && (
              <tr>
                <td colSpan={5} className="text-center py-4">No transactions found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      </div>
    </div>
  );
}
