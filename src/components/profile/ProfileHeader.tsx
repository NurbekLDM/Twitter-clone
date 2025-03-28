"use client";
import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Camera, Check, MoveLeftIcon, Pencil, X } from "lucide-react";
import { toast } from "sonner";
import authService from "@/actions/user.action";

interface UpdateProfilePayload {
    full_name: string;
    username: string;
    bio: string;
    profile_picture?: string | File;
}

const ProfileHeader = () => {
    const [userData, setUserData] = useState({
        id: "",
        username: "",
        full_name: "",
        profile_picture: "https://i.pravatar.cc/150?img=68",
        bio: "",
        followers: 0,
        following: 0,
    });

    const [formData, setFormData] = useState<{
        id: string;
        username: string;
        full_name: string;
        profile_picture: string | File;
        bio: string;
        followers: number;
        following: number;
    }>({
        id: "",
        username: "",
        full_name: "",
        profile_picture: "https://i.pravatar.cc/150?img=68",
        bio: "",
        followers: 0,
        following: 0,
    });

    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [previewUrl, setPreviewUrl] = useState(userData.profile_picture);

    useEffect(() => {
        let isMounted = true;

        const fetchUserData = async () => {
            try {
                setLoading(true);
                const data = await authService.getUser();

                if (!isMounted) return;

                if (data?.user) {
                    const user = data.user;
                    const [followingResponse, followersResponse] = await Promise.all([
                        authService.getFollowingCount(),
                        authService.getFollowersCount(),
                    ]);

                    const completeUserData = {
                        ...user,
                        following: followingResponse?.followingCount || 0,
                        followers: followersResponse?.followersCount || 0,
                        profile_picture: user.profile_picture || "https://i.pravatar.cc/150?img=68",
                    };

                    setUserData(completeUserData);
                    setFormData(completeUserData);
                    setPreviewUrl(completeUserData.profile_picture);
                }
            } catch (error) {
                console.log("Error fetching user data:", error);
                toast("Error fetching user data", { style: { backgroundColor: "red" } });
            } finally {
                if (isMounted) setLoading(false);
            }
        };
        fetchUserData();

        return () => {
            isMounted = false;
        };
    }, []);

    const handleLogout = async () => {
        try {
            await authService.logout();
            window.location.href = "/home";
        } catch (error) {
            console.error("Error logging out:", error);
            toast("Error logging out", { style: { backgroundColor: "red" } });
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, files } = e.target;

        if (type === "file" && files && files.length > 0) {
            const file = files[0];
            console.log("Selected file:", file);
            setPreviewUrl(URL.createObjectURL(file));
            setFormData((prev) => ({
                ...prev,
                profile_picture: file,
            }));
        } else {
            setFormData((prev) => ({
                ...prev,
                [name]: value,
            }));
        }
    };

    const handleStartEditing = () => setIsEditing(true);

    const handleCancel = () => {
        setFormData(userData);
        setPreviewUrl(userData.profile_picture);
        setIsEditing(false);
    };

    const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        try {
            const payload: UpdateProfilePayload = {
                full_name: formData.full_name,
                username: formData.username,
                bio: formData.bio,
                profile_picture: formData.profile_picture instanceof File ? formData.profile_picture : formData.profile_picture,
            };

            const response = await authService.updateProfile(payload);

            const updatedUserData = {
                ...formData,
                profile_picture: response.data?.profile_picture || (formData.profile_picture instanceof File ? URL.createObjectURL(formData.profile_picture) : formData.profile_picture as string),
                id: userData.id,
            };

            setUserData(updatedUserData);
            toast("Profile updated successfully", { style: { backgroundColor: "green" } });
            setIsEditing(false);
        } catch (err) {
            console.error("Error updating profile:", err);
            toast("Error updating profile", { style: { backgroundColor: "red" } });
        }
    };

    console.log("Form data:", formData);
    console.log("Userdata:", userData);

    if (loading) {
        return <div className="flex justify-center items-center p-8">Loading profile data...</div>;
    }

    const textFields = ["full_name", "username", "bio"] as const;

    return (
        <div className="glass-card text-black p-8 mb-8 animate-scale-in">
            <div className="flex flex-col md:flex-row items-center gap-6">
                {/* Profile Picture */}
                <div className="relative w-32 h-32 md:w-40 md:h-40 group">
                    <Image
                        src={previewUrl}
                        alt="Profile"
                        width={160}
                        height={160}
                        className="w-full h-full object-cover rounded-full"
                    />
                    {isEditing && (
                        <div
                            className="absolute inset-0 rounded-full flex items-center justify-center bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                            onClick={() => fileInputRef.current?.click()}
                        >
                            <Camera className="w-8 h-8 text-white" />
                        </div>
                    )}
                    <input
                        type="file"
                        ref={fileInputRef}
                        name="profile_picture"
                        className="hidden"
                        accept="image/*"
                        onChange={handleChange}
                    />
                </div>

                {/* Profile Information */}
                <div className="flex-1 text-center md:text-left">
                    {isEditing ? (
                        <form onSubmit={handleSave} className="space-y-4">
                            {/* Inputs */}
                            {textFields.map((field) => (
                                <div key={field} className="flex flex-col gap-1">
                                    <label className="text-sm font-semibold text-gray-700">
                                        {field.replace("_", " ")}
                                    </label>
                                    <input
                                        type="text"
                                        name={field}
                                        value={formData[field]}
                                        onChange={handleChange}
                                        className="text-lg border rounded-md p-2 text-black bg-white focus:ring-2 focus:ring-blue-400"
                                    />
                                </div>
                            ))}

                            {/* Followers & Following */}
                            <div className="flex gap-4 justify-center md:justify-start">
                                <div>
                                    <span className="font-bold text-gray-700">{userData.following}</span>{" "}
                                    <span className="text-gray-700">Following</span>
                                </div>
                                <div>
                                    <span className="font-bold text-gray-700">{userData.followers}</span>{" "}
                                    <span className="text-gray-700">Followers</span>
                                </div>
                            </div>

                            {/* Buttons */}
                            <div className="flex gap-2 justify-center md:justify-start">
                                <Button type="submit" className="bg-green-500 dark:bg-green-600 text-black">
                                    <Check className="h-4 w-4" /> Save
                                </Button>
                                <Button
                                    type="button"
                                    onClick={handleCancel}
                                    className="bg-red-500 text-black"
                                >
                                    <X className="h-4 w-4" /> Cancel
                                </Button>
                            </div>
                        </form>
                    ) : (
                        <div className="space-y-4">
                            {/* View Mode */}
                            {textFields.map((field) => (
                                <div key={field} className="flex flex-col gap-1">
                                    <label className="text-sm font-semibold text-gray-700">
                                        {field.replace("_", " ")}
                                    </label>
                                    <div className="text-lg p-2">{userData[field]}</div>
                                </div>
                            ))}

                            {/* Followers & Following */}
                            <div className="flex gap-4 justify-center md:justify-start">
                                <div>
                                    <span className="font-bold text-gray-700">{userData.following}</span>{" "}
                                    <span className="text-gray-700">Following</span>
                                </div>
                                <div>
                                    <span className="font-bold text-gray-700">{userData.followers}</span>{" "}
                                    <span className="text-gray-700">Followers</span>
                                </div>
                            </div>

                            {/* Edit Button */}
                            <Button
                                type="button"
                                onClick={handleStartEditing}
                                className="bg-blue text-black dark:text-white"
                            >
                                <Pencil className="h-4 w-4" /> Edit
                            </Button>
                        </div>
                    )}
                </div>
            </div>
            <div className="flex justify-center mt-4">
                <Button onClick={handleLogout} className="bg-red text-white">
                    <MoveLeftIcon /> Logout
                </Button>
            </div>
        </div>
    );
};

export default ProfileHeader;