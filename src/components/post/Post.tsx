import React, { useState } from 'react';
import { Heart, MessageCircle, Share2, Repeat2 } from "lucide-react";
import Image from 'next/image';

export interface PostProps {
  id: number;
  username: string;
  fullName: string;
  profilePicture: string;
  content: string;
  image?: string;
  timestamp: string;
  likes: number;
  comments: number;
  reposts: number;
}

const Post: React.FC<PostProps> = ({
  username,
  fullName,
  profilePicture,
  content,
  image,
  timestamp,
  likes: initialLikes,
  comments,
  reposts
}) => {
  const [liked, setLiked] = useState(false);
  const [likes, setLikes] = useState(initialLikes);
  
  const toggleLike = () => {
    if (liked) {
      setLikes(likes - 1);
    } else {
      setLikes(likes + 1);
    }
    setLiked(!liked);
  };

  return (
    <div className="post-card animate-slide-up">
      <div className="flex gap-4">
        <div className="flex-shrink-0">
          <Image 
            src={profilePicture} 
            alt={`${username}'s profile`}
            width={48}
            height={48}
            className="w-12 h-12 rounded-full object-cover"
          />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-bold">{fullName}</h3>
            <span className="text-gray text-sm">@{username}</span>
            <span className="text-gray text-sm">·</span>
            <span className="text-gray text-sm">{timestamp}</span>
          </div>
          <p className="mb-4">{content}</p>
          
          {image && (
            <div className="mb-4 rounded-xl overflow-hidden">
              <img 
                src={image} 
                alt="Post content" 
                className="w-full h-auto object-cover rounded-xl shadow-sm transition-all duration-300 hover:shadow-md"
              />
            </div>
          )}
          
          <div className="flex justify-between text-gray">
            <button 
              className="flex items-center gap-1 group"
              onClick={toggleLike}
            >
              <Heart 
                className={`h-5 w-5 group-hover:text-red transition-colors ${liked ? 'text-red fill-red' : ''}`} 
              />
              <span>{likes}</span>
            </button>
            
            <button className="flex items-center gap-1 group">
              <MessageCircle className="h-5 w-5 group-hover:text-blue transition-colors" />
              <span>{comments}</span>
            </button>
            
            <button className="flex items-center gap-1 group">
              <Repeat2 className="h-5 w-5 group-hover:text-green transition-colors" />
              <span>{reposts}</span>
            </button>
            
            <button className="flex items-center gap-1 group">
              <Share2 className="h-5 w-5 group-hover:text-blue transition-colors" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Post;
