import React, { useState, useCallback, useRef } from "react";
import ReactFlow, {
  ReactFlowProvider,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  Edge,
  Node,
  XYPosition,
} from "reactflow";
import "reactflow/dist/style.css";
import NodeModal from "./NodeModal";
import "./FlowCanvas.css";

// 初始节点
const initialNodes: Node[] = [
  {
    id: "start",
    type: "input",
    data: { label: "开始" },
    position: { x: 250, y: 25 },
  },
];

// 初始连线
const initialEdges: Edge[] = [];

const FlowCanvas: React.FC = () => {
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [modalVisible, setModalVisible] = useState(false);
  const [contextMenuPosition, setContextMenuPosition] = useState<XYPosition>({
    x: 0,
    y: 0,
  });
  const [reactFlowInstance, setReactFlowInstance] = useState<unknown>(null);

  // 处理连线
  const onConnect = useCallback(
    (connection: Connection) => setEdges((eds) => addEdge(connection, eds)),
    [setEdges]
  );

  // 处理右键点击
  const onContextMenu = useCallback(
    (event: React.MouseEvent) => {
      event.preventDefault();
      if (reactFlowWrapper.current) {
        const boundingRect = reactFlowWrapper.current.getBoundingClientRect();
        const position = reactFlowInstance.project({
          x: event.clientX - boundingRect.left,
          y: event.clientY - boundingRect.top,
        });
        setContextMenuPosition(position);
        setModalVisible(true);
      }
    },
    [reactFlowInstance]
  );

  // 添加新节点
  const addNewNode = useCallback(
    (question: string, answer: string) => {
      const newNodeId = `node_${nodes.length + 1}`;
      const newNode: Node = {
        id: newNodeId,
        data: { label: question, answer },
        position: contextMenuPosition,
        type: "default",
      };

      setNodes((nds) => [...nds, newNode]);
      setModalVisible(false);
    },
    [nodes, contextMenuPosition, setNodes]
  );

  return (
    <div className="flow-canvas-container">
      <ReactFlowProvider>
        <div className="flow-canvas-wrapper" ref={reactFlowWrapper}>
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onContextMenu={onContextMenu}
            onInit={setReactFlowInstance}
            fitView
          >
            <Controls />
            <MiniMap />
            <Background variant="dots" gap={12} size={1} />
          </ReactFlow>
        </div>
        <NodeModal
          visible={modalVisible}
          onCancel={() => setModalVisible(false)}
          onSubmit={addNewNode}
        />
      </ReactFlowProvider>
    </div>
  );
};

export default FlowCanvas;
