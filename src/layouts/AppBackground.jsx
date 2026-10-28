import React from 'react';

export default function AppBackground() {
  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-canvas">
      <div
        className="absolute -left-24 -top-24 h-[420px] w-[420px] rounded-full blur-3xl"
        style={{ background: 'var(--glow-1)' }}
      />
      <div
        className="absolute -bottom-32 -right-24 h-[460px] w-[460px] rounded-full blur-3xl max-md:hidden"
        style={{ background: 'var(--glow-2)' }}
      />
    </div>
  );
}
