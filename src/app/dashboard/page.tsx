'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { jwtDecode } from 'jwt-decode';
import Link from 'next/link';
import {
  LayoutDashboard,
  Banknote,
  ArrowRightLeft,
  History,
  LogOut,
  PlusCircle,
  Send,
} from 'lucide-react';

interface DecodedToken {
  sub: string;
  exp: number;
  [key: string]: unknown;
}

interface DashboardCardProps {
  icon: React.ReactNode;
  label: string;
  color: string;
  onClick: () => void;
}

function DashboardCard({ icon, label, color, onClick }: DashboardCardProps) {
  return (
    <div
      onClick={onClick}
      className={`cursor-pointer flex items-center gap-4 p-6 rounded-xl text-white shadow-md hover:scale-105 transition-transform ${color}`}
    >
      <div>{icon}</div>
      <div className="text-lg font-semibold">{label}</div>
    </div>
  );
}

export default function Dashboard() {
  const router = useRouter();
  const [userEmail, setUserEmail] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
    } else {
      try {
        const decoded = jwtDecode<DecodedToken>(token);
        setUserEmail(decoded.sub);
      } catch  {
        localStorage.removeItem('token');
        router.push('/login');
      }
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/login');
  };

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-md p-6">
        <h2 className="text-xl font-bold mb-6 text-black">SmartBank</h2>
        <nav className="space-y-4">
          <Link href="/dashboard" className="flex items-center gap-2 text-gray-700 hover:text-blue-600">
            <LayoutDashboard size={20} /> Dashboard
          </Link>
          <Link href="/dashboard/accounts" className="flex items-center gap-2 text-gray-700 hover:text-blue-600">
            <Banknote size={20} /> Accounts
          </Link>
          <Link href="/dashboard/transactions" className="flex items-center gap-2 text-gray-700 hover:text-blue-600">
            <ArrowRightLeft size={20} /> Transactions
          </Link>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 w-full text-left text-red-600 hover:text-red-700"
          >
            <LogOut size={20} /> Logout
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-10 bg-gray-100">
        <h1 className="text-3xl font-bold mb-10 text-gray-800 text-center">Welcome, {userEmail}</h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
          <DashboardCard
            icon={<PlusCircle size={30} />}
            label="Create Bank Account"
            color="bg-green-600"
            onClick={() => router.push('/dashboard/create-account')}
          />
          <DashboardCard
            icon={<LayoutDashboard size={30} />}
            label="View Accounts"
            color="bg-blue-600"
            onClick={() => router.push('/dashboard/accounts')}
          />
          <DashboardCard
            icon={<ArrowRightLeft size={30} />}
            label="Make a Transaction"
            color="bg-purple-600"
            onClick={() => router.push('/dashboard/transactions')}
          />
          <DashboardCard
            icon={<Send size={30} />}
            label="Transfer"
            color="bg-indigo-600"
            onClick={() => router.push('/dashboard/transfer')}
          />
          <DashboardCard
            icon={<History size={30} />}
            label="Transaction History"
            color="bg-gray-700"
            onClick={() => router.push('/dashboard/txn-history')}
          />
        </div>
      </main>
    </div>
  );
}
