"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Lock, LogIn } from "lucide-react";
import toast from "react-hot-toast";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { loginSchema, type LoginFormData } from "@/lib/validations";

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({ resolver: zodResolver(loginSchema) });

  const onSubmit = async (data: LoginFormData) => {
    setLoading(true);
    try {
      const res = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
      });
      if (res?.error) {
        toast.error("Identifiants incorrects");
      } else {
        toast.success("Connexion réussie");
        router.push("/admin/dashboard");
        router.refresh();
      }
    } catch {
      toast.error("Une erreur est survenue");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="gradient-mesh flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl">
        <div className="mb-8 text-center">
          <span className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-accent text-white shadow-[var(--shadow-sky)]">
            <Lock className="h-7 w-7" />
          </span>
          <h1 className="font-display text-2xl font-bold text-white">Espace Administration</h1>
          <p className="mt-1 text-sm text-slate-300">Connectez-vous pour gérer votre portfolio</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
          <Input
            label="Email"
            type="email"
            placeholder="admin@portfolio.com"
            error={errors.email?.message}
            className="bg-white/10 text-white placeholder:text-slate-400"
            {...register("email")}
          />
          <Input
            label="Mot de passe"
            type="password"
            placeholder="••••••••"
            error={errors.password?.message}
            className="bg-white/10 text-white placeholder:text-slate-400"
            {...register("password")}
          />
          <Button type="submit" variant="gradient" size="lg" loading={loading} className="w-full">
            <LogIn className="h-4 w-4" /> Se connecter
          </Button>
        </form>

        <p className="mt-6 text-center text-xs text-slate-400">
          Identifiants par défaut : admin@portfolio.com / admin123
        </p>
      </div>
    </div>
  );
}
