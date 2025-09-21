import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const Profile: React.FC = () => {
  const currentUser = JSON.parse(localStorage.getItem('user') || '{}');

  return (
    <div className="p-6 space-y-6 bg-white dark:bg-gray-900 min-h-screen">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Profile</h1>
      </div>

      <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
        <CardHeader>
          <CardTitle className="text-gray-900 dark:text-white">Profile Information</CardTitle>
          <CardDescription className="text-gray-600 dark:text-gray-400">
            Your personal information and preferences
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="firstName" className="text-gray-900 dark:text-white">First Name</Label>
              <Input
                id="firstName"
                value={currentUser.first_name || ''}
                className="bg-white dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600"
                readOnly
              />
            </div>
            <div>
              <Label htmlFor="lastName" className="text-gray-900 dark:text-white">Last Name</Label>
              <Input
                id="lastName"
                value={currentUser.last_name || ''}
                className="bg-white dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600"
                readOnly
              />
            </div>
          </div>
          <div>
            <Label htmlFor="email" className="text-gray-900 dark:text-white">Email</Label>
            <Input
              id="email"
              type="email"
              value={currentUser.email || ''}
              className="bg-white dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600"
              readOnly
            />
          </div>
          <div>
            <Label htmlFor="role" className="text-gray-900 dark:text-white">Role</Label>
            <Input
              id="role"
              value={currentUser.role || ''}
              className="bg-white dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600"
              readOnly
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Profile;