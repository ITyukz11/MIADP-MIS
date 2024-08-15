import React from 'react';

interface CustomizedContentProps {
    root: any;
    depth: number;
    x: number;
    y: number;
    width: number;
    height: number;
    index: number;
    payload: any;
    colors: string[];
    rank: number;
    name: string;
}

const CustomizedContent: React.FC<CustomizedContentProps> = ({
    root,
    depth,
    x,
    y,
    width,
    height,
    index,
    colors,
    name
}) => {
    return (
        <g>
            <rect
                x={x}
                y={y}
                width={width}
                height={height}
                style={{
                    fill: depth < 2 ? colors[Math.floor((index / root.children.length) * colors.length)] : '#ffffff00',
                    stroke: '#fff',
                    strokeWidth: 2 / (depth + 1e-10),
                    strokeOpacity: 1 / (depth + 1e-10),
                }}
            />
            {depth === 1 ? (
                <text x={x + width / 2} y={y + height / 2 + 7} textAnchor="middle" fill="#fff" fontSize={14}>
                    {name}
                </text>
            ) : null}
            {depth === 1 ? (
                <text x={x + 4} y={y + 18} fill="#fff" fontSize={16} fillOpacity={0.9}>
                    {index + 1}
                </text>
            ) : null}
        </g>
    );
};

export default CustomizedContent;
