import React from 'react';
import { ThumbsUp } from 'lucide-react';

interface VotingButtonProps {
  votes: number;
  hasVoted: boolean;
  onToggle: (e: React.MouseEvent) => void;
  size?: 'sm' | 'md';
}

export const VotingButton: React.FC<VotingButtonProps> = ({
  votes,
  hasVoted,
  onToggle,
  size = 'md'
}) => {
  const isSm = size === 'sm';

  return (
    <button
      type="button"
      onClick={onToggle}
      title={hasVoted ? 'Quitar mi voto' : 'Votar esta idea (+1)'}
      className={`inline-flex items-center gap-1.5 font-semibold rounded-lg transition-all duration-150 cursor-pointer select-none active:scale-95 ${
        isSm ? 'px-2 py-1 text-xs' : 'px-3 py-1.5 text-sm'
      } ${
        hasVoted
          ? 'bg-blue-600 text-white shadow-xs shadow-blue-200 hover:bg-blue-700'
          : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200/80 hover:text-slate-900'
      }`}
    >
      <ThumbsUp
        className={`${isSm ? 'w-3.5 h-3.5' : 'w-4 h-4'} ${
          hasVoted ? 'fill-current stroke-white' : 'stroke-current'
        } transition-transform ${hasVoted ? 'scale-110' : ''}`}
      />
      <span>{votes}</span>
    </button>
  );
};
