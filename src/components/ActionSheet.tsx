import { X } from 'lucide-react';

interface Action {
  label: string;
  danger?: boolean;
  onClick: () => void;
}

interface ActionSheetProps {
  title: string;
  options: Action[];
  onClose: () => void;
}

export default function ActionSheet({ title, options, onClose }: ActionSheetProps) {
  return (
    <div className="fixed inset-0 z-[60] flex flex-col justify-end" onClick={onClose}>
      <div className="absolute inset-0 bg-black/60" />
      <div
        className="relative z-10 mx-3 mb-6 rounded-[28px] bg-[#151515] p-4 shadow-[0_12px_40px_rgba(0,0,0,0.5)]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-3">
          <p className="text-lg font-semibold">{title}</p>
          <button onClick={onClose} className="w-9 h-9 rounded-full bg-[#1c1c1c] flex items-center justify-center text-[#a6a6a6]">
            <X size={18} />
          </button>
        </div>
        <div className="space-y-2">
          {options.map((opt, i) => (
            <button
              key={i}
              onClick={opt.onClick}
              className={`w-full rounded-[20px] px-4 py-3.5 text-left text-base font-medium transition-colors ${
                opt.danger ? 'bg-[#2a1a1a] text-[#FF9F9F]' : 'bg-[#1c1c1c] text-white hover:bg-[#252525]'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
