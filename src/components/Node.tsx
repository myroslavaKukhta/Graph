import React, { useState } from 'react';

interface NodeProps {
    id: string;
    cx: number;
    cy: number;
    onDrag: (id: string, x: number, y: number) => void;
    onMouseDown: (id: string) => void;
    degree: number;
}

const Node: React.FC<NodeProps> = ({ id, cx, cy, onDrag, onMouseDown, degree }) => {
    const [isDragging, setIsDragging] = useState(false);

    const handleMouseDown = (event: React.MouseEvent<SVGCircleElement, MouseEvent>) => {
        setIsDragging(true);
        onMouseDown(id);
    };

    const handleMouseUp = () => {
        setIsDragging(false);
    };

    const handleMouseMove = (event: React.MouseEvent<SVGCircleElement, MouseEvent>) => {
        if (isDragging) {
            const svgRect = (event.target as SVGCircleElement).ownerSVGElement!.getBoundingClientRect();
            const x = event.clientX - svgRect.left;
            const y = event.clientY - svgRect.top;
            onDrag(id, x, y);
        }
    };

    return (
        <>
            <circle
                className="node"
                r={10}
                cx={cx}
                cy={cy}
                fill="#1f77b4"
                onMouseDown={handleMouseDown}
                onMouseUp={handleMouseUp}
                onMouseMove={handleMouseMove}
            />
            <text x={cx + 15} y={cy - 15} fill="black" fontSize="12">v{id.slice(1)}</text>
            <text x={cx - 5} y={cy + 25} fill="black" fontSize="12">d: {degree}</text>
        </>
    );
};

export default Node;




