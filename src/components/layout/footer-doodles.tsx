// Padrão decorativo de rabiscos infantis ao fundo do rodapé (inspirado no portal OCAD).
// Substitua por um SVG oficial se houver um asset definitivo.
export function FooterDoodles() {
  return (
    <svg
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 h-full w-full opacity-[0.18]"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <pattern id="footer-doodles" width="220" height="220" patternUnits="userSpaceOnUse">
          <g fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            {/* sol */}
            <g stroke="#f2c94c">
              <circle cx="34" cy="38" r="10" />
              <path d="M34 18v-9M34 58v9M14 38H5M63 38h-9M20 24l-6-6M54 58l6 6M54 24l6-6M20 52l-6 6" />
            </g>
            {/* casa */}
            <g stroke="#6fcf97">
              <path d="M150 66V44l18-13 18 13v22z" />
              <path d="M162 66V54h12v12" />
            </g>
            {/* pessoa */}
            <g stroke="#56ccf2">
              <circle cx="108" cy="120" r="8" />
              <path d="M108 128v22M108 136l-13 9M108 136l13 9M108 150l-9 16M108 150l9 16" />
            </g>
            {/* coração */}
            <g stroke="#eb7ea4">
              <path d="M194 150c-5-7-16-3-16 5 0 7 16 16 16 16s16-9 16-16c0-8-11-12-16-5z" />
            </g>
            {/* nuvem */}
            <g stroke="#bb9af7">
              <path d="M40 176c-7 0-12-5-12-11 0-6 5-11 12-11 1-6 7-10 13-10 7 0 13 5 14 12 6 0 11 4 11 10 0 6-5 10-11 10z" />
            </g>
            {/* árvore */}
            <g stroke="#f2994a">
              <path d="M182 190v-16" />
              <circle cx="182" cy="160" r="14" />
            </g>
          </g>
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#footer-doodles)" />
    </svg>
  );
}
