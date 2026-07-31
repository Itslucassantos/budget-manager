interface CardProps {
  title: string;
  price?: string;
  buyNumber?: number;
  icon: React.ReactNode;
  description: string;
}

export function Card({
  title,
  price,
  buyNumber,
  icon,
  description,
}: CardProps) {
  return (
    <div className="flex flex-col bg-zinc-900 rounded-lg p-4 border border-slate-700">
      <div className="flex justify-between items-center">
        <div className="text-slate-400 text-base">{title}</div>

        <div>{icon}</div>
      </div>
      {price ? (
        <div className="text-slate-100 text-xl font-bold">{price}</div>
      ) : (
        <div className="text-slate-100 text-xl font-bold">{buyNumber}</div>
      )}
      <div className="text-slate-400 text-sm">{description}</div>
    </div>
  );
}
