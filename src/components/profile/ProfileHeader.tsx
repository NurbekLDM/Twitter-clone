import React, { useState, useRef } from 'react';
import Image from 'next/image';
import { Button } from "@/components/ui/button";
import { Camera, Check, Pencil, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ProfileHeaderProps {
  initialUsername: string;
  initialFullName: string;
  initialProfilePicture: string;
  initialBio: string; // Bio uchun yangi prop
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  initialUsername,
  initialFullName,
  initialProfilePicture,
  initialBio = '' // Default qiymat bo'sh string
}) => {
  const [profileData, setProfileData] = useState({
    username: initialUsername,
    fullName: initialFullName,
    profilePicture: initialProfilePicture,
    bio: initialBio, // Bio maydoni uchun state
    editingField: null as 'username' | 'fullName' | 'bio' | null // Bio tahrirlash uchun qo'shimcha
  });

  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleProfilePictureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setProfileData((prev) => ({ ...prev, profilePicture: reader.result as string }));
        toast({ title: "Profile picture updated", description: "Your profile picture has been successfully updated." });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEditClick = (field: 'username' | 'fullName' | 'bio') => {
    setProfileData((prev) => ({ ...prev, editingField: field }));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { value } = e.target;
    setProfileData((prev) => ({ ...prev, [prev.editingField as string]: value }));
  };

  const handleSave = () => {
    const fieldName = profileData.editingField === 'username' ? 'Username' : 
                      profileData.editingField === 'fullName' ? 'Full name' : 'Bio';
    
    toast({
      title: `${fieldName} updated`,
      description: `Your ${profileData.editingField} has been successfully updated.`,
    });
    setProfileData((prev) => ({ ...prev, editingField: null }));
  };

  const handleCancel = () => {
    setProfileData((prev) => ({ ...prev, editingField: null }));
  };

  return (
    <div className="glass-card p-8 mb-8 animate-scale-in">
      <div className="flex flex-col md:flex-row items-center gap-6">
        {/* Profile Picture Section */}
        <div className="relative w-32 h-32 md:w-40 md:h-40 group">
          <Image 
            src={profileData.profilePicture} 
            alt="Profile" 
            width={160}
            height={160}
            className="w-full h-full object-cover rounded-full"
          />
          <div 
            className="absolute inset-0 rounded-full flex items-center justify-center bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
            onClick={() => fileInputRef.current?.click()}
          >
            <Camera className="w-8  h-8 text-white" />
          </div>
          <input 
            type="file" 
            ref={fileInputRef} 
            className="hidden" 
            accept="image/*" 
            onChange={handleProfilePictureChange} 
          />
        </div>

        {/* Profile Information Section */}
        <div className="flex-1 space-y-4 text-center md:text-left">
          {/* Full Name Field */}
          <div className="flex items-center gap-2 justify-center md:justify-start">
            {profileData.editingField === 'fullName' ? (
              <>
                <input
                  type="text"
                  value={profileData.fullName}
                  onChange={handleInputChange}
                  className="text-2xl md:text-3xl font-bold border-b-2 border-blue focus:outline-none bg-transparent"
                  autoFocus
                />
                <Button size="icon" variant="ghost" onClick={handleSave} className="h-8 w-8" aria-label="Save full name">
                  <Check className="h-4 w-4" />
                </Button>
                <Button size="icon" variant="ghost" onClick={handleCancel} className="h-8 w-8" aria-label="Cancel full name edit">
                  <X className="h-4 w-4" />
                </Button>
              </>
            ) : (
              <>
                <h1 className="text-2xl md:text-3xl font-bold">{profileData.fullName}</h1>
                <Button size="icon" variant="ghost" onClick={() => handleEditClick('fullName')} className="h-8 w-8" aria-label="Edit full name">
                  <Pencil className="h-4 w-4" />
                </Button>
              </>
            )}
          </div>

          {/* Username Field */}
          <div className="flex items-center gap-2 justify-center md:justify-start">
            {profileData.editingField === 'username' ? (
              <>
                <span className="text-gray">@</span>
                <input
                  type="text"
                  value={profileData.username}
                  onChange={handleInputChange}
                  className="text-lg text-gray border-b-2 border-blue focus:outline-none bg-transparent"
                  autoFocus
                />
                <Button size="icon" variant="ghost" onClick={handleSave} className="h-7 w-7" aria-label="Save username">
                  <Check className="h-3 w-3" />
                </Button>
                <Button size="icon" variant="ghost" onClick={handleCancel} className="h-7 w-7" aria-label="Cancel username edit">
                  <X className="h-3 w-3" />
                </Button>
              </>
            ) : (
              <>
                <p className="text-lg text-gray">@{profileData.username}</p>
                <Button size="icon" variant="ghost" onClick={() => handleEditClick('username')} className="h-7 w-7" aria-label="Edit username">
                  <Pencil className="h-3 w-3" />
                </Button>
              </>
            )}
          </div>

          {/* Bio Field - Yangi qo'shilgan */}
          <div className="w-full">
            {profileData.editingField === 'bio' ? (
              <div className="flex flex-col gap-2 items-center md:items-start">
                <textarea
                  value={profileData.bio}
                  onChange={handleInputChange}
                  placeholder="Write something about yourself..."
                  className="w-full p-2 text-sm border rounded focus:outline-none bg-transparent resize-none min-h-20"
                  autoFocus
                />
                <div className="flex gap-2 justify-center md:justify-start">
                  <Button size="sm" variant="outline" onClick={handleSave} className="h-8" aria-label="Save bio">
                    <Check className="h-4 w-4 mr-1" /> Save
                  </Button>
                  <Button size="sm" variant="ghost" onClick={handleCancel} className="h-8" aria-label="Cancel bio edit">
                    <X className="h-4 w-4 mr-1" /> Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col gap-1 items-center md:items-start">
                {profileData.bio ? (
                  <p className="text-sm max-w-md">{profileData.bio}</p>
                ) : (
                  <p className="text-sm text-gray italic">No bio added yet.</p>
                )}
                <Button variant="ghost" onClick={() => handleEditClick('bio')} size="sm" className="h-7" aria-label="Edit bio">
                  <Pencil className="h-3 w-3 mr-1" /> {profileData.bio ? 'Edit' : 'Add'} bio
                </Button>
              </div>
            )}
          </div>

          {/* Followers and Following Section */}
          <div className="flex gap-4 justify-center md:justify-start">
            <div>
              <span className="font-bold">246</span> <span className="text-gray">Following</span>
            </div>
            <div>
              <span className="font-bold">1.2K</span> <span className="text-gray">Followers</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;