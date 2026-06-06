import { RefObject } from "react";
import { ImageIcon } from "@shared/ui/icons";

interface Props {
  preview:  string | null;
  fileRef:  RefObject<HTMLInputElement | null>;
  onClear:  () => void;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function ImagePicker({ preview, fileRef, onClear, onChange }: Props) {
  return (
    <div className="w-full">
      {preview ? (
        <div className="aspect-square w-full rounded-3xl overflow-hidden bg-[#EDE3D8] relative">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={preview} alt="preview" className="w-full h-full object-cover" />
          <button
            type="button"
            onClick={onClear}
            className="absolute top-3 right-3 bg-black/40 text-white rounded-full w-8 h-8 flex items-center justify-center text-xs hover:bg-black/60 transition-colors"
          >
            ✕
          </button>
        </div>
      ) : (
        <div
          onClick={() => fileRef.current?.click()}
          className="aspect-square w-full rounded-3xl bg-[#FDF8F3] border-2 border-dashed border-[#E8D9C8] flex flex-col items-center justify-center gap-4 cursor-pointer hover:border-[#FF5500]/40 transition-colors"
        >
          <div className="w-16 h-16 rounded-2xl bg-[#F5EDE0] flex items-center justify-center">
            <ImageIcon size={28} />
          </div>
          <div className="text-center px-4">
            <p className="font-semibold text-[#1A1208] text-sm">Tap to choose a photo</p>
            <p className="text-xs text-[#C4B5A5] mt-1">JPG, PNG, WEBP</p>
          </div>
        </div>
      )}

      <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={onChange} />
    </div>
  );
}
