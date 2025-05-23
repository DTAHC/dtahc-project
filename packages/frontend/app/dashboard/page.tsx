'use client';

import DashboardLayout from '@/components/layout/DashboardLayout';
import Dashboard from '@/components/dashboard/Dashboard';

export default function DashboardPage() {
  return (
    <DashboardLayout activeMenu="dashboard">
      <Dashboard />
    </DashboardLayout>
  );
}