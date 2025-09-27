import { create } from "zustand";
import { persist } from "zustand/middleware";

// 游戏类型
export type GameType = 'gobang' | 'chess' | 'tetris' | 'snake' | 'puzzle';

// 游戏难度
export type GameDifficulty = 'easy' | 'medium' | 'hard' | 'expert';

// 游戏记录接口
export interface GameRecord {
  id: string;
  gameType: GameType;
  difficulty: GameDifficulty;
  score: number;
  duration: number; // 游戏时长（秒）
  result: 'win' | 'lose' | 'draw';
  timestamp: number;
  moves?: number; // 步数（适用于某些游戏）
  level?: number; // 关卡（适用于某些游戏）
}

// 游戏统计接口
export interface GameStats {
  totalGames: number;
  totalWins: number;
  totalLoses: number;
  totalDraws: number;
  totalScore: number;
  totalDuration: number;
  bestScore: number;
  winRate: number;
  averageScore: number;
  averageDuration: number;
}

// 游戏设置接口
export interface GameSettings {
  soundEnabled: boolean;
  musicEnabled: boolean;
  animationEnabled: boolean;
  autoSave: boolean;
  difficulty: GameDifficulty;
  theme: 'default' | 'dark' | 'colorful';
}

// 游戏状态接口
interface GameStore {
  // 当前游戏状态
  currentGame: {
    type: GameType | null;
    isPlaying: boolean;
    isPaused: boolean;
    score: number;
    level: number;
    moves: number;
    startTime: number | null;
    duration: number;
  };
  
  // 游戏记录
  gameRecords: GameRecord[];
  
  // 游戏统计（按游戏类型分组）
  gameStats: Record<GameType, GameStats>;
  
  // 游戏设置
  gameSettings: GameSettings;
  
  // 排行榜
  leaderboard: Record<GameType, GameRecord[]>;
  
  // 操作方法 - 游戏控制
  startGame: (gameType: GameType, difficulty?: GameDifficulty) => void;
  pauseGame: () => void;
  resumeGame: () => void;
  endGame: (result: 'win' | 'lose' | 'draw') => void;
  resetGame: () => void;
  
  // 操作方法 - 游戏数据
  updateScore: (score: number) => void;
  updateLevel: (level: number) => void;
  updateMoves: (moves: number) => void;
  incrementMoves: () => void;
  
  // 操作方法 - 记录管理
  addGameRecord: (record: Omit<GameRecord, 'id' | 'timestamp'>) => void;
  clearGameRecords: (gameType?: GameType) => void;
  getGameRecords: (gameType?: GameType) => GameRecord[];
  
  // 操作方法 - 统计
  updateGameStats: (gameType: GameType) => void;
  getGameStats: (gameType: GameType) => GameStats;
  
  // 操作方法 - 设置
  updateGameSettings: (settings: Partial<GameSettings>) => void;
  
  // 操作方法 - 排行榜
  updateLeaderboard: (gameType: GameType, record: GameRecord) => void;
  getLeaderboard: (gameType: GameType, limit?: number) => GameRecord[];
}

// 默认游戏设置
const DEFAULT_GAME_SETTINGS: GameSettings = {
  soundEnabled: true,
  musicEnabled: true,
  animationEnabled: true,
  autoSave: true,
  difficulty: 'medium',
  theme: 'default',
};

// 默认游戏统计
const createDefaultStats = (): GameStats => ({
  totalGames: 0,
  totalWins: 0,
  totalLoses: 0,
  totalDraws: 0,
  totalScore: 0,
  totalDuration: 0,
  bestScore: 0,
  winRate: 0,
  averageScore: 0,
  averageDuration: 0,
});

export const useGameStore = create<GameStore>()(
  persist(
    (set, get) => ({
      // 初始状态
      currentGame: {
        type: null,
        isPlaying: false,
        isPaused: false,
        score: 0,
        level: 1,
        moves: 0,
        startTime: null,
        duration: 0,
      },
      
      gameRecords: [],
      
      gameStats: {
        gobang: createDefaultStats(),
        chess: createDefaultStats(),
        tetris: createDefaultStats(),
        snake: createDefaultStats(),
        puzzle: createDefaultStats(),
      },
      
      gameSettings: DEFAULT_GAME_SETTINGS,
      
      leaderboard: {
        gobang: [],
        chess: [],
        tetris: [],
        snake: [],
        puzzle: [],
      },

      // 游戏控制
      startGame: (gameType: GameType, difficulty = 'medium') => {
        set({
          currentGame: {
            type: gameType,
            isPlaying: true,
            isPaused: false,
            score: 0,
            level: 1,
            moves: 0,
            startTime: Date.now(),
            duration: 0,
          },
          gameSettings: {
            ...get().gameSettings,
            difficulty,
          },
        });
      },

      pauseGame: () => {
        const { currentGame } = get();
        if (currentGame.isPlaying && !currentGame.isPaused) {
          const now = Date.now();
          const duration = currentGame.startTime 
            ? currentGame.duration + (now - currentGame.startTime) / 1000
            : currentGame.duration;
          
          set({
            currentGame: {
              ...currentGame,
              isPaused: true,
              duration,
              startTime: null,
            },
          });
        }
      },

      resumeGame: () => {
        const { currentGame } = get();
        if (currentGame.isPlaying && currentGame.isPaused) {
          set({
            currentGame: {
              ...currentGame,
              isPaused: false,
              startTime: Date.now(),
            },
          });
        }
      },

      endGame: (result: 'win' | 'lose' | 'draw') => {
        const { currentGame, gameSettings } = get();
        if (!currentGame.type || !currentGame.isPlaying) return;

        const now = Date.now();
        const finalDuration = currentGame.startTime 
          ? currentGame.duration + (now - currentGame.startTime) / 1000
          : currentGame.duration;

        // 创建游戏记录
        const record: Omit<GameRecord, 'id' | 'timestamp'> = {
          gameType: currentGame.type,
          difficulty: gameSettings.difficulty,
          score: currentGame.score,
          duration: finalDuration,
          result,
          moves: currentGame.moves,
          level: currentGame.level,
        };

        // 添加记录
        get().addGameRecord(record);
        
        // 更新统计
        get().updateGameStats(currentGame.type);

        // 重置当前游戏状态
        set({
          currentGame: {
            type: null,
            isPlaying: false,
            isPaused: false,
            score: 0,
            level: 1,
            moves: 0,
            startTime: null,
            duration: 0,
          },
        });
      },

      resetGame: () => {
        const { currentGame } = get();
        if (currentGame.type) {
          set({
            currentGame: {
              ...currentGame,
              score: 0,
              level: 1,
              moves: 0,
              startTime: Date.now(),
              duration: 0,
              isPaused: false,
            },
          });
        }
      },

      // 游戏数据更新
      updateScore: (score: number) => {
        set((state) => ({
          currentGame: { ...state.currentGame, score },
        }));
      },

      updateLevel: (level: number) => {
        set((state) => ({
          currentGame: { ...state.currentGame, level },
        }));
      },

      updateMoves: (moves: number) => {
        set((state) => ({
          currentGame: { ...state.currentGame, moves },
        }));
      },

      incrementMoves: () => {
        set((state) => ({
          currentGame: { 
            ...state.currentGame, 
            moves: state.currentGame.moves + 1 
          },
        }));
      },

      // 记录管理
      addGameRecord: (record) => {
        const id = Date.now().toString();
        const timestamp = Date.now();
        const newRecord: GameRecord = { ...record, id, timestamp };
        
        set((state) => ({
          gameRecords: [newRecord, ...state.gameRecords],
        }));

        // 更新排行榜
        get().updateLeaderboard(record.gameType, newRecord);
      },

      clearGameRecords: (gameType) => {
        if (gameType) {
          set((state) => ({
            gameRecords: state.gameRecords.filter(r => r.gameType !== gameType),
          }));
        } else {
          set({ gameRecords: [] });
        }
      },

      getGameRecords: (gameType) => {
        const { gameRecords } = get();
        return gameType 
          ? gameRecords.filter(r => r.gameType === gameType)
          : gameRecords;
      },

      // 统计更新
      updateGameStats: (gameType) => {
        const records = get().getGameRecords(gameType);
        
        const stats: GameStats = {
          totalGames: records.length,
          totalWins: records.filter(r => r.result === 'win').length,
          totalLoses: records.filter(r => r.result === 'lose').length,
          totalDraws: records.filter(r => r.result === 'draw').length,
          totalScore: records.reduce((sum, r) => sum + r.score, 0),
          totalDuration: records.reduce((sum, r) => sum + r.duration, 0),
          bestScore: Math.max(...records.map(r => r.score), 0),
          winRate: 0,
          averageScore: 0,
          averageDuration: 0,
        };

        if (stats.totalGames > 0) {
          stats.winRate = (stats.totalWins / stats.totalGames) * 100;
          stats.averageScore = stats.totalScore / stats.totalGames;
          stats.averageDuration = stats.totalDuration / stats.totalGames;
        }

        set((state) => ({
          gameStats: {
            ...state.gameStats,
            [gameType]: stats,
          },
        }));
      },

      getGameStats: (gameType) => {
        return get().gameStats[gameType] || createDefaultStats();
      },

      // 设置更新
      updateGameSettings: (settings) => {
        set((state) => ({
          gameSettings: { ...state.gameSettings, ...settings },
        }));
      },

      // 排行榜
      updateLeaderboard: (gameType, record) => {
        set((state) => {
          const currentLeaderboard = state.leaderboard[gameType] || [];
          const newLeaderboard = [...currentLeaderboard, record]
            .sort((a, b) => b.score - a.score) // 按分数降序排列
            .slice(0, 100); // 只保留前100名

          return {
            leaderboard: {
              ...state.leaderboard,
              [gameType]: newLeaderboard,
            },
          };
        });
      },

      getLeaderboard: (gameType, limit = 10) => {
        const leaderboard = get().leaderboard[gameType] || [];
        return leaderboard.slice(0, limit);
      },
    }),
    {
      name: "game-storage",
      version: 1,
      // 不持久化当前游戏状态，只持久化记录和设置
      partialize: (state) => ({
        gameRecords: state.gameRecords,
        gameStats: state.gameStats,
        gameSettings: state.gameSettings,
        leaderboard: state.leaderboard,
      }),
    }
  )
);
