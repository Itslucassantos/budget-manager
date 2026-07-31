import type {
  FieldValues,
  Path,
  RegisterOptions,
  UseFormRegister,
} from "react-hook-form";

interface InputProps<T extends FieldValues> {
  type: string;
  placeholder: string;
  name: Path<T>;
  register: UseFormRegister<T>;
  error?: string;
  rules?: RegisterOptions<T, Path<T>>;
}

export function Input<T extends FieldValues>({
  name,
  placeholder,
  type,
  register,
  rules,
  error,
}: InputProps<T>) {
  return (
    <div>
      <input
        className="w-full min-w-0 bg-zinc-800 border border-slate-700 rounded-lg px-2 py-2 text-sm text-slate-100 hover:bg-zinc-700 duration-200"
        type={type}
        placeholder={placeholder}
        {...register(name, rules)}
        id={name}
      />
      {error && <p className="my-1 text-red-500">{error}</p>}
    </div>
  );
}
