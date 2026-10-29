import React from 'react';

export default function VelascoLogo({ className = "h-10", iconOnly = false, lightText = false }) {
  return (
    <div className={`flex items-center gap-3.5 select-none ${className}`}>
      {/* Recreated exact SVG of the 4 green brackets isotype */}
      <svg
        viewBox="50 40 475 460"
        className="w-10 h-10 shrink-0 drop-shadow-sm transition-transform duration-300 hover:scale-105"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Top-Left: Dark Green institutional (#046A28) */}
        <path
          d="M 282 251 L 85 251 L 85 204 L 225 204 L 225 73 L 282 73 Z"
          fill="#046A28"
          className="transition-colors duration-300"
        />
        {/* Top-Right: Vibrant Emerald (#00AC46) */}
        <path
          d="M 301 251 L 301 92 L 358 92 L 358 204 L 445 204 L 445 251 Z"
          fill="#00AC46"
          className="transition-colors duration-300"
        />
        {/* Bottom-Left: Vibrant Emerald (#00AC46) */}
        <path
          d="M 282 270 L 139 270 L 139 317 L 225 317 L 225 433 L 282 433 Z"
          fill="#00AC46"
          className="transition-colors duration-300"
        />
        {/* Bottom-Right: Dark Green institutional (#046A28) */}
        <path
          d="M 301 270 L 491 270 L 491 317 L 358 317 L 358 475 L 301 475 Z"
          fill="#046A28"
          className="transition-colors duration-300"
        />
      </svg>

      {!iconOnly && (
        <div className="flex flex-col min-w-0">
          <div className="flex items-center gap-1.5">
            <span
              className={`font-display font-black text-lg sm:text-2xl tracking-tight leading-none truncate ${
                lightText ? 'text-white' : 'text-clinic-dark'
              }`}
            >
              CLÍNICA VELASCO
            </span>
          </div>
          <span
            className={`text-[9px] sm:text-[11px] font-bold tracking-wider uppercase mt-1 leading-none truncate ${
              lightText ? 'text-emerald-300/90' : 'text-slate-500'
            }`}
          >
            Atención Médica de Alta Complejidad
          </span>
        </div>
      )}
    </div>
  );
}
