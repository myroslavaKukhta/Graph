import React, { useState } from 'react';
import './App.css';
import Graph from './components/Graph';

const App: React.FC = () => {
    const [numNodes, setNumNodes] = useState(0);
    const [showMatrix, setShowMatrix] = useState(false);
    const [sourceNode, setSourceNode] = useState('');
    const [targetNode, setTargetNode] = useState('');
    const [isDirected, setIsDirected] = useState(false);
    const [graphName, setGraphName] = useState('Мій граф');

    const handleNumNodesChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setNumNodes(Number(event.target.value));
    };

    const handleSourceNodeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSourceNode(event.target.value);
    };

    const handleTargetNodeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setTargetNode(event.target.value);
    };

    const handleAddEdge = () => {
        if (sourceNode && targetNode) {
            setSourceNode('');
            setTargetNode('');
        }
    };

    const handleSaveGraph = () => {
        const graphData = {
            numNodes,
            edges: { sourceNode, targetNode, isDirected },
            graphName,
        };
        console.log('Graph saved:', graphData);
    };

    return (
        <div className="App">
            <header className="App-header">
                <div className="header-controls">
                    <label>
                        Назва графа:
                        <input type="text" value={graphName} onChange={(e) => setGraphName(e.target.value)} />
                    </label>
                    <label>
                        Кількість вершин:
                        <input type="number" value={numNodes} onChange={handleNumNodesChange} />
                    </label>
                    <label>
                        Початкова вершина:
                        <input type="text" value={sourceNode} onChange={handleSourceNodeChange} />
                    </label>
                    <label>
                        Кінцева вершина:
                        <input type="text" value={targetNode} onChange={handleTargetNodeChange} />
                    </label>
                    <label>
                        Спрямоване:
                        <input type="checkbox" checked={isDirected} onChange={() => setIsDirected(!isDirected)} />
                    </label>
                    <button onClick={handleAddEdge}>Додати ребро</button>
                    <button onClick={() => setShowMatrix(!showMatrix)}>
                        {showMatrix ? 'Сховати матрицю' : 'Показати матрицю'}
                    </button>
                    <button onClick={handleSaveGraph}>Зберегти граф</button>
                </div>
            </header>
            <Graph
                numNodes={numNodes}
                sourceNode={sourceNode}
                targetNode={targetNode}
                isDirected={isDirected}
                showMatrix={showMatrix}
            />
        </div>
    );
};

export default App;







