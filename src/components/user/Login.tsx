import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import Link from "next/link"
import { useState } from "react"
import authService ,{LoginPayload} from "@/actions/user.action"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {FaGoogle , FaGithub} from "react-icons/fa"
import { signIn } from "next-auth/react"
import { toast } from "sonner"


export default function LoginForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {

  const [login, setLogin] = useState<LoginPayload>({
    email: "",
    password: ""
  })



  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await authService.login(login)
      console.log(response)
      if (response.token) {
        await authService.setToken(response.token);
      }
      toast.success(response.message, { style: { backgroundColor: "green" } })
       window.location.reload()
    } catch (error) {
      toast.error(error?.message, { style: { backgroundColor: "red" } })
      console.log(error)
    }
  }

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
          <form onSubmit={handleLogin}>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={login.email}
                  onChange={(e) => setLogin({ ...login, email: e.target.value })}
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
                <Input id="password" 
                value={login.password}
                onChange={(e) => setLogin({ ...login, password: e.target.value })}
                type="password" required />
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
              <Link href="/register" className="underline underline-offset-4">
                Sign up
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

