import React, { useState, useEffect } from 'react';
import Node from './Node';
import Edge from './Edge';

interface NodeData {
    id: string;
    x: number;
    y: number;
}

interface EdgeData {
    source: NodeData;
    target: NodeData;
    directed: boolean;
    bend: number;
}

interface GraphProps {
    numNodes: number;
    showMatrix: boolean;
    sourceNode: string;
    targetNode: string;
    isDirected: boolean;
}

const Graph: React.FC<GraphProps> = ({
                                         numNodes,
                                         showMatrix,
                                         sourceNode,
                                         targetNode,
                                         isDirected
                                     }) => {
    const [nodes, setNodes] = useState<NodeData[]>([]);
    const [edges, setEdges] = useState<EdgeData[]>([]);
    const [draggedNode, setDraggedNode] = useState<NodeData | null>(null);

    useEffect(() => {
        const newNodes: NodeData[] = [];
        for (let i = 0; i < numNodes; i++) {
            newNodes.push({
                id: `v${i + 1}`,
                x: Math.random() * 600 + 100,
                y: Math.random() * 400 + 100,
            });
        }
        setNodes(newNodes);
        setEdges([]);
    }, [numNodes]);

    useEffect(() => {
        if (sourceNode && targetNode) {
            const source = nodes.find(node => node.id === sourceNode);
            const target = nodes.find(node => node.id === targetNode);
            if (source && target) {
                const existingEdge = edges.find(
                    edge =>
                        edge.source.id === sourceNode &&
                        edge.target.id === targetNode &&
                        edge.directed === isDirected
                );
                if (!existingEdge) {
                    const newEdge: EdgeData = {
                        source: source,
                        target: target,
                        directed: isDirected,
                        bend: 0,
                    };
                    setEdges(prevEdges => [...prevEdges, newEdge]);
                }
            }
        }
    }, [sourceNode, targetNode, isDirected, nodes]);

    const toggleEdgeDirection = (index: number) => {
        const updatedEdges = edges.map((edge, i) =>
            i === index ? { ...edge, directed: !edge.directed } : edge
        );
        setEdges(updatedEdges);
    };

    const bendEdge = (index: number, bend: number) => {
        const updatedEdges = edges.map((edge, i) =>
            i === index ? { ...edge, bend } : edge
        );
        setEdges(updatedEdges);
    };

    const handleNodeDrag = (id: string, x: number, y: number) => {
        setNodes(nodes.map(node => (node.id === id ? { ...node, x, y } : node)));
    };

    const handleNodeMouseDown = (id: string) => {
        const node = nodes.find(node => node.id === id);
        if (node) {
            setDraggedNode(node);
        }
    };

    const handleMouseMove = (event: React.MouseEvent<SVGSVGElement>) => {
        if (draggedNode) {
            const svgRect = event.currentTarget.getBoundingClientRect();
            const x = event.clientX - svgRect.left;
            const y = event.clientY - svgRect.top;
            handleNodeDrag(draggedNode.id, x, y);
        }
    };

    const handleMouseUp = () => {
        setDraggedNode(null);
    };

    useEffect(() => {
        window.addEventListener('mouseup', handleMouseUp);
        return () => {
            window.removeEventListener('mouseup', handleMouseUp);
        };
    }, []);

    const adjacencyMatrix = nodes.map(node => nodes.map(() => 0));
    const degrees = nodes.map(node => 0);
    edges.forEach(edge => {
        const sourceIndex = nodes.indexOf(edge.source);
        const targetIndex = nodes.indexOf(edge.target);
        adjacencyMatrix[sourceIndex][targetIndex] = 1;
        if (sourceIndex === targetIndex) {
            degrees[sourceIndex] += 2; // Loop adds two degrees
        } else {
            degrees[sourceIndex] += 1;
            degrees[targetIndex] += 1;
        }
    });

    const isGraphDirected = edges.some(edge => edge.directed);

    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div id="graph-container" style={{ border: '1px solid #ccc', width: '800px', height: '600px' }}>
                <svg width="100%" height="100%" onMouseMove={handleMouseMove}>
                    <defs>
                        <marker
                            id="arrowhead"
                            viewBox="0 -5 10 10"
                            refX={12}
                            refY={0}
                            orient="auto"
                            markerWidth={6}
                            markerHeight={6}
                        >
                            <path d="M 0,-5 L 10,0 L 0,5" fill="#999" />
                        </marker>
                    </defs>
                    {edges.map((edge, index) => (
                        <Edge
                            key={index}
                            index={index}
                            sourceX={edge.source.x}
                            sourceY={edge.source.y}
                            targetX={edge.target.x}
                            targetY={edge.target.y}
                            directed={edge.directed}
                            bend={edge.bend}
                            onToggleDirection={() => toggleEdgeDirection(index)}
                            onBend={(bend) => bendEdge(index, bend)}
                        />
                    ))}
                    {nodes.map(node => (
                        <Node
                            key={node.id}
                            id={node.id}
                            cx={node.x}
                            cy={node.y}
                            onMouseDown={() => handleNodeMouseDown(node.id)}
                            onDrag={handleNodeDrag}
                            degree={degrees[nodes.indexOf(node)]}
                        />
                    ))}
                </svg>
            </div>
            {showMatrix && (
                <div>
                    <h3>{isGraphDirected ? 'Орієнтований граф' : 'Неорієнтований граф'}</h3>
                    <table>
                        <thead>
                        <tr>
                            <th></th>
                            {nodes.map((node, index) => (
                                <th key={index}>{node.id}</th>
                            ))}
                        </tr>
                        </thead>
                        <tbody>
                        {adjacencyMatrix.map((row, rowIndex) => (
                            <tr key={rowIndex}>
                                <th>{nodes[rowIndex].id}</th>
                                {row.map((cell, cellIndex) => (
                                    <td key={cellIndex}>{cell}</td>
                                ))}
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default Graph;











