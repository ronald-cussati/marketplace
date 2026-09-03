import { ImageResponse } from "next/og";

// Metadados da rota de ícone (favicon dinâmico do Next.js App Router)
export const size = {
  width: 32,
  height: 32,
};
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #16a34a 0%, #166534 100%)",
          borderRadius: "8px",
        }}
      >
        {/* Folha estilizada (mesmo espírito do ícone Sprout usado na Navbar) */}
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#ffffff"
          strokeWidth="2.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M7 20h10" />
          <path d="M10 20c0-4.4 2-8 6-10.5C13 8.5 10 12 10 20Z" />
          <path d="M9.5 9.4c-1.4-.9-2.5-2.4-3-4.4C9 5 12 6 13.5 9c-1.6 0-3 .1-4 .4Z" />
        </svg>
      </div>
    ),
    { ...size }
  );
}
