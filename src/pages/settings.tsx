"use client";
import { useState } from "react";
import { useTheme } from "next-themes";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Settings as SettingsIcon,
  Moon,
  Sun,
  KeyRound,
  Globe,
  Monitor,
  BookOpen,
  Zap,
  MoonStar,
  SunDim
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import MenuSection from "@/components/menu/menu";

const Settings = () => {
  const { theme, setTheme } = useTheme();
  const [language, setLanguage] = useState("english");

  const passwordSchema = z
    .object({
      currentPassword: z.string().min(1, "Current password is required"),
      newPassword: z.string().min(8, "Password must be at least 8 characters"),
      confirmPassword: z.string().min(8, "Password must be at least 8 characters"),
    })
    .refine((data) => data.newPassword === data.confirmPassword, {
      message: "Passwords don't match",
      path: ["confirmPassword"],
    });
    

  const form = useForm({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const onSubmit = (values) => {
    console.log(values);
  };

  return (
    <div className="min-h-screen flex flex-col p-4">
      <div className="mb-8 flex items-center">
        <h1 className="text-2xl ml-12 font-bold flex items-center">
          <SettingsIcon className="mr-2 h-6 w-6" /> Settings
        </h1>
      </div>

      <div className="glass-card text-black p-6 flex-grow dark:bg-gray-900 dark:text-white">
        <Tabs defaultValue="appearance" className="flex flex-col md:flex-row gap-6">
          <TabsList className="md:flex-col h-auto justify-start mb-4 md:mb-0 md:mr-8 md:h-auto md:w-48 p-2">
            <TabsTrigger value="appearance" className="w-full text-black dark:text-white justify-start gap-2 mb-1">
              <Moon className="h-4 w-4 text-black dark:text-white" /> <span>Appearance</span>
            </TabsTrigger>
            <TabsTrigger value="password" className="w-full text-black dark:text-white justify-start gap-2 mb-1">
              <KeyRound className="h-4 w-4" /> <span>Password</span>
            </TabsTrigger>
            <TabsTrigger value="language" className="w-full  text-black dark:text-white justify-start gap-2">
              <Globe className="h-4 w-4" /> <span>Language</span>
            </TabsTrigger>
          </TabsList>

          <div className="flex-grow">
            {/* Appearance Section */}
            <TabsContent value="appearance">
              <h2 className="text-xl text-black dark:text-white font-semibold">Appearance</h2>
              <p>Choose how the application looks to you</p>
              <div>
                <Label className="text-black dark:text-white">Mode</Label>
                <ToggleGroup
                  type="single"
                  value={theme}
                  onValueChange={(value) => value && setTheme(value)}
                  className="mt-2 justify-start"
                >
                  <ToggleGroupItem className="text-black dark:text-white" value="light">
                    <Sun className="h-4  w-4 mr-2" /> Light
                  </ToggleGroupItem>
                  <ToggleGroupItem className="text-black dark:text-white" value="dark">
                    <Moon className="h-4 w-4 mr-2" /> Dark
                  </ToggleGroupItem>
                  <ToggleGroupItem className="text-black dark:text-white" value="system">
                    <Monitor className="h-4 w-4 mr-2" /> System
                  </ToggleGroupItem>
                  <ToggleGroupItem className="text-black dark:text-white" value="sepia">
                    <BookOpen className="h-4 w-4 mr-2" /> Sepia
                  </ToggleGroupItem>
                  <ToggleGroupItem className="text-black dark:text-white" value="neon">
                    <Zap color="#39ff14" className="h-4 w-4 mr-2" /> Neon
                  </ToggleGroupItem>
                </ToggleGroup>
              </div>
            </TabsContent>

            {/* Password Section */}
            <TabsContent value="password">
              <h2 className="text-xl text-black dark:text-white font-semibold">Password</h2>
              <p className="text-black dark:text-white">Update your password</p>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="currentPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-black dark:text-white">Current Password</FormLabel>
                        <FormControl>
                          <Input className="text-black dark:text-white" type="password" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="newPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-black dark:text-white">New Password</FormLabel>
                        <FormControl>
                          <Input className="text-black dark:text-white" type="password" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-black dark:text-white">Confirm New Password</FormLabel>
                        <FormControl>
                          <Input className="text-black dark:text-white" type="password" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" className="bg-blue dark:bg-slate-600 text-white">
                    Update Password
                  </Button>
                </form>
              </Form>
            </TabsContent>

            {/* Language Section */}
            <TabsContent value="language">
              <h2 className="text-xl text-black dark:text-white font-semibold">Language</h2>
           
              <div className="mt-4 space-y-2">
                <Label className="text-black dark:text-white">Choose Language</Label>
                <ToggleGroup
                  type="single"
                  value={language}
                  onValueChange={(value) => value && setLanguage(value)}
                  className="mt-2 text-black dark:text-white justify-start"
                >
                  <ToggleGroupItem value="english">
                    🇬🇧 English
                  </ToggleGroupItem>
                  <ToggleGroupItem value="russian">
                    🇷🇺 Russian
                  </ToggleGroupItem>
                  <ToggleGroupItem value="uzbek">
                    🇺🇿 Uzbek
                  </ToggleGroupItem>
                </ToggleGroup>
              </div>
            </TabsContent>
          </div>
        </Tabs>
      </div>

      <div className="fixed sm:left-1/3 bottom-5 sm:bottom-6">
        <MenuSection />
      </div>
    </div>
  );
};

export default Settings;