import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import authService, { RegisterPayload } from "@/actions/user.action";
import Link from "next/link";
import { toast } from "sonner";

export default function RegisterForm({
    className,
    ...props
}: React.ComponentPropsWithoutRef<"div">) {
    const [register, setRegister] = useState < RegisterPayload > ({
        email: "",
        password: "",
        username: "",
        full_name: "",
    });

    const handleRegister = async (e: React.FormEvent)=>{
        e.preventDefault();
        try {
            const response = await authService.register(register);
            console.log(response.message);
            toast.success(response.message, { style: { backgroundColor: "green" } });
        } catch (error) {
            toast.error(error?.message , { style: { backgroundColor: "red" } });
            console.log(error);
        }
    }

    return (
        <div
            className={cn(
                "flex w-10/12 mx-auto mt-16 sm:mt-6 sm:w-1/2 flex-col gap-6",
                className
            )}
            {...props}
        >
            <Card>
                <CardHeader>
                    <CardTitle className="text-2xl">Sign Up</CardTitle>
                    <CardDescription>Enter your email below to Sign up</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleRegister}>
                        <div className="flex flex-col gap-6">
                            <div className="grid gap-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    value={register.email}
                                    onChange={(e) =>
                                        setRegister({ ...register, email: e.target.value })
                                      }
                                    placeholder="m@example.com"
                                    required
                                />
                            </div>

                            <div className="grid gap-2">
                                <div className="flex items-center">
                                    <Label htmlFor="password">Password</Label>
                                </div>
                                <Input id="password" type="password"
                                value={register.password}
                                onChange={(e) =>
                                    setRegister({ ...register, password: e.target.value })
                                }
                                required />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="username">Username</Label>
                                <Input
                                    id="username"
                                    type="text"
                                    value={register.username}
                                    onChange={(e) =>    setRegister({ ...register, username: e.target.value })
                                    }
                                    placeholder="Enter your  username"
                                    required
                                ></Input>
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="full_name">Full Name</Label>
                                <Input
                                    id="full_name"
                                    value={register.full_name}
                                    onChange={(e) =>
                                        setRegister({ ...register, full_name: e.target.value })
                                    }
                                    type="text"
                                    placeholder="Enter your Full Name"
                                    required
                                ></Input>
                            </div>
                            <Button
                            type="submit" className="w-full bg-blue">
                                Register
                            </Button>
                        </div>
                        <div className="mt-4 text-center text-sm">
                            Already have a account?{" "}
                            <Link href="/home" className="underline underline-offset-4">
                                Login
                            </Link>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
