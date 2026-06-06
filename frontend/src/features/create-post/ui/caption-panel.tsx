interface Props {
  caption:   string;
  onChange:  (v: string) => void;
  uploading: boolean;
  canSubmit: boolean;
}

export function CaptionPanel({ caption, onChange, uploading, canSubmit }: Props) {
  return (
    <div className="flex flex-col gap-4 h-full">
      <div className="bg-[#FDF8F3] rounded-3xl border border-[#E8D9C8] p-4 flex flex-col flex-1 min-h-[220px]">
        <textarea
          value={caption}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Write a caption..."
          className="w-full flex-1 bg-transparent text-sm text-[#1A1208] placeholder-[#C4B5A5] outline-none resize-none"
        />
        <div className="flex items-center justify-between pt-2 border-t border-[#E8D9C8] mt-2">
          <span className="text-xs text-[#C4B5A5]">{caption.length} chars</span>
        </div>
      </div>

      <button
        type="submit"
        disabled={!canSubmit}
        className="w-full py-3.5 rounded-2xl bg-[#FF5500] text-white font-bold text-sm disabled:opacity-40 transition-opacity flex items-center justify-center gap-2 shadow-md shadow-[#FF5500]/25"
      >
        {uploading ? (
          <>
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            Uploading...
          </>
        ) : (
          "Share Post"
        )}
      </button>
    </div>
  );
}
