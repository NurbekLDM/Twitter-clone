import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"


import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {FaGoogle , FaGithub} from "react-icons/fa"
import { signIn } from "next-auth/react"

export default function LoginForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  return (
    <div className={cn("flex w-10/12 mx-auto mt-16 sm:mt-6 sm:w-1/2 flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Login</CardTitle>
          <CardDescription>
            Enter your email below to login to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                  <a
                    href="#"
                    className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                  >
                    Forgot your password?
                  </a>
                </div>
                <Input id="password" type="password" required />
              </div>
              <Button type="submit" className="w-full bg-blue">
                Login
              </Button>
              <p className="text-center">Or</p>
              <Button
              onClick={() => signIn("google")}
               variant="outline" className="flex flex-row gap-1 w-full">
                <FaGoogle  />
                Login with Google
              </Button>
              <Button 
              onClick={() => signIn("github")}
               className="flex bg-red flex-row gap-1 w-full">
                <FaGithub />
                Login with Github
                </Button>
            </div>
            <div className="mt-4 text-center text-sm">
              Don&apos;t have an account?{" "}
              <a href="#" className="underline underline-offset-4">
                Sign up
              </a>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

