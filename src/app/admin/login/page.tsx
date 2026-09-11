"use client";

import { useEffect, useState } from "react";
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
  /*
   * Avant hydratation, le formulaire n'a pas encore son gestionnaire
   * JavaScript : validé à ce moment-là, le navigateur l'envoyait lui-même en
   * GET — mot de passe DANS L'URL, donc dans l'historique et les journaux du
   * serveur. Sur un téléphone en connexion lente, la fenêtre est large.
   * Double parade : bouton inactif tant que la page n'est pas prête (la
   * validation par Entrée est alors bloquée elle aussi), et `method="post"`
   * pour qu'un envoi natif, s'il survenait, garde le secret dans le corps.
   */
  const [pret, setPret] = useState(false);
  // eslint-disable-next-line react-hooks/set-state-in-effect -- marqueur d'hydratation
  useEffect(() => setPret(true), []);
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
        // Message unique quelle que soit la cause réelle (compte inexistant,
        // mot de passe faux, limite de tentatives atteinte) : ne rien révéler
        // à quelqu'un qui sonde le formulaire.
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
    <div className="admin-scope flex min-h-screen items-center justify-center bg-[var(--bg-secondary)] p-4">
      <div className="w-full max-w-[400px]">
        <div className="rounded-xl border border-[var(--border)] bg-[var(--bg-elevated)] p-6 shadow-[var(--shadow-lg)] sm:p-8">
          <div className="mb-7 text-center">
            <span className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-accent2 text-white">
              <Lock className="h-6 w-6" />
            </span>
            <h1 className="text-xl font-semibold text-[var(--text-primary)]">
              Administration
            </h1>
            <p className="mt-1 text-sm text-[var(--text-secondary)]">
              Connectez-vous pour gérer votre portfolio
            </p>
          </div>

          <form
            method="post"
            action="/admin/login"
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-4"
            noValidate
          >
            <Input
              label="Email"
              type="email"
              autoComplete="username"
              placeholder="vous@exemple.com"
              error={errors.email?.message}
              {...register("email")}
            />
            <Input
              label="Mot de passe"
              type="password"
              autoComplete="current-password"
              placeholder="••••••••"
              error={errors.password?.message}
              {...register("password")}
            />
            <Button
              type="submit"
              variant="primary"
              size="lg"
              loading={loading}
              disabled={!pret}
              className="w-full"
            >
              <LogIn className="h-4 w-4" /> Se connecter
            </Button>
          </form>
        </div>

        <p className="mt-5 text-center text-xs text-[var(--text-muted)]">
          Accès réservé
        </p>
      </div>
    </div>
  );
}
