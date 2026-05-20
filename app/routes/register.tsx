import { Link, useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Bird } from "lucide-react";
import { useRegister } from "~/queries/auth";

const schema = z
  .object({
    firstName: z.string().min(1, "Required").regex(/^[a-zA-Z]+$/, "Letters only"),
    lastName: z.string().min(1, "Required"),
    email: z.string().email("Invalid email"),
    password: z.string().min(8, "Minimum 8 characters"),
    confirmPassword: z.string().min(1, "Required"),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type RegisterForm = z.infer<typeof schema>;

export function meta() {
  return [{ title: "Create Account — yellowbirds" }];
}

export default function RegisterPage() {
  const navigate = useNavigate();
  const { mutate: register_, isPending, error } = useRegister();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterForm>({ resolver: zodResolver(schema) });

  function onSubmit(data: RegisterForm) {
    register_(data, { onSuccess: () => navigate("/merchandise") });
  }

  const fields: { id: keyof RegisterForm; label: string; type: string; placeholder: string }[] = [
    { id: "firstName", label: "First Name", type: "text", placeholder: "Alex" },
    { id: "lastName", label: "Last Name", type: "text", placeholder: "Johnson" },
    { id: "email", label: "Email", type: "email", placeholder: "you@example.com" },
    { id: "password", label: "Password", type: "password", placeholder: "••••••••" },
    { id: "confirmPassword", label: "Confirm Password", type: "password", placeholder: "••••••••" },
  ];

  return (
    <div className="min-h-[calc(100vh-160px)] flex items-center justify-center px-4 bg-gray-50">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-3xl shadow-sm border border-gray-200 p-8">
          <div className="flex justify-center mb-6">
            <Link to="/" className="flex items-center gap-2">
              <div className="h-10 w-10 rounded-xl bg-yellow-400 flex items-center justify-center">
                <Bird className="h-6 w-6 text-black" />
              </div>
              <span className="font-extrabold text-xl text-gray-900">yellowbirds</span>
            </Link>
          </div>

          <h1 className="text-2xl font-extrabold text-gray-900 text-center mb-1">Create an account</h1>
          <p className="text-sm text-gray-500 text-center mb-7">Start ordering custom merch today</p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {fields.map(({ id, label, type, placeholder }) => (
              <div key={id}>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">{label}</label>
                <input
                  {...register(id)}
                  type={type}
                  placeholder={placeholder}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:bg-white transition-all"
                />
                {errors[id] && (
                  <p className="text-xs text-red-500 mt-1.5">{errors[id]?.message}</p>
                )}
              </div>
            ))}

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-700">
                {(error as { message: string }).message}
              </div>
            )}

            <button
              type="submit"
              disabled={isPending}
              className="w-full py-3.5 rounded-xl bg-yellow-400 hover:bg-yellow-300 text-black font-bold text-sm transition-colors disabled:opacity-60"
            >
              {isPending ? "Creating account..." : "Create Account"}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-6">
            Already have an account?{" "}
            <Link to="/login" className="font-bold text-gray-900 hover:text-yellow-600 transition-colors">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
