import React from "react";
import CreatePostModal from "./CreatePostModal";
import Image from "next/image";

interface NewPostFormProps {
  onSubmit: (content: string, image: string | null) => void;
}

const NewPostForm: React.FC<NewPostFormProps> = ({ onSubmit }) => {
    const handleSubmit = (content: string, image: string | null) => {
        onSubmit(content, image); // Ikkala argumentni to‘g‘ri yuborish
    };

    return (
        <div className="glass-card p-2  md:w-2/3 sm:w-1/3 mx-auto mt-4 animate-scale-in">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Image
                        width={40}
                        height={40}
                        src="https://source.unsplash.com/100x100/?portrait" 
                        alt="Your profile" 
                        className="w-12 h-12 rounded-full object-cover"
                    />
                    <p className="text-gray-500">What's happening?</p>
                </div>
                <CreatePostModal onSubmit={handleSubmit} />
            </div>
        </div>
    );
};

export default NewPostForm;
