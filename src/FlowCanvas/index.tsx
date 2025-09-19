import * as React from "react";
import { useState, useCallback, useRef } from "react";
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
  MarkerType,
  ReactFlowInstance,
} from "reactflow";
import "reactflow/dist/style.css";
import { Card, Typography } from "antd";
import NodeModal from "./NodeModal";
import "./FlowCanvas.css";

const { Title, Paragraph } = Typography;

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
  const [reactFlowInstance, setReactFlowInstance] =
    useState<ReactFlowInstance | null>(null);
  const [sourceNodeId, setSourceNodeId] = useState<string | null>(null);

  // 处理连线
  const onConnect = useCallback(
    (connection: Connection) => setEdges((eds) => addEdge(connection, eds)),
    [setEdges]
  );

  // 处理右键点击
  const onContextMenu = useCallback(
    (event: React.MouseEvent) => {
      event.preventDefault();
      if (reactFlowWrapper.current && reactFlowInstance) {
        const boundingRect = reactFlowWrapper.current.getBoundingClientRect();
        const position = reactFlowInstance.project({
          x: event.clientX - boundingRect.left,
          y: event.clientY - boundingRect.top,
        });

        // 查找最近的节点作为源节点
        const clickedNode = nodes.find((node) => {
          const nodeX = node.position.x;
          const nodeY = node.position.y;
          const distance = Math.sqrt(
            Math.pow(nodeX - position.x, 2) + Math.pow(nodeY - position.y, 2)
          );
          return distance < 100; // 100px范围内的节点
        });

        if (clickedNode) {
          setSourceNodeId(clickedNode.id);
          setContextMenuPosition(position);
          setModalVisible(true);
        } else {
          // 如果没有点击到节点附近，则不弹出对话框
          alert("请在节点附近右键点击以添加连接");
        }
      }
    },
    [reactFlowInstance, nodes]
  );

  // 添加新节点和连线
  const addNewNode = useCallback(
    (question: string, answer: string) => {
      if (!sourceNodeId) return;

      const newNodeId = `node_${nodes.length + 1}`;

      // 创建新节点
      const newNode: Node = {
        id: newNodeId,
        data: { label: answer }, // 答案显示在节点上
        position: {
          x: contextMenuPosition.x + 150,
          y: contextMenuPosition.y,
        },
        type: "default",
      };

      // 创建新连线
      const newEdge: Edge = {
        id: `edge_${sourceNodeId}_${newNodeId}`,
        source: sourceNodeId,
        target: newNodeId,
        label: question, // 问题显示在线上
        markerEnd: { type: MarkerType.ArrowClosed }, // 添加箭头
        style: { strokeWidth: 2 },
      };

      setNodes((nds) => [...nds, newNode]);
      setEdges((eds) => [...eds, newEdge]);
      setModalVisible(false);
      setSourceNodeId(null);
    },
    [sourceNodeId, nodes, contextMenuPosition, setNodes, setEdges]
  );

  return (
    <div>
      <Typography>
        <Title level={2}>流程图画布</Title>
        <Paragraph>
          这是一个简单的流程图画布示例。在节点附近右键点击可以添加新节点和连线，问题显示在连线上，答案显示在节点上。
        </Paragraph>
      </Typography>

      <Card style={{ marginTop: 16 }}>
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
              onCancel={() => {
                setModalVisible(false);
                setSourceNodeId(null);
              }}
              onSubmit={addNewNode}
            />
          </ReactFlowProvider>
        </div>
      </Card>
    </div>
  );
};

export default FlowCanvas;
