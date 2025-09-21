import { useState, useEffect, useCallback, useRef } from 'react';
import { Card, Button, Space, Typography, Row, Col, Statistic, message, Select, Modal } from 'antd';
import { ReloadOutlined, PauseCircleOutlined, PlayCircleOutlined, UndoOutlined } from '@ant-design/icons';
import './index.less';

const { Text } = Typography;
const { Option } = Select;

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
  RED = 1,
  BLACK = 2
}

// 棋子名称枚举
enum PieceName {
  EMPTY = '',
  RED_KING = '帅',
  RED_ADVISOR = '仕',
  RED_ELEPHANT = '相',
  RED_HORSE = '红马',
  RED_ROOK = '红车',
  RED_CANNON = '红炮',
  RED_PAWN = '兵',
  BLACK_KING = '将',
  BLACK_ADVISOR = '士',
  BLACK_ELEPHANT = '象',
  BLACK_HORSE = '黑马',
  BLACK_ROOK = '黑车',
  BLACK_CANNON = '黑炮',
  BLACK_PAWN = '卒'
}

// 游戏配置
const GAME_CONFIG = {
  BOARD_ROWS: 10,
  BOARD_COLS: 9,
  TOTAL_TIME: 1800, // 总时间（秒）30分钟
  MOVE_TIME_LIMIT: 60, // 单次出手时间限制（秒）
  MAX_UNDO_COUNT: 3 // 最大悔棋次数
};

// 初始棋盘布局
const INITIAL_BOARD = [
  [PieceName.BLACK_ROOK, PieceName.BLACK_HORSE, PieceName.BLACK_ELEPHANT, PieceName.BLACK_ADVISOR, PieceName.BLACK_KING, PieceName.BLACK_ADVISOR, PieceName.BLACK_ELEPHANT, PieceName.BLACK_HORSE, PieceName.BLACK_ROOK],
  [PieceName.EMPTY, PieceName.EMPTY, PieceName.EMPTY, PieceName.EMPTY, PieceName.EMPTY, PieceName.EMPTY, PieceName.EMPTY, PieceName.EMPTY, PieceName.EMPTY],
  [PieceName.EMPTY, PieceName.BLACK_CANNON, PieceName.EMPTY, PieceName.EMPTY, PieceName.EMPTY, PieceName.EMPTY, PieceName.EMPTY, PieceName.BLACK_CANNON, PieceName.EMPTY],
  [PieceName.BLACK_PAWN, PieceName.EMPTY, PieceName.BLACK_PAWN, PieceName.EMPTY, PieceName.BLACK_PAWN, PieceName.EMPTY, PieceName.BLACK_PAWN, PieceName.EMPTY, PieceName.BLACK_PAWN],
  [PieceName.EMPTY, PieceName.EMPTY, PieceName.EMPTY, PieceName.EMPTY, PieceName.EMPTY, PieceName.EMPTY, PieceName.EMPTY, PieceName.EMPTY, PieceName.EMPTY],
  [PieceName.EMPTY, PieceName.EMPTY, PieceName.EMPTY, PieceName.EMPTY, PieceName.EMPTY, PieceName.EMPTY, PieceName.EMPTY, PieceName.EMPTY, PieceName.EMPTY],
  [PieceName.RED_PAWN, PieceName.EMPTY, PieceName.RED_PAWN, PieceName.EMPTY, PieceName.RED_PAWN, PieceName.EMPTY, PieceName.RED_PAWN, PieceName.EMPTY, PieceName.RED_PAWN],
  [PieceName.EMPTY, PieceName.RED_CANNON, PieceName.EMPTY, PieceName.EMPTY, PieceName.EMPTY, PieceName.EMPTY, PieceName.EMPTY, PieceName.RED_CANNON, PieceName.EMPTY],
  [PieceName.EMPTY, PieceName.EMPTY, PieceName.EMPTY, PieceName.EMPTY, PieceName.EMPTY, PieceName.EMPTY, PieceName.EMPTY, PieceName.EMPTY, PieceName.EMPTY],
  [PieceName.RED_ROOK, PieceName.RED_HORSE, PieceName.RED_ELEPHANT, PieceName.RED_ADVISOR, PieceName.RED_KING, PieceName.RED_ADVISOR, PieceName.RED_ELEPHANT, PieceName.RED_HORSE, PieceName.RED_ROOK]
];

// 移动历史记录类型
interface MoveHistory {
  board: string[][];
  from: { row: number; col: number };
  to: { row: number; col: number };
  piece: string;
  capturedPiece: string;
  playerSide: PieceType;
}

const ChessGame = () => {
  // 棋盘状态
  const [board, setBoard] = useState<string[][]>(INITIAL_BOARD);
  
  // 游戏状态
  const [gameStatus, setGameStatus] = useState<GameStatus>(GameStatus.WAITING);
  const [currentPlayer, setCurrentPlayer] = useState<PieceType>(PieceType.RED);
  const [playerSide, setPlayerSide] = useState<PieceType>(PieceType.RED);
  const [winner, setWinner] = useState<PieceType | null>(null);
  
  // 时间管理
  const [totalTime, setTotalTime] = useState(GAME_CONFIG.TOTAL_TIME);
  const [moveTimeLeft, setMoveTimeLeft] = useState(GAME_CONFIG.MOVE_TIME_LIMIT);
  const [isPlayerTurn, setIsPlayerTurn] = useState(true);
  
  // 游戏统计
  const [playerMoves, setPlayerMoves] = useState(0);
  const [aiMoves, setAiMoves] = useState(0);
  
  // 悔棋相关状态
  const [undoCount, setUndoCount] = useState(0);
  const [moveHistory, setMoveHistory] = useState<MoveHistory[]>([]);
  
  // 选中的棋子
  const [selectedPiece, setSelectedPiece] = useState<{ row: number; col: number } | null>(null);
  const [possibleMoves, setPossibleMoves] = useState<{ row: number; col: number }[]>([]);
  
  // 定时器引用
  const totalTimerRef = useRef<NodeJS.Timeout | null>(null);
  const moveTimerRef = useRef<NodeJS.Timeout | null>(null);
  const gameStatusRef = useRef(gameStatus);
  
  // 同步gameStatus到ref
  useEffect(() => {
    gameStatusRef.current = gameStatus;
  }, [gameStatus]);

  // 清理定时器
  const clearTimers = useCallback(() => {
    if (totalTimerRef.current) {
      clearInterval(totalTimerRef.current);
      totalTimerRef.current = null;
    }
    if (moveTimerRef.current) {
      clearInterval(moveTimerRef.current);
      moveTimerRef.current = null;
    }
  }, []);

  // 结束游戏
  const endGame = useCallback((winner: PieceType, reason: string) => {
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
    if (moveTimerRef.current) {
      clearInterval(moveTimerRef.current);
      moveTimerRef.current = null;
    }
    
    setMoveTimeLeft(GAME_CONFIG.MOVE_TIME_LIMIT);
    moveTimerRef.current = setInterval(() => {
      setMoveTimeLeft(prev => {
        if (prev <= 1) {
          if (isPlayerTurn) {
            endGame(PieceType.BLACK, '时间到！黑方获胜');
          } else {
            endGame(PieceType.RED, '时间到！红方获胜');
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }, [isPlayerTurn, endGame]);

  // 开始总时间倒计时
  const startTotalTimer = useCallback(() => {
    if (totalTimerRef.current) {
      clearInterval(totalTimerRef.current);
      totalTimerRef.current = null;
    }
    
    totalTimerRef.current = setInterval(() => {
      setTotalTime(prev => {
        if (prev <= 1) {
          endGame(currentPlayer === PieceType.RED ? PieceType.BLACK : PieceType.RED, '总时间到！对方获胜');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }, [currentPlayer, endGame]);

  // 开始游戏
  const startGame = useCallback(() => {
    setGameStatus(GameStatus.PLAYING);
    setCurrentPlayer(PieceType.RED);
    setIsPlayerTurn(playerSide === PieceType.RED);
    setTotalTime(GAME_CONFIG.TOTAL_TIME);
    setMoveTimeLeft(GAME_CONFIG.MOVE_TIME_LIMIT);
    setPlayerMoves(0);
    setAiMoves(0);
    setUndoCount(0);
    setMoveHistory([]);
    setSelectedPiece(null);
    setPossibleMoves([]);
    setWinner(null);
    
    // 开始定时器
    startTotalTimer();
    if (playerSide === PieceType.RED) {
      startMoveTimer();
    }
  }, [playerSide, startTotalTimer, startMoveTimer]);

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
    setBoard(INITIAL_BOARD);
    setGameStatus(GameStatus.WAITING);
    setCurrentPlayer(PieceType.RED);
    setWinner(null);
    setTotalTime(GAME_CONFIG.TOTAL_TIME);
    setMoveTimeLeft(GAME_CONFIG.MOVE_TIME_LIMIT);
    setPlayerMoves(0);
    setAiMoves(0);
    setUndoCount(0);
    setMoveHistory([]);
    setSelectedPiece(null);
    setPossibleMoves([]);
    setIsPlayerTurn(true);
  }, [clearTimers]);

  // 悔棋功能
  const undoMove = useCallback(() => {
    if (undoCount >= GAME_CONFIG.MAX_UNDO_COUNT) {
      message.warning(`最多只能悔棋${GAME_CONFIG.MAX_UNDO_COUNT}次`);
      return;
    }
    
    if (moveHistory.length === 0) {
      message.warning('没有可悔棋的步骤');
      return;
    }
    
    const lastMove = moveHistory[moveHistory.length - 1];
    setBoard(lastMove.board);
    setMoveHistory(prev => prev.slice(0, -1));
    setUndoCount(prev => prev + 1);
    setSelectedPiece(null);
    setPossibleMoves([]);
    
    // 切换回合
    setCurrentPlayer(prev => prev === PieceType.RED ? PieceType.BLACK : PieceType.RED);
    setIsPlayerTurn(prev => !prev);
    
    message.success('悔棋成功');
  }, [undoCount, moveHistory]);

  // 检查棋子是否属于当前玩家
  const isPlayerPiece = useCallback((piece: string) => {
    if (piece === PieceName.EMPTY) return false;
    const redPieces = [
      PieceName.RED_KING, PieceName.RED_ADVISOR, PieceName.RED_ELEPHANT,
      PieceName.RED_HORSE, PieceName.RED_ROOK, PieceName.RED_CANNON, PieceName.RED_PAWN
    ];
    return redPieces.includes(piece as PieceName);
  }, []);

  // 检查棋子是否属于对方
  const isOpponentPiece = useCallback((piece: string) => {
    if (piece === PieceName.EMPTY) return false;
    const blackPieces = [
      PieceName.BLACK_KING, PieceName.BLACK_ADVISOR, PieceName.BLACK_ELEPHANT,
      PieceName.BLACK_HORSE, PieceName.BLACK_ROOK, PieceName.BLACK_CANNON, PieceName.BLACK_PAWN
    ];
    return blackPieces.includes(piece as PieceName);
  }, []);

  // 检查是否将军
  const isInCheck = (board: string[][], isRedKing: boolean) => {
    // 找到将/帅的位置
    let kingRow = -1, kingCol = -1;
    const kingName = isRedKing ? PieceName.RED_KING : PieceName.BLACK_KING;
    
    for (let row = 0; row < board.length; row++) {
      for (let col = 0; col < board[row].length; col++) {
        if (board[row][col] === kingName) {
          kingRow = row;
          kingCol = col;
          break;
        }
      }
      if (kingRow !== -1) break;
    }
    
    if (kingRow === -1) return false; // 将/帅不存在，游戏应该已经结束
    
    // 检查所有对方棋子是否能攻击到将/帅
    const opponentPieces = isRedKing ? [
      PieceName.BLACK_KING, PieceName.BLACK_ADVISOR, PieceName.BLACK_ELEPHANT,
      PieceName.BLACK_HORSE, PieceName.BLACK_ROOK, PieceName.BLACK_CANNON, PieceName.BLACK_PAWN
    ] : [
      PieceName.RED_KING, PieceName.RED_ADVISOR, PieceName.RED_ELEPHANT,
      PieceName.RED_HORSE, PieceName.RED_ROOK, PieceName.RED_CANNON, PieceName.RED_PAWN
    ];
    
    for (let row = 0; row < board.length; row++) {
      for (let col = 0; col < board[row].length; col++) {
        const piece = board[row][col];
        if (opponentPieces.includes(piece as PieceName)) {
          const moves = getPossibleMoves(row, col, piece);
          if (moves.some(move => move.row === kingRow && move.col === kingCol)) {
            return true;
          }
        }
      }
    }
    
    return false;
  };

  // 检查是否将死
  const isCheckmate = (board: string[][], isRedKing: boolean) => {
    if (!isInCheck(board, isRedKing)) return false;
    
    // 找到所有己方棋子，看是否有任何移动可以解除将军
    const ownPieces = isRedKing ? [
      PieceName.RED_KING, PieceName.RED_ADVISOR, PieceName.RED_ELEPHANT,
      PieceName.RED_HORSE, PieceName.RED_ROOK, PieceName.RED_CANNON, PieceName.RED_PAWN
    ] : [
      PieceName.BLACK_KING, PieceName.BLACK_ADVISOR, PieceName.BLACK_ELEPHANT,
      PieceName.BLACK_HORSE, PieceName.BLACK_ROOK, PieceName.BLACK_CANNON, PieceName.BLACK_PAWN
    ];
    
    for (let row = 0; row < board.length; row++) {
      for (let col = 0; col < board[row].length; col++) {
        const piece = board[row][col];
        if (ownPieces.includes(piece as PieceName)) {
          const moves = getPossibleMoves(row, col, piece);
          
          // 尝试每个可能的移动，看是否能解除将军
          for (const move of moves) {
            const testBoard = board.map(r => [...r]);
            testBoard[move.row][move.col] = piece;
            testBoard[row][col] = PieceName.EMPTY;
            
            if (!isInCheck(testBoard, isRedKing)) {
              return false; // 有移动可以解除将军，不是将死
            }
          }
        }
      }
    }
    
    return true; // 所有移动都无法解除将军，是将死
  };

  // 检查是否困毙（无子可动且未被将军）
  const isStalemate = (board: string[][], isRedKing: boolean) => {
    if (isInCheck(board, isRedKing)) return false; // 被将军不是困毙
    
    // 找到所有己方棋子，看是否有任何合法移动
    const ownPieces = isRedKing ? [
      PieceName.RED_KING, PieceName.RED_ADVISOR, PieceName.RED_ELEPHANT,
      PieceName.RED_HORSE, PieceName.RED_ROOK, PieceName.RED_CANNON, PieceName.RED_PAWN
    ] : [
      PieceName.BLACK_KING, PieceName.BLACK_ADVISOR, PieceName.BLACK_ELEPHANT,
      PieceName.BLACK_HORSE, PieceName.BLACK_ROOK, PieceName.BLACK_CANNON, PieceName.BLACK_PAWN
    ];
    
    for (let row = 0; row < board.length; row++) {
      for (let col = 0; col < board[row].length; col++) {
        const piece = board[row][col];
        if (ownPieces.includes(piece as PieceName)) {
          const moves = getPossibleMoves(row, col, piece);
          
          // 检查是否有任何移动不会导致自己被将军
          for (const move of moves) {
            const testBoard = board.map(r => [...r]);
            testBoard[move.row][move.col] = piece;
            testBoard[row][col] = PieceName.EMPTY;
            
            if (!isInCheck(testBoard, isRedKing)) {
              return false; // 有合法移动，不是困毙
            }
          }
        }
      }
    }
    
    return true; // 无子可动，是困毙
  };

  // 过滤掉会导致自己被将军的移动
  const filterValidMoves = (moves: { row: number; col: number }[], fromRow: number, fromCol: number, piece: string, board: string[][]) => {
    const isRed = isPlayerPiece(piece);
    return moves.filter(move => {
      const testBoard = board.map(r => [...r]);
      testBoard[move.row][move.col] = piece;
      testBoard[fromRow][fromCol] = PieceName.EMPTY;
      return !isInCheck(testBoard, isRed);
    });
  };

  // 获取棋子的可能移动位置
  const getPossibleMoves = (row: number, col: number, piece: string) => {
    const moves: { row: number; col: number }[] = [];
    const isRed = isPlayerPiece(piece);
    
    switch (piece) {
      case PieceName.RED_KING:
      case PieceName.BLACK_KING:
        moves.push(...getKingMoves(row, col, isRed));
        break;
      case PieceName.RED_ADVISOR:
      case PieceName.BLACK_ADVISOR:
        moves.push(...getAdvisorMoves(row, col, isRed));
        break;
      case PieceName.RED_ELEPHANT:
      case PieceName.BLACK_ELEPHANT:
        moves.push(...getElephantMoves(row, col, isRed));
        break;
      case PieceName.RED_HORSE:
      case PieceName.BLACK_HORSE:
        moves.push(...getHorseMoves(row, col));
        break;
      case PieceName.RED_ROOK:
      case PieceName.BLACK_ROOK:
        moves.push(...getRookMoves(row, col));
        break;
      case PieceName.RED_CANNON:
      case PieceName.BLACK_CANNON:
        moves.push(...getCannonMoves(row, col));
        break;
      case PieceName.RED_PAWN:
      case PieceName.BLACK_PAWN:
        moves.push(...getPawnMoves(row, col, isRed));
        break;
    }
    
    // 过滤掉会导致自己被将军的移动
    return filterValidMoves(moves, row, col, piece, board);
  };

  // 将/帅的移动规则
  const getKingMoves = (row: number, col: number, isRed: boolean) => {
    const moves: { row: number; col: number }[] = [];
    const palace = isRed ? { minRow: 7, maxRow: 9, minCol: 3, maxCol: 5 } : { minRow: 0, maxRow: 2, minCol: 3, maxCol: 5 };
    
    const directions = [[-1, 0], [1, 0], [0, -1], [0, 1]];
    
    directions.forEach(([dr, dc]) => {
      const newRow = row + dr;
      const newCol = col + dc;
      
      if (newRow >= palace.minRow && newRow <= palace.maxRow && 
          newCol >= palace.minCol && newCol <= palace.maxCol) {
        const targetPiece = board[newRow][newCol];
        if (targetPiece === PieceName.EMPTY || isOpponentPiece(targetPiece)) {
          moves.push({ row: newRow, col: newCol });
        }
      }
    });
    
    return moves;
  };

  // 仕/士的移动规则
  const getAdvisorMoves = (row: number, col: number, isRed: boolean) => {
    const moves: { row: number; col: number }[] = [];
    const palace = isRed ? { minRow: 7, maxRow: 9, minCol: 3, maxCol: 5 } : { minRow: 0, maxRow: 2, minCol: 3, maxCol: 5 };
    
    const directions = [[-1, -1], [-1, 1], [1, -1], [1, 1]];
    
    directions.forEach(([dr, dc]) => {
      const newRow = row + dr;
      const newCol = col + dc;
      
      if (newRow >= palace.minRow && newRow <= palace.maxRow && 
          newCol >= palace.minCol && newCol <= palace.maxCol) {
        const targetPiece = board[newRow][newCol];
        if (targetPiece === PieceName.EMPTY || isOpponentPiece(targetPiece)) {
          moves.push({ row: newRow, col: newCol });
        }
      }
    });
    
    return moves;
  };

  // 相/象的移动规则
  const getElephantMoves = (row: number, col: number, isRed: boolean) => {
    const moves: { row: number; col: number }[] = [];
    const territory = isRed ? { minRow: 5, maxRow: 9 } : { minRow: 0, maxRow: 4 };
    
    const directions = [[-2, -2], [-2, 2], [2, -2], [2, 2]];
    
    directions.forEach(([dr, dc]) => {
      const newRow = row + dr;
      const newCol = col + dc;
      const blockRow = row + dr / 2;
      const blockCol = col + dc / 2;
      
      if (newRow >= territory.minRow && newRow <= territory.maxRow && 
          newCol >= 0 && newCol < GAME_CONFIG.BOARD_COLS &&
          board[blockRow][blockCol] === PieceName.EMPTY) {
        const targetPiece = board[newRow][newCol];
        if (targetPiece === PieceName.EMPTY || isOpponentPiece(targetPiece)) {
          moves.push({ row: newRow, col: newCol });
        }
      }
    });
    
    return moves;
  };

  // 马的移动规则
  const getHorseMoves = (row: number, col: number) => {
    const moves: { row: number; col: number }[] = [];
    const horseMoves = [
      [-2, -1], [-2, 1], [-1, -2], [-1, 2],
      [1, -2], [1, 2], [2, -1], [2, 1]
    ];
    
    horseMoves.forEach(([dr, dc]) => {
      const newRow = row + dr;
      const newCol = col + dc;
      const blockRow = row + (dr > 0 ? 1 : -1) * Math.min(Math.abs(dr), 1);
      const blockCol = col + (dc > 0 ? 1 : -1) * Math.min(Math.abs(dc), 1);
      
      if (newRow >= 0 && newRow < GAME_CONFIG.BOARD_ROWS && 
          newCol >= 0 && newCol < GAME_CONFIG.BOARD_COLS &&
          board[blockRow][blockCol] === PieceName.EMPTY) {
        const targetPiece = board[newRow][newCol];
        if (targetPiece === PieceName.EMPTY || isOpponentPiece(targetPiece)) {
          moves.push({ row: newRow, col: newCol });
        }
      }
    });
    
    return moves;
  };

  // 车的移动规则
  const getRookMoves = (row: number, col: number) => {
    const moves: { row: number; col: number }[] = [];
    const directions = [[-1, 0], [1, 0], [0, -1], [0, 1]];
    
    directions.forEach(([dr, dc]) => {
      for (let i = 1; i < GAME_CONFIG.BOARD_ROWS; i++) {
        const newRow = row + dr * i;
        const newCol = col + dc * i;
        
        if (newRow < 0 || newRow >= GAME_CONFIG.BOARD_ROWS || 
            newCol < 0 || newCol >= GAME_CONFIG.BOARD_COLS) break;
        
        const targetPiece = board[newRow][newCol];
        if (targetPiece === PieceName.EMPTY) {
          moves.push({ row: newRow, col: newCol });
        } else if (isOpponentPiece(targetPiece)) {
          moves.push({ row: newRow, col: newCol });
          break;
        } else {
          break;
        }
      }
    });
    
    return moves;
  };

  // 炮的移动规则
  const getCannonMoves = (row: number, col: number) => {
    const moves: { row: number; col: number }[] = [];
    const directions = [[-1, 0], [1, 0], [0, -1], [0, 1]];
    
    directions.forEach(([dr, dc]) => {
      let hasJumped = false;
      
      for (let i = 1; i < GAME_CONFIG.BOARD_ROWS; i++) {
        const newRow = row + dr * i;
        const newCol = col + dc * i;
        
        if (newRow < 0 || newRow >= GAME_CONFIG.BOARD_ROWS || 
            newCol < 0 || newCol >= GAME_CONFIG.BOARD_COLS) break;
        
        const targetPiece = board[newRow][newCol];
        
        if (!hasJumped) {
          if (targetPiece === PieceName.EMPTY) {
            moves.push({ row: newRow, col: newCol });
          } else {
            hasJumped = true;
          }
        } else {
          if (targetPiece !== PieceName.EMPTY) {
            if (isOpponentPiece(targetPiece)) {
              moves.push({ row: newRow, col: newCol });
            }
            break;
          }
        }
      }
    });
    
    return moves;
  };

  // 兵/卒的移动规则
  const getPawnMoves = (row: number, col: number, isRed: boolean) => {
    const moves: { row: number; col: number }[] = [];
    const river = isRed ? 4 : 5;
    const canMoveHorizontally = (isRed && row < river) || (!isRed && row > river);
    
    // 向前移动
    const forwardRow = isRed ? row - 1 : row + 1;
    if (forwardRow >= 0 && forwardRow < GAME_CONFIG.BOARD_ROWS) {
      const targetPiece = board[forwardRow][col];
      if (targetPiece === PieceName.EMPTY || isOpponentPiece(targetPiece)) {
        moves.push({ row: forwardRow, col });
      }
    }
    
    // 过河后可以左右移动
    if (canMoveHorizontally) {
      const leftCol = col - 1;
      const rightCol = col + 1;
      
      if (leftCol >= 0) {
        const targetPiece = board[row][leftCol];
        if (targetPiece === PieceName.EMPTY || isOpponentPiece(targetPiece)) {
          moves.push({ row, col: leftCol });
        }
      }
      
      if (rightCol < GAME_CONFIG.BOARD_COLS) {
        const targetPiece = board[row][rightCol];
        if (targetPiece === PieceName.EMPTY || isOpponentPiece(targetPiece)) {
          moves.push({ row, col: rightCol });
        }
      }
    }
    
    return moves;
  };

  // AI走棋（随机合法走法）
  const aiMove = useCallback(() => {
    // 1. 找到所有AI棋子
    const aiIsRed = (playerSide === PieceType.BLACK);
    const aiPieces = [];
    for (let row = 0; row < board.length; row++) {
      for (let col = 0; col < board[row].length; col++) {
        const piece = board[row][col];
        if (
          (aiIsRed && isPlayerPiece(piece)) ||
          (!aiIsRed && isOpponentPiece(piece))
        ) {
          const moves = getPossibleMoves(row, col, piece);
          if (moves.length > 0) {
            aiPieces.push({ row, col, piece, moves });
          }
        }
      }
    }
    if (aiPieces.length === 0) return;
    // 2. 随机选一个棋子和走法
    const randomPiece = aiPieces[Math.floor(Math.random() * aiPieces.length)];
    const randomMove = randomPiece.moves[Math.floor(Math.random() * randomPiece.moves.length)];
    // 3. 执行移动
    const { row: fromRow, col: fromCol } = randomPiece;
    const { row: toRow, col: toCol } = randomMove;
    const newBoard = board.map(row => [...row]);
    const capturedPiece = newBoard[toRow][toCol];
    newBoard[toRow][toCol] = newBoard[fromRow][fromCol];
    newBoard[fromRow][fromCol] = PieceName.EMPTY;
    setBoard(newBoard);
    setMoveHistory(prev => [...prev, {
      board: newBoard,
      from: { row: fromRow, col: fromCol },
      to: { row: toRow, col: toCol },
      piece: board[fromRow][fromCol],
      capturedPiece,
      playerSide: currentPlayer
    }]);
    setAiMoves(prev => prev + 1);
    
    // 检查游戏结束条件
    const redInCheck = isInCheck(newBoard, true);
    const blackInCheck = isInCheck(newBoard, false);
    const redCheckmate = isCheckmate(newBoard, true);
    const blackCheckmate = isCheckmate(newBoard, false);
    const redStalemate = isStalemate(newBoard, true);
    const blackStalemate = isStalemate(newBoard, false);
    
    if (redCheckmate) {
      endGame(PieceType.BLACK, '将死！黑方获胜！');
      return;
    }
    if (blackCheckmate) {
      endGame(PieceType.RED, '将死！红方获胜！');
      return;
    }
    if (redStalemate) {
      endGame(PieceType.BLACK, '困毙！黑方获胜！');
      return;
    }
    if (blackStalemate) {
      endGame(PieceType.RED, '困毙！红方获胜！');
      return;
    }
    
    // 显示将军提示
    if (redInCheck) {
      message.warning('将军！红方被将军！');
    }
    if (blackInCheck) {
      message.warning('将军！黑方被将军！');
    }
    
    setCurrentPlayer(prev => prev === PieceType.RED ? PieceType.BLACK : PieceType.RED);
    setIsPlayerTurn(true);
    setSelectedPiece(null);
    setPossibleMoves([]);
    // 重新开始移动计时器
    startMoveTimer();
  }, [board, playerSide, currentPlayer, endGame, startMoveTimer, getPossibleMoves, isCheckmate, isInCheck, isOpponentPiece, isPlayerPiece, isStalemate]);

  // AI自动走棋逻辑
  useEffect(() => {
    if (
      gameStatus === GameStatus.PLAYING &&
      !isPlayerTurn &&
      ((playerSide === PieceType.RED && currentPlayer === PieceType.BLACK) ||
        (playerSide === PieceType.BLACK && currentPlayer === PieceType.RED))
    ) {
      setTimeout(() => {
        aiMove();
      }, 600); // 模拟AI思考时间
    }
  }, [isPlayerTurn, currentPlayer, gameStatus, playerSide, aiMove]);

  // 处理棋子点击
  const handlePieceClick = (row: number, col: number) => {
    if (gameStatus !== GameStatus.PLAYING || !isPlayerTurn) return;
    
    const piece = board[row][col];
    
    if (selectedPiece) {
      // 如果已经选中了棋子，检查是否点击了可移动的位置
      const isPossibleMove = possibleMoves.some(move => move.row === row && move.col === col);
      
      if (isPossibleMove) {
        // 执行移动
        const newBoard = board.map(row => [...row]);
        const capturedPiece = newBoard[row][col];
        newBoard[row][col] = newBoard[selectedPiece.row][selectedPiece.col];
        newBoard[selectedPiece.row][selectedPiece.col] = PieceName.EMPTY;
        
        setBoard(newBoard);
        
        // 记录移动历史
        setMoveHistory(prev => [...prev, {
          board: newBoard,
          from: selectedPiece,
          to: { row, col },
          piece: board[selectedPiece.row][selectedPiece.col],
          capturedPiece,
          playerSide: currentPlayer
        }]);
        
        // 更新统计
        if (currentPlayer === playerSide) {
          setPlayerMoves(prev => prev + 1);
        } else {
          setAiMoves(prev => prev + 1);
        }
        
        // 检查游戏结束条件
        const redInCheck = isInCheck(newBoard, true);
        const blackInCheck = isInCheck(newBoard, false);
        const redCheckmate = isCheckmate(newBoard, true);
        const blackCheckmate = isCheckmate(newBoard, false);
        const redStalemate = isStalemate(newBoard, true);
        const blackStalemate = isStalemate(newBoard, false);
        
        if (redCheckmate) {
          endGame(PieceType.BLACK, '将死！黑方获胜！');
          return;
        }
        if (blackCheckmate) {
          endGame(PieceType.RED, '将死！红方获胜！');
          return;
        }
        if (redStalemate) {
          endGame(PieceType.BLACK, '困毙！黑方获胜！');
          return;
        }
        if (blackStalemate) {
          endGame(PieceType.RED, '困毙！红方获胜！');
          return;
        }
        
        // 显示将军提示
        if (redInCheck) {
          message.warning('将军！红方被将军！');
        }
        if (blackInCheck) {
          message.warning('将军！黑方被将军！');
        }
        
        // 切换回合
        setCurrentPlayer(prev => prev === PieceType.RED ? PieceType.BLACK : PieceType.RED);
        setIsPlayerTurn(prev => !prev);
        
        // 重新开始移动计时器
        if (isPlayerTurn) {
          startMoveTimer();
        }
        
        setSelectedPiece(null);
        setPossibleMoves([]);
        
        message.success('移动成功');
      } else {
        // 取消选择
        setSelectedPiece(null);
        setPossibleMoves([]);
      }
    } else if (piece !== PieceName.EMPTY && isPlayerPiece(piece)) {
      // 选中棋子
      setSelectedPiece({ row, col });
      setPossibleMoves(getPossibleMoves(row, col, piece));
    }
  };

  // 选择红黑方
  const handleSideSelection = (side: PieceType) => {
    if (gameStatus === GameStatus.PLAYING) {
      Modal.confirm({
        title: '确认切换',
        content: '游戏进行中，切换方色将重新开始游戏，是否继续？',
        onOk: () => {
          setPlayerSide(side);
          restartGame();
        }
      });
    } else {
      setPlayerSide(side);
    }
  };

  // 组件卸载时清理定时器
  useEffect(() => {
    return () => {
      clearTimers();
    };
  }, [clearTimers]);

  return (
    <div className="chess-game">
      <Row gutter={[24, 16]}>
        {/* 游戏控制面板 */}
        <Col span={24}>
          <Card className="game-control-panel">
            <Row align="middle" justify="space-between">
              <Col>
                <Space size="large">
                  <Button
                    type="primary"
                    icon={<PlayCircleOutlined />}
                    onClick={startGame}
                    disabled={gameStatus === GameStatus.PLAYING}
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
              
              <Col>
                <Space size="large">
                  <div>
                    <Text strong>选择方色：</Text>
                    <Select
                      value={playerSide}
                      onChange={handleSideSelection}
                      style={{ width: 120, marginLeft: 8 }}
                    >
                      <Option value={PieceType.RED}>红方</Option>
                      <Option value={PieceType.BLACK}>黑方</Option>
                    </Select>
                  </div>
                  
                  <div>
                    <Text strong>当前回合：</Text>
                    <Text style={{ 
                      color: currentPlayer === PieceType.RED ? '#ff4d4f' : '#000',
                      marginLeft: 8 
                    }}>
                      {currentPlayer === PieceType.RED ? '红方' : '黑方'}
                    </Text>
                  </div>
                </Space>
              </Col>
            </Row>
          </Card>
        </Col>

        {/* 游戏信息面板 */}
        <Col span={6}>
          <Space direction="vertical" size="large" style={{ width: '100%' }}>
            <Card title="时间信息" size="small">
              <Space direction="vertical" style={{ width: '100%' }}>
                <Statistic
                  title="总时间"
                  value={formatTime(totalTime)}
                  valueStyle={{ color: totalTime < 300 ? '#ff4d4f' : '#000' }}
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
                <Statistic title="红方步数" value={currentPlayer === PieceType.RED ? playerMoves : aiMoves} />
                <Statistic title="黑方步数" value={currentPlayer === PieceType.BLACK ? playerMoves : aiMoves} />
                <Statistic title="悔棋次数" value={`${undoCount}/${GAME_CONFIG.MAX_UNDO_COUNT}`} />
              </Space>
            </Card>
            
            {winner && (
              <Card title="游戏结果" size="small">
                <Text strong style={{ 
                  color: winner === PieceType.RED ? '#ff4d4f' : '#000',
                  fontSize: '16px'
                }}>
                  {winner === PieceType.RED ? '红方' : '黑方'} 获胜！
                </Text>
              </Card>
            )}
          </Space>
        </Col>

        {/* 棋盘区域 */}
        <Col span={18}>
          <Card className="chess-board-container">
            <div className="chess-board">
              {board.map((row, rowIndex) => (
                <div key={rowIndex} className="chess-row">
                  {row.map((piece, colIndex) => (
                    <div
                      key={`${rowIndex}-${colIndex}`}
                      className={`chess-cell ${
                        selectedPiece?.row === rowIndex && selectedPiece?.col === colIndex ? 'selected' : ''
                      } ${
                        possibleMoves.some(move => move.row === rowIndex && move.col === colIndex) ? 'possible-move' : ''
                      }`}
                      onClick={() => handlePieceClick(rowIndex, colIndex)}
                    >
                      {piece && (
                        <span className={`chess-piece ${
                          isPlayerPiece(piece) ? 'red-piece' : 'black-piece'
                        }`}>
                          {piece}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default ChessGame;
