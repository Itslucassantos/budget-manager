import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "../../components/input";
import { NavLink } from "react-router-dom";
import { FaWallet } from "react-icons/fa6";
import { useContext, useState } from "react";
import { AuthContext } from "../../contexts/AuthContext";
import toast from "react-hot-toast";
import { v4 as uuidv4 } from "uuid";
import bcrypt from "bcryptjs";

const schema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  email: z
    .string()
    .email({ message: "Invalid email address" })
    .min(1, { message: "Email is required" }),
  password: z.string().min(1, { message: "Password is required" }),
});

type FormData = z.infer<typeof schema>;

export function Register() {
  const [loading, setLoading] = useState(false);
  const { setUser } = useContext(AuthContext);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  async function onSubmit(data: FormData) {
    if (!data.name || !data.email || !data.password) {
      return;
    }

    try {
      const uid = uuidv4();

      const hashedPassword = await bcrypt.hash(data.password, 10);

      setUser({
        uid: uid,
        name: data.name,
        email: data.email,
      });
      setLoading(true);

      localStorage.setItem(
        "user",
        JSON.stringify({
          uid: uid,
          name: data.name,
          email: data.email,
          password: hashedPassword,
        }),
      );

      reset();
      toast.success("User registered successfully");
    } catch (error) {
      console.log(error);

      toast.error("Error registering user");
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
        <form
          className="flex flex-col gap-2 px-4 pb-4 sm:px-6 mt-2"
          onSubmit={handleSubmit(onSubmit)}
        >
          <div>
            <label
              htmlFor="name"
              className="text-sm text-slate-100 font-medium"
            >
              Name
            </label>

            <Input
              type="text"
              placeholder="Ex: Lucas Santos"
              name="name"
              register={register}
              rules={{ required: "Name is required" }}
              error={errors.name?.message}
            />
          </div>

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
            {loading ? "Registering..." : "Register"}
          </button>

          <p className="text-sm text-slate-400">
            Already have an account?{" "}
            <NavLink to="/" className="text-blue-500 hover:underline">
              Login
            </NavLink>
          </p>
        </form>
      </div>
    </div>
  );
}
