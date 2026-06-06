interface Props {
  bordered?: boolean;
}

export function SkeletonCard({ bordered = false }: Props) {
  return (
    <div
      className={`bg-[#FDF8F3] animate-pulse ${
        bordered ? "border border-[#E8D9C8] rounded-2xl overflow-hidden" : ""
      }`}
    >
      <div className="flex items-center gap-3 px-4 py-3">
        <div className="w-9 h-9 rounded-full bg-[#EDE3D8]" />
        <div className="space-y-1.5">
          <div className="w-24 h-3 rounded-full bg-[#EDE3D8]" />
          <div className="w-14 h-2.5 rounded-full bg-[#EDE3D8]" />
        </div>
      </div>
      <div className="w-full aspect-square bg-[#EDE3D8]" />
      <div className="px-4 py-3 space-y-2">
        <div className="w-16 h-3 rounded-full bg-[#EDE3D8]" />
        <div className="w-48 h-3 rounded-full bg-[#EDE3D8]" />
      </div>
      {!bordered && <div className="h-px bg-[#E8D9C8]" />}
    </div>
  );
}
