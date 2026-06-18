"use client";

import { useState } from "react";
import { Mail, Lock, Loader2, Zap } from "lucide-react";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";

function SubmitButton({ isLogin, loading }: { isLogin: boolean; loading: boolean }) {
  return (
    <Button
      type="submit"
      disabled={loading}
      className="w-full bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700 text-white rounded-lg h-10 font-medium transition-all shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/45 cursor-pointer"
    >
      {loading ? (
        <Loader2 className="w-4 h-4 animate-spin mr-2" />
      ) : isLogin ? (
        "Sign In"
      ) : (
        "Create Account"
      )}
    </Button>
  );
}

import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    const supabase = createClient();

    if (isLogin) {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        setError(error.message);
        setLoading(false);
      } else {
        router.push("/");
        router.refresh();
      }
    } else {
      const { error } = await supabase.auth.signUp({ email, password });
      if (error) {
        setError(error.message);
        setLoading(false);
      } else {
        router.push("/");
        router.refresh();
      }
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center items-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background Gradients */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] rounded-full bg-cyan-500/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-[350px] h-[350px] rounded-full bg-purple-500/10 blur-[120px] pointer-events-none" />

      <div className="w-full max-w-md space-y-6 z-10">
        {/* Logo */}
        <div className="flex flex-col items-center">
          <Link href="/" className="flex items-center gap-2.5 group mb-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500 to-purple-600 shadow-lg shadow-cyan-500/25 group-hover:shadow-cyan-500/40 transition-shadow">
              <Zap className="h-5 w-5 text-white" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
              Drafted
            </span>
          </Link>
        </div>

        {/* Card */}
        <Card className="border-white/10 bg-slate-900/50 backdrop-blur-xl shadow-2xl">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center text-white">
              {isLogin ? "Welcome back" : "Create an account"}
            </CardTitle>
            <CardDescription className="text-center text-slate-400">
              {isLogin ? "Enter your credentials to access your dashboard" : "Get started with your free Drafted account"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm p-3 rounded-lg text-center font-medium animate-pulse">
                  {error}
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="email" className="text-slate-300">
                  Email Address
                </Label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-4 w-4 text-slate-500" />
                  </div>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    className="pl-9 h-10 bg-slate-950/50 border-white/10 text-white placeholder:text-slate-600 focus-visible:ring-cyan-500/30 focus-visible:border-cyan-500"
                    placeholder="user@gmail.com"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-slate-300">
                  Password
                </Label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-4 w-4 text-slate-500" />
                  </div>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete={isLogin ? "current-password" : "new-password"}
                    required
                    className="pl-9 h-10 bg-slate-950/50 border-white/10 text-white placeholder:text-slate-600 focus-visible:ring-cyan-500/30 focus-visible:border-cyan-500"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <SubmitButton isLogin={isLogin} loading={loading} />
            </form>
          </CardContent>
          <CardFooter className="flex justify-center border-t border-white/5 pt-4">
            <p className="text-sm text-slate-400">
              {isLogin ? "Don't have an account? " : "Already have an account? "}
              <button
                onClick={() => {
                  setIsLogin(!isLogin);
                  setError(null);
                }}
                className="font-medium text-cyan-400 hover:text-cyan-300 transition-colors cursor-pointer"
              >
                {isLogin ? "Sign up" : "Sign in"}
              </button>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
