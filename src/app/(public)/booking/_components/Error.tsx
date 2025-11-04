export function Error({ error }: { error: string | null }) {
  if (!error) return null;
  return (
    <div className="flex flex-col items-center border-3 rounded-lg border-red-500 p-4">
      <p className="text-red-500 font-bold text-2xl">Der opstod en fejl</p>
      <p className="text-red-500 text-xl">{error}</p>
    </div>
  );
}
