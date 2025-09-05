'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { getAdminSession, clearAdminSession } from '@/lib/admin-auth';
import { Database, Users, Building2, Settings, LogOut, User, Package, Ticket } from 'lucide-react';

export default function AdminDashboard() {
  const [adminSession, setAdminSession] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    const session = getAdminSession();
    if (!session) {
      router.push('/admin/sign-in');
    } else {
      setAdminSession(session);
    }
  }, [router]);

  const handleSignOut = () => {
    clearAdminSession();
    router.push('/admin/sign-in');
  };

  if (!adminSession) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Admin Dashboard</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Welcome back, {adminSession.email}
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Badge variant="secondary" className="px-3 py-1">
            <User className="w-4 h-4 mr-2" />
            Admin
          </Badge>
          <Button 
            variant="outline" 
            onClick={handleSignOut}
            data-testid="button-admin-signout"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Sign Out
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">--</div>
            <p className="text-xs text-muted-foreground">Platform users</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Agencies</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">--</div>
            <p className="text-xs text-muted-foreground">Active agencies</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Individual Users</CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">--</div>
            <p className="text-xs text-muted-foreground">Individual accounts</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Support Tickets</CardTitle>
            <Ticket className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">--</div>
            <p className="text-xs text-muted-foreground">Open tickets</p>
          </CardContent>
        </Card>
      </div>

      {/* Admin Functions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="cursor-pointer hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Database className="w-5 h-5 mr-3 text-blue-600" />
              Database Management
            </CardTitle>
            <CardDescription>
              Manage database operations, view tables, and perform maintenance tasks
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full" variant="outline" data-testid="button-database-management">
              Access Database
            </Button>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Users className="w-5 h-5 mr-3 text-green-600" />
              User Management
            </CardTitle>
            <CardDescription>
              View and manage platform users, agencies, and individual accounts
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full" variant="outline" data-testid="button-user-management">
              Manage Users
            </Button>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Package className="w-5 h-5 mr-3 text-purple-600" />
              Marketplace Management
            </CardTitle>
            <CardDescription>
              Manage themes, plugins, and marketplace transactions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full" variant="outline" data-testid="button-marketplace-management">
              Manage Marketplace
            </Button>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Ticket className="w-5 h-5 mr-3 text-orange-600" />
              Support Center
            </CardTitle>
            <CardDescription>
              View and respond to support tickets from users
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full" variant="outline" data-testid="button-support-center">
              Support Dashboard
            </Button>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Settings className="w-5 h-5 mr-3 text-gray-600" />
              System Settings
            </CardTitle>
            <CardDescription>
              Configure platform settings, features, and system preferences
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full" variant="outline" data-testid="button-system-settings">
              System Config
            </Button>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Building2 className="w-5 h-5 mr-3 text-indigo-600" />
              Agency Overview
            </CardTitle>
            <CardDescription>
              Monitor agency performance, subscriptions, and subaccounts
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full" variant="outline" data-testid="button-agency-overview">
              View Agencies
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>Latest system events and user activities</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            <Database className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>Admin dashboard is ready for database monitoring and management</p>
            <p className="text-sm mt-2">Database successfully migrated to MYSQL</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}