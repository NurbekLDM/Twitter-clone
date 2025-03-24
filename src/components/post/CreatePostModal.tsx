/* eslint-disable @next/next/no-img-element */
import React, { useState, useRef } from 'react';
import { 
  Dialog, 
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Image, X, Plus } from "lucide-react";
import {toast} from 'sonner';
import postsService from '@/actions/post.action';


interface CreatePostModalProps {
  onSubmit: (content: string, image: string | null) => void;
}

const CreatePostModal: React.FC<CreatePostModalProps> = () => {
  const [content, setContent] = useState('');
  const [image, setImage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);


  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast("Image size must be less than 5MB", {
          style: { backgroundColor: "red" }});
        return;
      }
      
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          setImage(e.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async () => {
    if (!content.trim()) {
        toast("Please enter some text");
        return;
    }

    setIsSubmitting(true);

    try {

        const formData = new FormData();
        formData.append("text", content);

        if (fileInputRef.current?.files?.[0]) {
            formData.append("post-image", fileInputRef.current.files[0]);
        }


        const response = await postsService.createPost(formData);

        if (response.error) {
            throw new Error(response.error);
        }

        setContent('');
        setImage(null);
        setIsSubmitting(false);

      toast(response?.message || "Create post succesfully", {
        style: { backgroundColor: "green" },
      });

    } catch (error) {
        console.error("Error creating post:", error);
         toast((error as Error)?.message || "Error creating post", {
                style: { backgroundColor: "red" },
              });
    }
};


  const reset = () => {
    setContent('');
    setImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (  
    <Dialog>
      <DialogTrigger asChild>
        <Button className="bg-blue  rounded-full px-6 hover:bg-blue/90 transition-colors">
          <Plus className="w-4 h-4 mr-2" />
          Create Post
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] p-0 overflow-hidden bg-white dark:bg-white rounded-xl">
        <DialogHeader className="p-4 border-b">
          <DialogTitle className="text-center dark:text-black">Create New Post</DialogTitle>
        </DialogHeader>
        
        <div className="p-6 space-y-4">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0">
              <img
                width={40}
                height={40}
                src="https://source.unsplash.com/100x100/?portrait" 
                alt="Your profile" 
                className="w-10 h-10 rounded-full object-cover"
              />
            </div>
            
            <Textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="What's happening?"
              className="flex-1 resize-none dark:text-black    border-none shadow-none focus-visible:ring-0 p-0 min-h-[120px] text-base"
              maxLength={280}
            />
          </div>
          
          {image && (
            <div className="relative rounded-xl overflow-hidden  border-gray">
              <img 
                src={image} 
                width={300}
                height={300}
                alt="Upload preview" 
                className="w-full h-auto max-h-[300px] object-cover rounded-xl"
              />
              <button
                type="button"
                onClick={removeImage}
                className="absolute top-2 right-2 p-1 rounded-full bg-black/70 text-white hover:bg-black/90 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>
        
        <div className="border-t p-4 flex justify-between items-center bg-gray-50">
          <div>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              ref={fileInputRef}
              onChange={handleImageUpload}
            />
            <Button 
              type="button" 
              variant="ghost" 
              size="sm" 
              onClick={() => fileInputRef.current?.click()}
              className="text-blue hover:text-blue/80 hover:bg-blue/10"
            >
              <Image
              className="w-5 h-5 mr-2" />
              Add Image
            </Button>
          </div>
          
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-500">
              {content.length}/280
            </span>
            <DialogClose asChild>
              <Button 
                variant="outline"
                onClick={reset}
                className="border-gray-200"
              >
                Cancel
              </Button>
            </DialogClose>
            <DialogClose asChild>
              <Button 
                onClick={handleSubmit}
                disabled={isSubmitting || !content.trim()} 
                className="bg-blue text-white rounded-full px-6 hover:bg-blue/90 transition-colors"
              >
                {isSubmitting ? "Posting..." : "Post"}
              </Button>
            </DialogClose>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CreatePostModal;