'use client';

import React, { useState } from 'react';
import { useUser } from '@clerk/nextjs';
import { withAuth } from '../_components/auth/withAuth';

const ProfilePage: React.FC = () => {
  const { user } = useUser();
  const [firstName, setFirstName] = useState(user?.firstName || '');
  const [lastName, setLastName] = useState(user?.lastName || '');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await user?.update({
        firstName,
        lastName,
      });
      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile. Please try again.');
    }
  };

  if (!user) return <div>Loading...</div>;

  return (
    <div className="max-w-md mx-auto mt-10">
      <h1 className="text-2xl font-bold mb-5">User Profile</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="firstName" className="block mb-1">First Name</label>
          <input
            type="text"
            id="firstName"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            className="w-full px-3 py-2 border rounded"
          />
        </div>
        <div>
          <label htmlFor="lastName" className="block mb-1">Last Name</label>
          <input
            type="text"
            id="lastName"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            className="w-full px-3 py-2 border rounded"
          />
        </div>
        <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600">
          Update Profile
        </button>
      </form>
    </div>
  );
};

export default withAuth(ProfilePage);