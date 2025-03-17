import React, { useState, useEffect } from 'react';
import ProfileHeader from '@/components/profile/ProfileHeader';
import Post, { PostProps } from '@/components/post/Post';

const initialProfile = {
  username: 'johndoe',
  fullName: 'John Doe',
  profilePicture: 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?q=80&w=2070&auto=format&fit=crop',
  bio: 'Designer, Developer, and Creator.'
};

const initialPosts: PostProps[] = [
  {
    id: 1,
    username: 'johndoe',
    fullName: 'John Doe',
    profilePicture: initialProfile.profilePicture,
    content: 'Just launched my new portfolio website! Check it out and let me know what you think. #webdesign #portfolio',
    image: 'https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?q=80&w=2069&auto=format&fit=crop',
    timestamp: '2h ago',
    likes: 42,
    comments: 7,
    reposts: 3,
  },
  {
    id: 2,
    username: 'johndoe',
    fullName: 'John Doe',
    profilePicture: initialProfile.profilePicture,
    content: "Excited to share that I'll be speaking at the upcoming Design Conference in San Francisco next month! Who else is attending? #design #conference",
    timestamp: '1d ago',
    likes: 128,
    comments: 24,
    reposts: 18,
  },
  {
    id: 3,
    username: 'johndoe',
    fullName: 'John Doe',
    profilePicture: initialProfile.profilePicture,
    content: 'Beautiful morning hike in the mountains. Nature always inspires my best design work.',
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=2070&auto=format&fit=crop',
    timestamp: '3d ago',
    likes: 217,
    comments: 32,
    reposts: 12,
  },
];

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
  const [posts, setPosts] = useState<PostProps[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setPosts(initialPosts);
      setLoading(false);
    }, 1000);
  }, []);

  return (
    <div className="min-h-screen mx-auto ">
      <div className="container mx-auto max-w-3xl px-4 py-12">
      <ProfileHeader 
  initialUsername={initialProfile.username}
  initialFullName={initialProfile.fullName}
  initialProfilePicture={initialProfile.profilePicture}
  initialBio={initialProfile.bio}
/>

        <div className="mb-4">
          <h2 className="text-xl font-bold mb-4 animate-fade-in">Posts</h2>
        </div>

        <div className="space-y-4 pb-20">
          {loading ? <SkeletonLoader /> : posts.map((post) => <Post key={post.id} {...post} />)}
        </div>
      </div>
    </div>
  );
};

export default ProfileComponent;
