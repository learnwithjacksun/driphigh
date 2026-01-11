import { useNavigate } from "react-router-dom";
import { AuthLayout } from "@/layouts";
import { ArrowLeft } from "lucide-react";
import { ButtonWithLoader, InputWithoutIcon } from "@/components/ui";
import { type KYCType, kycSchema } from "@/schemas/auth";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import useAuth from "@/hooks/useAuth";

export default function KYC() {
  const navigate = useNavigate();
  const { kyc, isLoading } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<KYCType>({
    resolver: zodResolver(kycSchema),
  });
  
  const onSubmit = async (data: KYCType) => {
    await kyc(data);
  };

  return (
    <AuthLayout>
      <div className="bg-white p-8 md:p-10">

        <div className="text-center mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-main uppercase font-space mb-3">
            Complete Your Profile
          </h1>
          <p className="text-muted text-sm md:text-base">
            Please provide your information to continue
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputWithoutIcon
              label="First Name *"
              type="text"
              {...register("firstName")}
              error={errors.firstName?.message}
              className="bg-secondary"
            />

            <InputWithoutIcon
              label="Last Name *"
              type="text"
              {...register("lastName")}
              error={errors.lastName?.message}
              className="bg-secondary"
            />
            <InputWithoutIcon
              label="Phone Number *"
              type="tel"
              {...register("phone")}
              error={errors.phone?.message}
              className="bg-secondary"
            />
            <InputWithoutIcon
              label="Country *"
              type="text"
              {...register("address.country")}
              error={errors.address?.country?.message}
              className="bg-secondary"
            />
          </div>

          <div>
            <InputWithoutIcon
              label="Street Address *"
              type="text"
              {...register("address.street")}
              error={errors.address?.street?.message}
              className="bg-secondary"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputWithoutIcon
              label="City *"
              type="text"
              {...register("address.city")}
              error={errors.address?.city?.message}
              className="bg-secondary"
            />
            <InputWithoutIcon
              label="State *"
              type="text"
              {...register("address.state")}
              error={errors.address?.state?.message}
              className="bg-secondary"
            />
          </div>

          <ButtonWithLoader
            type="submit"
            loading={isLoading}
            initialText="Complete Registration"
            loadingText="Completing Profile..."
            className="w-full flex items-center justify-center gap-2 h-12 py-4 bg-main text-background font-space font-semibold uppercase text-sm hover:bg-main/90 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          />
        </form>
        <button
          onClick={() => navigate("/auth/verify-otp")}
          className="h-12 w-full btn font-space border border-line mt-4 text-muted hover:text-main hover:bg-line transition-all duration-300"
        >
          <ArrowLeft size={18} />
          <span>Back</span>
        </button>
      </div>
    </AuthLayout>
  );
}
