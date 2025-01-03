import React from 'react';

interface SessionFormProps {
  description: string;
  onDescriptionChange: (description: string) => void;
}

export default function SessionForm({ description, onDescriptionChange }: SessionFormProps) {
  return (
    <input
      type="text"
      value={description}
      onChange={(e) => onDescriptionChange(e.target.value)}
      placeholder="What are you working on?"
      className="w-64 bg-white/20 text-white placeholder:text-white/50 border border-white/30 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-white/50"
    />
  );
}