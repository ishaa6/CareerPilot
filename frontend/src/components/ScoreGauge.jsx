import { useEffect, useState } from "react";

const ZONES = [
    { from: 0, to: 40, color: "#ecd9d3" },
    { from: 40, to: 70, color: "#f3dfb9" },
    { from: 70, to: 100, color: "#d8e9de" }
];

const toAngle = (value) => 180 - (Math.min(100, Math.max(0, value)) / 100) * 180;

function polarToCartesian(cx, cy, r, angleDeg) {
    const rad = (angleDeg * Math.PI) / 180;
    return {
        x: cx + r * Math.cos(rad),
        y: cy - r * Math.sin(rad)
    };
}

function arcPath(cx, cy, r, startAngle, endAngle) {
    const start = polarToCartesian(cx, cy, r, startAngle);
    const end = polarToCartesian(cx, cy, r, endAngle);
    return `M ${start.x} ${start.y} A ${r} ${r} 0 0 1 ${end.x} ${end.y}`;
}

function ScoreGauge({ score }) {
    const size = 200;
    const cx = size / 2;
    const radius = 78;
    const cy = radius + 6;
    const svgHeight = cy + 12;
    const targetAngle = toAngle(score);
    const [angle, setAngle] = useState(180);
    const [reduceMotion] = useState(
        () =>
            typeof window !== "undefined" &&
            window.matchMedia?.("(prefers-reduced-motion: reduce)").matches
    );

    useEffect(() => {
        const id = requestAnimationFrame(() => setAngle(targetAngle));
        return () => cancelAnimationFrame(id);
    }, [targetAngle, reduceMotion]);

    return (
        <div className="gauge-wrap">
            <div className="gauge" style={{ width: size, height: svgHeight }}>
                <svg width={size} height={svgHeight} viewBox={`0 0 ${size} ${svgHeight}`}>
                    {ZONES.map((zone) => (
                        <path
                            key={zone.from}
                            d={arcPath(cx, cy, radius, toAngle(zone.from), toAngle(zone.to))}
                            fill="none"
                            stroke={zone.color}
                            strokeWidth="13"
                            strokeLinecap="round"
                        />
                    ))}
                    <g
                        style={{
                            transform: `rotate(${-angle}deg)`,
                            transformOrigin: `${cx}px ${cy}px`,
                            transition: reduceMotion
                                ? "none"
                                : "transform 1000ms cubic-bezier(0.22, 1, 0.36, 1)"
                        }}
                    >
                        <line
                            x1={cx}
                            y1={cy}
                            x2={cx + radius - 18}
                            y2={cy}
                            stroke="#14181f"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                        />
                    </g>
                    <circle cx={cx} cy={cy} r="4.5" fill="#14181f" />
                </svg>
            </div>

            <div className="gauge-zone-labels" style={{ maxWidth: radius * 2 }}>
                <span>Low</span>
                <span>Strong</span>
            </div>

            <div className="gauge-readout">
                <span>
                    <span className="gauge-value">{Math.round(score)}</span>
                    <span className="gauge-value-suffix">%</span>
                </span>
                <span className="gauge-caption">match score</span>
            </div>
        </div>
    );
}

export default ScoreGauge;
