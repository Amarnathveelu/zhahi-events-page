// Original flat-vector "storyset style" decorative icon container.
// Not a reproduction of any licensed illustration set — built from
// scratch with blob shapes + lucide icons so it's safe to ship.
import * as Icons from "lucide-react";

export default function BlobIcon({ icon, accent = "#C9A876", size = 56 }) {
  const Icon = Icons[icon] || Icons.Sparkles;
  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full">
        <path
          d="M31.5,-40.6C41.2,-33.6,49.4,-24.1,53.5,-12.5C57.6,-0.9,57.5,12.8,51.6,23.6C45.7,34.4,34,42.3,21,47.6C8,52.9,-6.3,55.6,-19.4,52.1C-32.5,48.6,-44.4,38.9,-51.1,26.4C-57.8,13.9,-59.3,-1.4,-55.1,-14.8C-50.9,-28.2,-41,-39.7,-29.2,-46.7C-17.4,-53.7,-8.7,-56.2,1.6,-58.2C11.9,-60.2,23.8,-61.7,31.5,-40.6Z"
          transform="translate(50 50)"
          fill={accent}
          fillOpacity="0.16"
        />
      </svg>
      <div
        className="absolute inset-0 flex items-center justify-center"
        style={{ color: accent }}
      >
        <Icon size={size * 0.42} strokeWidth={1.8} />
      </div>
    </div>
  );
}
