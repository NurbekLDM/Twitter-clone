"use client";
import React, { useState } from "react";
import ProfileHeader from "@/components/profile/ProfileHeader";
import Post from "@/components/profile/Post";

// Skeleton Loader Component
const SkeletonLoader = () => (
  <div className="flex justify-center items-center py-12">
    <div className="animate-pulse flex flex-col items-center">
      <div className="h-4 w-24 bg-gray-300 rounded mb-4"></div>
      <div className="h-24 w-full bg-gray-300 rounded"></div>
    </div>
  </div>
);

const ProfileComponent = () => {
  const [loading, setLoading] = useState(true);

  setTimeout(() => {
    setLoading(false);
  }, 3000);

  return (
    <div className="min-h-screen mx-auto ">
      <div className="container mx-auto max-w-3xl px-4 py-12">
        <ProfileHeader />

        <div className="mb-4">
          <h2 className="text-xl font-bold mb-4 animate-fade-in">Posts</h2>
        </div>

        <div className="space-y-4 pb-20">
          {loading ? <SkeletonLoader /> : <Post />}
        </div>
      </div>
    </div>
  );
};

export default ProfileComponent;
