// Pastels de la palette Opale : la couleur est stable pour une même personne.
const PASTELS = [
  "#cfe9ff",
  "#ddd6ff",
  "#fbd5ec",
  "#d5f5e3",
  "#ffe7c7",
  "#e5e5ea",
];

function colorFor(text) {
  let hash = 0;
  for (const char of text) hash = (hash * 31 + char.charCodeAt(0)) | 0;
  return PASTELS[Math.abs(hash) % PASTELS.length];
}

/** Avatar à initiales. */
export default function Avatar({ firstName = "", lastName = "", size = 32 }) {
  const initials =
    `${firstName[0] ?? ""}${lastName[0] ?? ""}`.toUpperCase() || "?";
  return (
    <span
      className="avatar"
      style={{
        "--avatar-size": `${size}px`,
        "--avatar-bg": colorFor(firstName + lastName),
      }}
      aria-hidden="true"
    >
      {initials}
    </span>
  );
}
