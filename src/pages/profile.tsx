import React from "react";
import MenuSection from "@/components/menu/menu";
import ProfileComponent from "@/components/profile/Profile";

export default function Profile() {
    return (
        <div>

        <ProfileComponent />
                 <div className="fixed bottom-5 sm:bottom-6">
                <MenuSection  />
                </div>
        </div>
    );
}