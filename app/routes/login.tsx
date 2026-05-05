import { Link, useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Bird } from "lucide-react";
import { useLogin } from "~/queries/auth";

const schema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(1, "Required"),
});
type LoginForm = z.infer<typeof schema>;

export function meta() {
  return [{ title: "Login — yellowbirds" }];
}

export default function LoginPage() {
  const navigate = useNavigate();
  const { mutate: login, isPending, error } = useLogin();

  const { register, handleSubmit, setValue, formState: { errors } } = useForm<LoginForm>({
    resolver: zodResolver(schema),
  });

  function onSubmit(data: LoginForm) {
    login(data, {
      onSuccess: (res) => {
        if ((res as { user: { role: string } }).user.role === "ADMIN") {
          navigate("/admin");
        } else {
          navigate("/merchandise");
        }
      },
    });
  }

  function fillDemo(email: string, password: string) {
    setValue("email", email);
    setValue("password", password);
  }

  return (
    <div className="min-h-[calc(100vh-160px)] flex items-center justify-center px-4 bg-gray-50">
      <div className="w-full max-w-md">
        {/* Card */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-200 p-8">
          {/* Logo */}
          <div className="flex justify-center mb-6">
            <Link to="/" className="flex items-center gap-2">
              <div className="h-10 w-10 rounded-xl bg-yellow-400 flex items-center justify-center">
                <Bird className="h-6 w-6 text-black" />
              </div>
              <span className="font-extrabold text-xl text-gray-900">yellowbirds</span>
            </Link>
          </div>

          <h1 className="text-2xl font-extrabold text-gray-900 text-center mb-1">Welcome back</h1>
          <p className="text-sm text-gray-500 text-center mb-7">Sign in to your account</p>

          {/* Test credentials box */}
          <div className="mb-6 rounded-2xl bg-yellow-50 border border-yellow-200 p-4">
            <p className="text-xs font-bold text-yellow-800 mb-2 uppercase tracking-wide">Test Accounts</p>
            <div className="space-y-2">
              <button
                type="button"
                onClick={() => fillDemo("admin@yellowbirds.com", "Admin123!")}
                className="w-full text-left bg-white rounded-xl border border-yellow-200 px-3 py-2 hover:border-yellow-400 hover:bg-yellow-50 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold text-gray-900">Admin Account</p>
                    <p className="text-[11px] text-gray-500">admin@yellowbirds.com · Admin123!</p>
                  </div>
                  <span className="text-[10px] font-bold bg-yellow-400 text-black px-2 py-0.5 rounded-full">Click to fill</span>
                </div>
              </button>
              <button
                type="button"
                onClick={() => fillDemo("buyer@yellowbirds.com", "Buyer123!")}
                className="w-full text-left bg-white rounded-xl border border-yellow-200 px-3 py-2 hover:border-yellow-400 hover:bg-yellow-50 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold text-gray-900">Buyer Account</p>
                    <p className="text-[11px] text-gray-500">buyer@yellowbirds.com · Buyer123!</p>
                  </div>
                  <span className="text-[10px] font-bold bg-gray-200 text-gray-700 px-2 py-0.5 rounded-full">Click to fill</span>
                </div>
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Email</label>
              <input
                {...register("email")}
                type="email"
                autoComplete="email"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:bg-white transition-all"
                placeholder="you@example.com"
              />
              {errors.email && <p className="text-xs text-red-500 mt-1.5">{errors.email.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Password</label>
              <input
                {...register("password")}
                type="password"
                autoComplete="current-password"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:bg-white transition-all"
                placeholder="••••••••"
              />
              {errors.password && <p className="text-xs text-red-500 mt-1.5">{errors.password.message}</p>}
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-700">
                {(error as { message: string }).message}
              </div>
            )}

            <button
              type="submit"
              disabled={isPending}
              className="w-full py-3.5 rounded-xl bg-yellow-400 hover:bg-yellow-300 text-black font-bold text-sm transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isPending ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-6">
            Don't have an account?{" "}
            <Link to="/register" className="font-bold text-gray-900 hover:text-yellow-600 transition-colors">
              Create one
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
