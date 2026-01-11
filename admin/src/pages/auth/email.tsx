import { AuthLayout } from "@/layouts";
import { Lock, Mail } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { emailSchema, type EmailType } from "@/schemas/auth";
import { ButtonWithLoader, InputWithIcon } from "@/components/ui";
import useAuth from "@/hooks/useAuth";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export default function EmailAuth() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<EmailType>({
    resolver: zodResolver(emailSchema),
  });
  const { emailAuth, isLoading, user } = useAuth();
  const navigate = useNavigate();
  useEffect(() => {
    if (user?.isAdmin) {
      toast.success("Welcome back, Admin");
      navigate("/overview");
    }
  }, [user, navigate]);

  const onSubmit = async (data: EmailType) => {
    await emailAuth(data.email, data.password);
  };

  return (
    <AuthLayout>
      <div className="bg-white p-8 md:p-10">
        <div className="text-center mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-main uppercase font-space mb-3">
            Welcome Back, Admin
          </h1>
          <p className="text-muted text-sm md:text-base">
            Enter your email to continue
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <InputWithIcon
            icon={<Mail size={18} />}
            label="Email Address *"
            type="email"
            {...register("email")}
            error={errors.email?.message}
            className="bg-secondary"
            placeholder="you@mail.com"
          />
          <InputWithIcon
            icon={<Lock size={18} />}
            label="Password *"
            type="password"
            {...register("password")}
            error={errors.password?.message}
            className="bg-secondary"
            placeholder="********"
          />

          <ButtonWithLoader
            type="submit"
            loading={isLoading}
            initialText="Continue"
            loadingText="Sending OTP..."
            className="w-full flex items-center justify-center gap-2 h-12 py-4 bg-main text-background font-space font-semibold uppercase text-sm hover:bg-main/90 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          />
        </form>

        <p className="text-center text-xs text-muted mt-6">
          By continuing, you agree to our Terms of Service and Privacy Policy
        </p>
      </div>
    </AuthLayout>
  );
}
