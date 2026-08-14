import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "../../components/input";
import { NavLink, useNavigate } from "react-router-dom";
import { FaGoogle, FaWallet } from "react-icons/fa6";
import { useContext, useState } from "react";
import { AuthContext } from "../../contexts/AuthContext";
import toast from "react-hot-toast";
import bcrypt from "bcryptjs";

const schema = z.object({
  email: z
    .string()
    .email({ message: "Invalid email address" })
    .min(1, { message: "Email is required" }),
  password: z.string().min(1, { message: "Password is required" }),
});

type FormData = z.infer<typeof schema>;

export function Login() {
  const navigate = useNavigate();
  const { setUser } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(data: FormData) {
    if (!data.email || !data.password) return;

    setLoading(true);
    try {
      const storedUserRaw = localStorage.getItem("user");
      if (!storedUserRaw) {
        toast.error("User not found");
        return;
      }

      const storedUser = JSON.parse(storedUserRaw);

      if (storedUser.email !== data.email) {
        toast.error("Invalid email or password");
        return;
      }

      const isPasswordValid = await bcrypt.compare(
        data.password,
        storedUser.password,
      );

      if (!isPasswordValid) {
        toast.error("Invalid email or password");
        return;
      }

      setUser({
        uid: storedUser.uid,
        name: storedUser.name,
        email: storedUser.email,
      });

      reset();
      navigate("/dashboard");
    } catch {
      toast.error("Error during login");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <div className="flex flex-col mb-4">
        <h1 className="text-2xl font-bold text-blue-400 mb-1 flex items-center gap-2">
          <FaWallet width={13} height={13} />
          Budget Manager
        </h1>
        <p className="text-sm font-medium text-slate-400">
          Access your financial dashboard
        </p>
      </div>

      <div className="flex flex-col gap-4 bg-zinc-900 rounded-lg p-4 sm:p-6 md:w-full md:max-w-lg">
        <button className="flex items-center justify-center font-medium bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-400 duration-200">
          <FaGoogle className="mr-2" width={13} height={13} />
          Continue with Google
        </button>

        <div className="text-center text-sm text-slate-100 font-medium">Or</div>

        <form
          className="flex flex-col gap-2 px-4 pb-4 sm:px-6 mt-2"
          onSubmit={handleSubmit(onSubmit)}
        >
          <div>
            <label
              htmlFor="email"
              className="text-sm text-slate-100 font-medium"
            >
              Email
            </label>

            <Input
              type="email"
              placeholder="Ex: email@example.com"
              name="email"
              register={register}
              rules={{ required: "Email is required" }}
              error={errors.email?.message}
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="text-sm text-slate-100 font-medium"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              placeholder="********"
              {...register("password")}
              className="w-full min-w-0 bg-zinc-800 border border-slate-700 rounded-lg px-2 py-2 text-sm text-slate-100 hover:bg-zinc-700 duration-200"
            />
            {errors.password && (
              <p className="my-1 text-red-500">{errors.password.message}</p>
            )}
          </div>

          <button
            type="submit"
            className="mt-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 duration-200 disabled:opacity-50"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>

          <p className="text-sm text-slate-400">
            Don't have an account?{" "}
            <NavLink to="/register" className="text-blue-500 hover:underline">
              Register
            </NavLink>
          </p>
        </form>
      </div>
    </div>
  );
}
