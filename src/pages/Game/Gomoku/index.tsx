import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { Card, Button, Space, Typography, Row, Col, Statistic, message } from 'antd';
import { ReloadOutlined, PauseCircleOutlined, PlayCircleOutlined, UndoOutlined } from '@ant-design/icons';
import './index.less';

const { Text } = Typography;

// 游戏状态枚举
enum GameStatus {
  WAITING = 'waiting',
  PLAYING = 'playing',
  PAUSED = 'paused',
  FINISHED = 'finished'
}

// 棋子类型
enum PieceType {
  EMPTY = 0,
  PLAYER = 1,
  AI = 2
}

// 游戏配置
const GAME_CONFIG = {
  BOARD_SIZE: 15,
  TOTAL_TIME: 600, // 总时间（秒）
  MOVE_TIME_LIMIT: 30, // 单次出手时间限制（秒）
  WIN_COUNT: 5, // 连子数量
  MAX_UNDO_COUNT: 3 // 最大悔棋次数
};

// 方向向量
const DIRECTIONS = [
  [-1, -1], [-1, 0], [-1, 1],
  [0, -1],           [0, 1],
  [1, -1],  [1, 0],  [1, 1]
];

const GomokuGame = () => {
  // 棋盘状态
  const [board, setBoard] = useState<PieceType[][]>(
    Array(GAME_CONFIG.BOARD_SIZE).fill(null).map(() => 
      Array(GAME_CONFIG.BOARD_SIZE).fill(PieceType.EMPTY)
    )
  );
  
  // 游戏状态
  const [gameStatus, setGameStatus] = useState<GameStatus>(GameStatus.WAITING);
  const [currentPlayer, setCurrentPlayer] = useState<PieceType>(PieceType.PLAYER);
  const [winner, setWinner] = useState<PieceType | null>(null);
  
  // 时间管理
  const [totalTime, setTotalTime] = useState(GAME_CONFIG.TOTAL_TIME);
  const [moveTimeLeft, setMoveTimeLeft] = useState(GAME_CONFIG.MOVE_TIME_LIMIT);
  const [isPlayerTurn, setIsPlayerTurn] = useState(true);
  
  // 游戏统计
  const [playerMoves, setPlayerMoves] = useState(0);
  const [aiMoves, setAiMoves] = useState(0);
  
  // 悔棋相关状态
  const [undoCount, setUndoCount] = useState(0); // 已使用悔棋次数
  const [moveHistory, setMoveHistory] = useState<Array<{
    board: PieceType[][];
    playerMoves: number;
    aiMoves: number;
    currentPlayer: PieceType;
    isPlayerTurn: boolean;
  }>>([]); // 移动历史记录

  // 定时器引用
  const totalTimerRef = useRef<NodeJS.Timeout | null>(null);
  const moveTimerRef = useRef<NodeJS.Timeout | null>(null);
  // 游戏状态引用，用于在异步回调中获取最新状态
  const gameStatusRef = useRef(gameStatus);
  
  // 同步gameStatus到ref
  useEffect(() => {
    gameStatusRef.current = gameStatus;
  }, [gameStatus]);

  // 清理定时器
  const clearTimers = useCallback(() => {
    // 清除总时间倒计时
    if (totalTimerRef.current) {
      clearInterval(totalTimerRef.current);
      totalTimerRef.current = null;
    }
    // 清除单次出手倒计时
    if (moveTimerRef.current) {
      clearInterval(moveTimerRef.current);
      moveTimerRef.current = null;
    }
  }, []);

  // 结束游戏
  const endGame = useCallback((winner: PieceType, reason: string) => {
    // 立即清除定时器，防止继续执行
    clearTimers();
    setGameStatus(GameStatus.FINISHED);
    setWinner(winner);
    message.success(reason);
  }, [clearTimers]);

  // 格式化时间显示
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // 开始单次出手倒计时
  const startMoveTimer = useCallback(() => {
    // 先清除已存在的单步定时器，防止叠加
    if (moveTimerRef.current) {
      clearInterval(moveTimerRef.current);
      moveTimerRef.current = null;
    }
    
    setMoveTimeLeft(GAME_CONFIG.MOVE_TIME_LIMIT);
    moveTimerRef.current = setInterval(() => {
      setMoveTimeLeft(prev => {
        if (prev <= 1) {
          if (isPlayerTurn) {
            endGame(PieceType.AI, '时间到！AI获胜');
          } else {
            endGame(PieceType.PLAYER, '时间到！玩家获胜');
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }, [isPlayerTurn, endGame]);

  // 开始总时间倒计时
  const startTotalTimer = useCallback(() => {
    // 先清除已存在的总时间定时器，防止叠加
    if (totalTimerRef.current) {
      clearInterval(totalTimerRef.current);
      totalTimerRef.current = null;
    }
    
    // 开始总时间倒计时
    totalTimerRef.current = setInterval(() => {
      setTotalTime(prev => {
        if (prev <= 1) {
          endGame(PieceType.AI, '时间到！AI获胜');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }, [endGame]);

  // 开始游戏
  const startGame = useCallback(() => {
    // 防止在游戏进行中或已结束时重复开始
    if (gameStatus === GameStatus.PLAYING || gameStatus === GameStatus.FINISHED) {
      return;
    }
    
    // 清理定时器
    clearTimers();
    
    // 重置棋盘
    setBoard(Array(GAME_CONFIG.BOARD_SIZE).fill(null).map(() => 
      Array(GAME_CONFIG.BOARD_SIZE).fill(PieceType.EMPTY)
    ));
    
    // 重置游戏状态
    setGameStatus(GameStatus.PLAYING);
    setCurrentPlayer(PieceType.PLAYER);
    setIsPlayerTurn(true);
    setWinner(null);
    setTotalTime(GAME_CONFIG.TOTAL_TIME);
    setMoveTimeLeft(GAME_CONFIG.MOVE_TIME_LIMIT);
    setPlayerMoves(0);
    setAiMoves(0);
    setUndoCount(0);
    setMoveHistory([]);
    
    // 开始定时器
    startTotalTimer();
    startMoveTimer();
  }, [gameStatus, clearTimers, startTotalTimer, startMoveTimer]);

  // 暂停/继续游戏
  const togglePause = useCallback(() => {
    if (gameStatus === GameStatus.PLAYING) {
      setGameStatus(GameStatus.PAUSED);
      clearTimers();
    } else if (gameStatus === GameStatus.PAUSED) {
      setGameStatus(GameStatus.PLAYING);
      startTotalTimer();
      if (isPlayerTurn) {
        startMoveTimer();
      }
    }
  }, [gameStatus, isPlayerTurn, clearTimers, startTotalTimer, startMoveTimer]);

  // 重新开始游戏
  const restartGame = useCallback(() => {
    clearTimers();
    setBoard(Array(GAME_CONFIG.BOARD_SIZE).fill(null).map(() => 
      Array(GAME_CONFIG.BOARD_SIZE).fill(PieceType.EMPTY)
    ));
    setGameStatus(GameStatus.WAITING);
    setCurrentPlayer(PieceType.PLAYER);
    setWinner(null);
    setTotalTime(GAME_CONFIG.TOTAL_TIME);
    setMoveTimeLeft(GAME_CONFIG.MOVE_TIME_LIMIT);
    setPlayerMoves(0);
    setAiMoves(0);
    setUndoCount(0);
    setMoveHistory([]);
    setIsPlayerTurn(true);
  }, [clearTimers]);

  // 悔棋功能
  const undoMove = useCallback(() => {
    if (gameStatus !== GameStatus.PLAYING) {
      message.warning('只能在游戏进行中悔棋');
      return;
    }
    
    if (undoCount >= GAME_CONFIG.MAX_UNDO_COUNT) {
      message.warning(`最多只能悔棋${GAME_CONFIG.MAX_UNDO_COUNT}次`);
      return;
    }
    
    if (moveHistory.length === 0) {
      message.warning('没有可悔棋的步骤');
      return;
    }
    
    // 清除定时器
    clearTimers();
    
    // 判断悔棋步数的新逻辑：
    // 1. 如果当前是AI回合（!isPlayerTurn），说明玩家刚下完，AI还没下 → 悔棋1步（只悔玩家）
    // 2. 如果当前是玩家回合（isPlayerTurn），说明AI刚下完 → 悔棋2步（悔掉AI + 玩家的最近一步）
    let stepsToUndo = 1;
    let undoMessage = '';
    
    if (!isPlayerTurn) {
      // 当前是AI回合，说明玩家刚下完，AI还没下，只悔玩家的最近一步
      stepsToUndo = 1;
      undoMessage = '悔棋成功，撤销了玩家的1步';
    } else {
      // 当前是玩家回合，说明AI刚下完，需要悔掉AI和玩家的最近一步
      if (moveHistory.length >= 2) {
        stepsToUndo = 2;
        undoMessage = '悔棋成功，撤销了AI和玩家各1步';
      } else {
        // 如果历史记录不足2步，只能悔掉现有的步数
        stepsToUndo = moveHistory.length;
        undoMessage = `悔棋成功，撤销了${stepsToUndo}步`;
      }
    }
    
    // 获取目标状态
    const targetIndex = moveHistory.length - stepsToUndo;
    if (targetIndex < 0) {
      // 如果没有足够的历史，恢复到游戏开始状态
      setBoard(Array(GAME_CONFIG.BOARD_SIZE).fill(null).map(() => 
        Array(GAME_CONFIG.BOARD_SIZE).fill(PieceType.EMPTY)
      ));
      setPlayerMoves(0);
      setAiMoves(0);
      setCurrentPlayer(PieceType.PLAYER);
      setIsPlayerTurn(true);
      setMoveHistory([]);
      undoMessage = '悔棋成功，回到游戏开始状态';
    } else if (targetIndex === 0) {
      // 如果目标是第一个历史记录，恢复到游戏开始状态但保留第一步历史
      setBoard(Array(GAME_CONFIG.BOARD_SIZE).fill(null).map(() => 
        Array(GAME_CONFIG.BOARD_SIZE).fill(PieceType.EMPTY)
      ));
      setPlayerMoves(0);
      setAiMoves(0);
      setCurrentPlayer(PieceType.PLAYER);
      setIsPlayerTurn(true);
      setMoveHistory([]);
      undoMessage = '悔棋成功，回到游戏开始状态';
    } else {
      // 恢复到目标状态的前一个状态
      const targetMove = moveHistory[targetIndex - 1];
      setBoard(targetMove.board);
      setPlayerMoves(targetMove.playerMoves);
      setAiMoves(targetMove.aiMoves);
      // 悔棋后总是轮到玩家
      setCurrentPlayer(PieceType.PLAYER);
      setIsPlayerTurn(true);
      setMoveHistory(prev => prev.slice(0, targetIndex));
    }
    
    setUndoCount(prev => prev + 1);
    
    // 重新开始计时
    startTotalTimer();
    // 悔棋后总是回到玩家回合
    setTimeout(() => {
      startMoveTimer();
    }, 100);
    
    message.success(undoMessage);
  }, [gameStatus, undoCount, moveHistory, isPlayerTurn, clearTimers, startTotalTimer, startMoveTimer]);

  // 检查是否获胜
  const checkWin = useCallback((board: PieceType[][], row: number, col: number, player: PieceType) => {
    for (const [dr, dc] of DIRECTIONS) {
      let count = 1;
      
      // 向一个方向检查
      for (let i = 1; i < GAME_CONFIG.WIN_COUNT; i++) {
        const newRow = row + dr * i;
        const newCol = col + dc * i;
        
        if (newRow < 0 || newRow >= GAME_CONFIG.BOARD_SIZE || 
            newCol < 0 || newCol >= GAME_CONFIG.BOARD_SIZE ||
            board[newRow][newCol] !== player) {
          break;
        }
        count++;
      }
      
      // 向相反方向检查
      for (let i = 1; i < GAME_CONFIG.WIN_COUNT; i++) {
        const newRow = row - dr * i;
        const newCol = col - dc * i;
        
        if (newRow < 0 || newRow >= GAME_CONFIG.BOARD_SIZE || 
            newCol < 0 || newCol >= GAME_CONFIG.BOARD_SIZE ||
            board[newRow][newCol] !== player) {
          break;
        }
        count++;
      }
      
      if (count >= GAME_CONFIG.WIN_COUNT) {
        return true;
      }
    }
    
    return false;
  }, []);

  // 棋型定义
  const PATTERNS = useMemo(() => ({
    FIVE: { score: 100000, name: '五连' },
    LIVE_FOUR: { score: 10000, name: '活四' },
    RUSH_FOUR: { score: 1000, name: '冲四' },
    LIVE_THREE: { score: 1000, name: '活三' },
    SLEEP_THREE: { score: 100, name: '眠三' },
    LIVE_TWO: { score: 100, name: '活二' },
    SLEEP_TWO: { score: 10, name: '眠二' }
  }), []);

  // 高级棋型识别
  const analyzePattern = useCallback((board: PieceType[][], row: number, col: number, dr: number, dc: number, player: PieceType) => {
    const line = [];
    const center = 4; // 中心位置
    
    // 提取9个位置的棋子状态
    for (let i = -4; i <= 4; i++) {
      const r = row + dr * i;
      const c = col + dc * i;
      if (r >= 0 && r < GAME_CONFIG.BOARD_SIZE && c >= 0 && c < GAME_CONFIG.BOARD_SIZE) {
        line.push(board[r][c]);
      } else {
        line.push(-1); // 边界
      }
    }
    
    // 在中心位置放置当前玩家的棋子
    line[center] = player;
    
    // 分析棋型
    let maxCount = 0;
    let blocked = 0;
    
    // 向左扩展
    let leftCount = 0;
    let leftBlocked = false;
    for (let i = center - 1; i >= 0; i--) {
      if (line[i] === player) {
        leftCount++;
      } else if (line[i] === PieceType.EMPTY) {
        break;
      } else {
        leftBlocked = true;
        break;
      }
    }
    
    // 向右扩展
    let rightCount = 0;
    let rightBlocked = false;
    for (let i = center + 1; i < line.length; i++) {
      if (line[i] === player) {
        rightCount++;
      } else if (line[i] === PieceType.EMPTY) {
        break;
      } else {
        rightBlocked = true;
        break;
      }
    }
    
    maxCount = leftCount + rightCount + 1;
    blocked = (leftBlocked ? 1 : 0) + (rightBlocked ? 1 : 0);
    
    // 判断棋型
    if (maxCount >= 5) return PATTERNS.FIVE;
    if (maxCount === 4) {
      return blocked === 0 ? PATTERNS.LIVE_FOUR : PATTERNS.RUSH_FOUR;
    }
    if (maxCount === 3) {
      return blocked === 0 ? PATTERNS.LIVE_THREE : PATTERNS.SLEEP_THREE;
    }
    if (maxCount === 2) {
      return blocked === 0 ? PATTERNS.LIVE_TWO : PATTERNS.SLEEP_TWO;
    }
    
    return { score: 1, name: '单子' };
  }, [PATTERNS]);

  // 威胁等级评估
  const evaluateThreat = useCallback((board: PieceType[][], row: number, col: number, player: PieceType) => {
    const opponent = player === PieceType.AI ? PieceType.PLAYER : PieceType.AI;
    let attackScore = 0;
    let defenseScore = 0;
    
    const directions = [[0, 1], [1, 0], [1, 1], [1, -1]];
    
    for (const [dr, dc] of directions) {
      // 分析自己的棋型
      const myPattern = analyzePattern(board, row, col, dr, dc, player);
      attackScore += myPattern.score;
      
      // 分析对手的棋型（防守）
      const opponentPattern = analyzePattern(board, row, col, dr, dc, opponent);
      defenseScore += opponentPattern.score * 1.1; // 防守稍微重要一点
    }
    
    return { attackScore, defenseScore, totalScore: attackScore + defenseScore };
  }, [analyzePattern]);

  // 检查是否有邻居棋子
  const hasNeighbor = useCallback((board: PieceType[][], row: number, col: number, radius: number) => {
    for (let dr = -radius; dr <= radius; dr++) {
      for (let dc = -radius; dc <= radius; dc++) {
        if (dr === 0 && dc === 0) continue;
        const r = row + dr;
        const c = col + dc;
        if (r >= 0 && r < GAME_CONFIG.BOARD_SIZE && c >= 0 && c < GAME_CONFIG.BOARD_SIZE) {
          if (board[r][c] !== PieceType.EMPTY) {
            return true;
          }
        }
      }
    }
    return false;
  }, []);

  // 评估函数 - 计算某个位置的得分
  const evaluatePosition = useCallback((board: PieceType[][], row: number, col: number, player: PieceType) => {
    const threat = evaluateThreat(board, row, col, player);
    
    // 中心位置加分
    const center = Math.floor(GAME_CONFIG.BOARD_SIZE / 2);
    const distanceToCenter = Math.sqrt(Math.pow(row - center, 2) + Math.pow(col - center, 2));
    const centerBonus = Math.floor((GAME_CONFIG.BOARD_SIZE - distanceToCenter) * 3);
    
    // 边角惩罚
    const edgePenalty = (row === 0 || row === GAME_CONFIG.BOARD_SIZE - 1 || 
                        col === 0 || col === GAME_CONFIG.BOARD_SIZE - 1) ? -20 : 0;
    
    return threat.totalScore + centerBonus + edgePenalty;
  }, [evaluateThreat]);

  // AI下棋 - 使用评分算法
  const makeAIMove = useCallback(() => {
    if (gameStatusRef.current !== GameStatus.PLAYING || isPlayerTurn) return;
    
    // 首先检查是否有立即获胜的机会
    for (let row = 0; row < GAME_CONFIG.BOARD_SIZE; row++) {
      for (let col = 0; col < GAME_CONFIG.BOARD_SIZE; col++) {
        if (board[row][col] === PieceType.EMPTY) {
          // 临时放置AI棋子，检查是否获胜
          const tempBoard = board.map(r => [...r]);
          tempBoard[row][col] = PieceType.AI;
          if (checkWin(tempBoard, row, col, PieceType.AI)) {
            // 找到获胜位置，立即下棋
            setBoard(tempBoard);
            setAiMoves(prev => prev + 1);
            endGame(PieceType.AI, 'AI获胜！');
            return;
          }
        }
      }
    }
    
    // 其次检查是否需要阻止玩家获胜
    for (let row = 0; row < GAME_CONFIG.BOARD_SIZE; row++) {
      for (let col = 0; col < GAME_CONFIG.BOARD_SIZE; col++) {
        if (board[row][col] === PieceType.EMPTY) {
          // 临时放置玩家棋子，检查玩家是否会获胜
          const tempBoard = board.map(r => [...r]);
          tempBoard[row][col] = PieceType.PLAYER;
          if (checkWin(tempBoard, row, col, PieceType.PLAYER)) {
            // 必须阻止玩家获胜
            const newBoard = board.map(r => [...r]);
            newBoard[row][col] = PieceType.AI;
            setBoard(newBoard);
            setAiMoves(prev => prev + 1);
            setCurrentPlayer(PieceType.PLAYER);
            setIsPlayerTurn(true);
            startMoveTimer();
            
            // 添加移动历史（记录AI防守后的状态）
            setMoveHistory(prev => [...prev, {
              board: newBoard,
              playerMoves,
              aiMoves: aiMoves + 1,
              currentPlayer: PieceType.AI,
              isPlayerTurn: false
            }]);
            return;
          }
        }
      }
    }
    
    // 如果没有立即获胜或阻止对手获胜的机会，使用智能评分算法
    const candidates = [];
    
    // 遍历棋盘，找到所有空位并评分（只考虑有邻居的位置，提高效率）
    for (let row = 0; row < GAME_CONFIG.BOARD_SIZE; row++) {
      for (let col = 0; col < GAME_CONFIG.BOARD_SIZE; col++) {
        if (board[row][col] === PieceType.EMPTY) {
          // 只考虑有邻居的位置或者是开局的中心区域
          if (hasNeighbor(board, row, col, 2) || (playerMoves + aiMoves < 3 && Math.abs(row - 7) <= 1 && Math.abs(col - 7) <= 1)) {
            const score = evaluatePosition(board, row, col, PieceType.AI);
            candidates.push({ row, col, score });
          }
        }
      }
    }
    
    if (candidates.length === 0) {
      // 如果没有候选位置，选择中心位置
      const centerRow = Math.floor(GAME_CONFIG.BOARD_SIZE / 2);
      const centerCol = Math.floor(GAME_CONFIG.BOARD_SIZE / 2);
      if (board[centerRow][centerCol] === PieceType.EMPTY) {
        candidates.push({ row: centerRow, col: centerCol, score: 100 });
      } else {
        // 平局
        endGame(PieceType.EMPTY, '平局！');
        return;
      }
    }
    
    // 按分数排序，选择分数最高的位置
    candidates.sort((a, b) => b.score - a.score);
    
    // 智能选择策略
    const maxScore = candidates[0].score;
    const secondScore = candidates.length > 1 ? candidates[1].score : 0;
    
    let selectedMove;
    if (maxScore >= 10000 || maxScore > secondScore * 3) {
      // 如果是高价值移动（活四等）或明显优势，直接选择最高分
      selectedMove = candidates[0];
    } else {
      // 否则在前5个中随机选择，增加不可预测性
      const topMoves = candidates.slice(0, Math.min(5, candidates.length));
      selectedMove = topMoves[Math.floor(Math.random() * topMoves.length)];
    }
    
    const { row, col } = selectedMove;
    
    // 更新棋盘
    const newBoard = board.map(r => [...r]);
    newBoard[row][col] = PieceType.AI;
    
    // 更新状态
    setBoard(newBoard);
    setAiMoves(prev => prev + 1);
    setCurrentPlayer(PieceType.PLAYER);
    setIsPlayerTurn(true);
    
    // 重新开始单步计时
    startMoveTimer();
    
    // 添加移动历史（记录AI下棋后的状态）
    setMoveHistory(prev => [...prev, {
      board: newBoard,
      playerMoves,
      aiMoves: aiMoves + 1,
      currentPlayer: PieceType.AI,
      isPlayerTurn: false
    }]);
    
  }, [board, isPlayerTurn, playerMoves, aiMoves, evaluatePosition, checkWin, endGame, startMoveTimer, hasNeighbor]);
  
  // 监听玩家回合变化，触发AI移动
  useEffect(() => {
    if (gameStatus === GameStatus.PLAYING && !isPlayerTurn && gameStatusRef.current === GameStatus.PLAYING) {
      // 使用setTimeout确保UI更新后再执行AI移动
      const timer = setTimeout(() => {
        // 再次检查游戏状态，确保游戏未结束
        if (gameStatusRef.current === GameStatus.PLAYING) {
          makeAIMove();
        }
      }, 800);
      return () => clearTimeout(timer);
    }
  }, [gameStatus, isPlayerTurn, makeAIMove]);

  // 处理玩家点击
  const handleCellClick = useCallback((row: number, col: number) => {
    if (gameStatus !== GameStatus.PLAYING || !isPlayerTurn || board[row][col] !== PieceType.EMPTY) {
      return;
    }
    
    const newBoard = board.map(row => [...row]);
    newBoard[row][col] = PieceType.PLAYER;
    setBoard(newBoard);
    
    setPlayerMoves(prev => prev + 1);
    
    // 记录移动历史（记录下棋后的状态）
    setMoveHistory(prev => [...prev, {
      board: newBoard,
      playerMoves: playerMoves + 1,
      aiMoves,
      currentPlayer: PieceType.PLAYER,
      isPlayerTurn: true
    }]);
    
    // 检查玩家是否获胜
    if (checkWin(newBoard, row, col, PieceType.PLAYER)) {
      endGame(PieceType.PLAYER, '恭喜！你获胜了！');
      return;
    }
    
    // 切换为AI回合
    setCurrentPlayer(PieceType.AI);
    setIsPlayerTurn(false);
    
    // 清除玩家的移动计时器
    if (moveTimerRef.current) {
      clearInterval(moveTimerRef.current);
      moveTimerRef.current = null;
    }
  }, [gameStatus, isPlayerTurn, board, playerMoves, aiMoves, checkWin, endGame]);

  // 组件卸载时清理定时器
  useEffect(() => {
    return () => {
      clearTimers();
    };
  }, [clearTimers]);

  return (
    <div className="gomoku-game">
      <Card className="game-card" title="五子棋对战">
        <div className="game-status">
          {gameStatus === GameStatus.WAITING && '等待开始游戏...'}
          {gameStatus === GameStatus.PLAYING && (
            <Text strong style={{ 
              color: currentPlayer === PieceType.PLAYER ? '#1890ff' : '#ff4d4f' 
            }}>
              当前回合：{currentPlayer === PieceType.PLAYER ? '玩家' : 'AI'}
            </Text>
          )}
          {gameStatus === GameStatus.PAUSED && '游戏已暂停'}
          {gameStatus === GameStatus.FINISHED && winner && (
            <Text strong style={{ 
              color: winner === PieceType.PLAYER ? '#1890ff' : '#ff4d4f',
              fontSize: '18px'
            }}>
              {winner === PieceType.PLAYER ? '恭喜！你获胜了！' : 'AI获胜！'}
            </Text>
          )}
        </div>

        <Row gutter={[24, 16]}>
          {/* 游戏控制面板 */}
          <Col span={24}>
            <Space size="large" wrap>
              <Button
                type="primary"
                icon={<PlayCircleOutlined />}
                onClick={startGame}
                disabled={gameStatus === GameStatus.PLAYING || gameStatus === GameStatus.FINISHED}
              >
                开始游戏
              </Button>
              
              <Button
                icon={gameStatus === GameStatus.PAUSED ? <PlayCircleOutlined /> : <PauseCircleOutlined />}
                onClick={togglePause}
                disabled={gameStatus === GameStatus.WAITING || gameStatus === GameStatus.FINISHED}
              >
                {gameStatus === GameStatus.PAUSED ? '继续' : '暂停'}
              </Button>
              
              <Button
                icon={<ReloadOutlined />}
                onClick={restartGame}
              >
                重新开始
              </Button>
              
              <Button
                icon={<UndoOutlined />}
                onClick={undoMove}
                disabled={gameStatus !== GameStatus.PLAYING || undoCount >= GAME_CONFIG.MAX_UNDO_COUNT}
              >
                悔棋 ({undoCount}/{GAME_CONFIG.MAX_UNDO_COUNT})
              </Button>
            </Space>
          </Col>

          {/* 游戏信息面板 */}
          <Col span={6}>
            <Space direction="vertical" size="large" style={{ width: '100%' }}>
              <Card title="时间信息" size="small">
                <Space direction="vertical" style={{ width: '100%' }}>
                  <Statistic
                    title="总时间"
                    value={formatTime(totalTime)}
                    valueStyle={{ color: totalTime < 60 ? '#ff4d4f' : '#000' }}
                  />
                  <Statistic
                    title="单步时间"
                    value={formatTime(moveTimeLeft)}
                    valueStyle={{ color: moveTimeLeft < 10 ? '#ff4d4f' : '#000' }}
                  />
                </Space>
              </Card>
              
              <Card title="游戏统计" size="small">
                <Space direction="vertical" style={{ width: '100%' }}>
                  <Statistic title="玩家步数" value={playerMoves} />
                  <Statistic title="AI步数" value={aiMoves} />
                  <Statistic title="悔棋次数" value={`${undoCount}/${GAME_CONFIG.MAX_UNDO_COUNT}`} />
                </Space>
              </Card>
            </Space>
          </Col>

          {/* 棋盘区域 */}
          <Col span={18}>
            <div className="board-container">
              <div className="board">
                {board.map((row, rowIndex) => (
                  <div key={rowIndex} className="board-row">
                    {row.map((cell, colIndex) => (
                      <div
                        key={`${rowIndex}-${colIndex}`}
                        className={`cell ${
                          cell === PieceType.PLAYER ? 'player' : 
                          cell === PieceType.AI ? 'ai' : ''
                        } ${
                          gameStatus === GameStatus.PLAYING && isPlayerTurn && cell === PieceType.EMPTY ? 'clickable' : ''
                        }`}
                        onClick={() => handleCellClick(rowIndex, colIndex)}
                      >
                        {cell !== PieceType.EMPTY && (
                          <div className={`piece ${
                            cell === PieceType.PLAYER ? 'player-piece' : 'ai-piece'
                          }`} />
                        )}
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </Col>
        </Row>
      </Card>
    </div>
  );
};

export default GomokuGame;