import NewPostForm from "@/components/post/NewPostForm";
import React from "react";
import MenuSection from "@/components/menu/menu";

export default function Create() {
    return (
        <div>
      <NewPostForm onSubmit={(content, image) => {
        console.log("Post content:", content);
         console.log("Post image:", image);
          }} />

                <div className="fixed sm:left-1/3 bottom-5 sm:bottom-6">
                  <MenuSection />
                </div>

        </div>
    )
}