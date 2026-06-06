interface Props {
  className?: string;
}

export function Spinner({ className = "w-8 h-8" }: Props) {
  return (
    <div
      className={`${className} border-2 border-[#E8D9C8] border-t-[#FF5500] rounded-full animate-spin`}
    />
  );
}
