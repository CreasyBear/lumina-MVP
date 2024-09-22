"use client"

import React, { useCallback, useEffect, useState } from 'react';
import { ReactFlow, Node, Edge, useNodesState, useEdgesState, addEdge, Connection, Background, ConnectionLineType, Controls, MarkerType, MiniMap, Panel } from '@xyflow/react';
import dagre from 'dagre';
import '@xyflow/react/dist/style.css';
import { AnalysisResult } from '@/services/api';

const nodeWidth = 172;
const nodeHeight = 36;

const getLayoutedElements = (nodes: Node[], edges: Edge[], direction = 'TB') => {
  const dagreGraph = new dagre.graphlib.Graph();
  dagreGraph.setDefaultEdgeLabel(() => ({}));
  dagreGraph.setGraph({ rankdir: direction });

  nodes.forEach((node) => {
    dagreGraph.setNode(node.id, { width: nodeWidth, height: nodeHeight });
  });

  edges.forEach((edge) => {
    dagreGraph.setEdge(edge.source, edge.target);
  });

  dagre.layout(dagreGraph);

  const layoutedNodes = nodes.map((node) => {
    const nodeWithPosition = dagreGraph.node(node.id);
    return {
      ...node,
      position: {
        x: nodeWithPosition.x - nodeWidth / 2,
        y: nodeWithPosition.y - nodeHeight / 2,
      },
    };
  });

  return { nodes: layoutedNodes, edges };
};

const getNodeStyle = (status: string) => {
  switch (status) {
    case 'in_progress':
      return { background: '#22c55e', color: 'white' };
    case 'completed':
      return { background: '#6366f1', color: 'white' };
    case 'error':
      return { background: '#ef4444', color: 'white' };
    default:
      return { background: '#f97316', color: 'white' };
  }
};

interface ProblemSegmentVisualizationProps {
  segments: AnalysisResult;
}

const ProblemSegmentVisualization: React.FC<ProblemSegmentVisualizationProps> = React.memo(({ segments }) => {
  const initialNodes: Node[] = [
    {
      id: 'root',
      type: 'input',
      data: { label: 'Problem Root', status: 'not_started', progress: 0 },
      position: { x: 0, y: 0 },
      style: { background: '#ef4444', color: 'white' }
    },
  ];

  const initialEdges: Edge[] = [];

  segments.steps.forEach((step, index) => {
    const stepId = `step-${index}`;
    initialNodes.push({
      id: stepId,
      data: { label: `Step ${index + 1}: ${step.query}`, status: 'not_started', progress: 0 },
      position: { x: 0, y: 0 },
    });
    initialEdges.push({
      id: `edge-root-${index}`,
      source: 'root',
      target: stepId,
      animated: true,
      label: 'Analyzes',
      markerEnd: { type: MarkerType.ArrowClosed },
    });

    if (step.structured_output && Array.isArray(step.structured_output.key_findings)) {
      step.structured_output.key_findings.forEach((finding: string, findingIndex: number) => {
        const findingId = `finding-${index}-${findingIndex}`;
        initialNodes.push({
          id: findingId,
          data: { label: finding, status: 'not_started', progress: 0 },
          position: { x: 0, y: 0 },
        });
        initialEdges.push({
          id: `edge-step-${index}-finding-${findingIndex}`,
          source: stepId,
          target: findingId,
          animated: true,
          label: 'Finds',
          markerEnd: { type: MarkerType.ArrowClosed },
        });
      });
    }
  });

  const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(initialNodes, initialEdges);

  const [nodes, setNodes, onNodesChange] = useNodesState(layoutedNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(layoutedEdges);

  const [taskProgress, setTaskProgress] = useState(0);

  const onConnect = useCallback((params: Connection) => setEdges((eds) => addEdge(params, eds)), [setEdges]);

  const addSubStep = useCallback(() => {
    const newId = `substep-${nodes.length}`;
    const newNode: Node = {
      id: newId,
      data: { label: `Sub-Step ${nodes.length}`, status: 'not_started', progress: 0 },
      position: { x: 0, y: 0 },
    };
    const newEdge: Edge = {
      id: `e-root-${newId}`,
      source: 'root',
      target: newId,
      animated: true,
      label: 'Delegates',
      markerEnd: { type: MarkerType.ArrowClosed },
    };
    setNodes((nds) => [...nds, newNode]);
    setEdges((eds) => [...eds, newEdge]);
  }, [nodes.length, setNodes, setEdges]);

  const updateNodeProgress = useCallback((id: string, progress: number) => {
    setNodes((nds) =>
      nds.map((node) => {
        if (node.id === id) {
          let status = 'in_progress';
          if (progress >= 100) status = 'completed';
          else if (progress < 0) status = 'error';
          return {
            ...node,
            data: { ...node.data, progress, status },
            style: getNodeStyle(status),
          };
        }
        return node;
      })
    );
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setTaskProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          return 100;
        }
        return prev + 10;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    updateNodeProgress('root', taskProgress);

    nodes.forEach((node) => {
      if (node.id !== 'root') {
        const progress = Math.min(taskProgress + Math.random() * 20 - 10, 100);
        updateNodeProgress(node.id, progress);
      }
    });

    if (taskProgress === 50) {
      addSubStep();
    }

    const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(nodes, edges);
    setNodes(layoutedNodes);
    setEdges(layoutedEdges);
  }, [taskProgress, nodes, edges, updateNodeProgress, addSubStep, setNodes, setEdges]);

  return (
    <div style={{ width: '100%', height: '600px' }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        connectionLineType={ConnectionLineType.SmoothStep}
        fitView
      >
        <Controls />
        <MiniMap />
        <Background color="#aaa" gap={16} />
        <Panel position="top-left">
          <h3>Problem Segment Visualization</h3>
          <div>Overall Task Progress: {taskProgress}%</div>
        </Panel>
        <Panel position="top-right">
          <button onClick={addSubStep}>Add Sub-Step</button>
        </Panel>
      </ReactFlow>
    </div>
  );
});

export default ProblemSegmentVisualization;