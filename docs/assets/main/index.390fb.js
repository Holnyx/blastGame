window.__require = function e(t, n, r) {
  function s(o, u) {
    if (!n[o]) {
      if (!t[o]) {
        var b = o.split("/");
        b = b[b.length - 1];
        if (!t[b]) {
          var a = "function" == typeof __require && __require;
          if (!u && a) return a(b, !0);
          if (i) return i(b, !0);
          throw new Error("Cannot find module '" + o + "'");
        }
        o = b;
      }
      var f = n[o] = {
        exports: {}
      };
      t[o][0].call(f.exports, function(e) {
        var n = t[o][1][e];
        return s(n || e);
      }, f, f.exports, e, t, n, r);
    }
    return n[o].exports;
  }
  var i = "function" == typeof __require && __require;
  for (var o = 0; o < r.length; o++) s(r[o]);
  return s;
}({
  BoardBuilder: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "84da6j1qGlG8KRIfULmvt3z", "BoardBuilder");
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.BoardBuilder = void 0;
    const PrefabCubeFactory_1 = require("../../components/factories/PrefabCubeFactory");
    const ZoneBlobIconProvider_1 = require("../resources/ZoneBlobIconProvider");
    const BoardFiller_1 = require("./BoardFiller");
    const NodeGrid_1 = require("./NodeGrid");
    const GridLayout_1 = require("../../core/board/GridLayout");
    class BoardBuilder {
      constructor(depend) {
        this.depend = depend;
      }
      build() {
        const {config: config, cubePrefab: cubePrefab, cubeIcons: cubeIcons, parent: parent, colorsLimit: colorsLimit} = this.depend;
        const layout = new GridLayout_1.GridLayout(config);
        const icons = new ZoneBlobIconProvider_1.ZoneBlobIconProvider(cubeIcons, {
          colorsLimit: colorsLimit
        });
        const factory = new PrefabCubeFactory_1.PrefabCubeFactory(cubePrefab, icons, layout, parent, config);
        const grid = new NodeGrid_1.NodeGrid(config.rows, config.cols);
        new BoardFiller_1.BoardFiller(grid, factory).fill();
        return {
          layout: layout,
          factory: factory,
          board: grid.toArray()
        };
      }
    }
    exports.BoardBuilder = BoardBuilder;
    cc._RF.pop();
  }, {
    "../../components/factories/PrefabCubeFactory": "PrefabCubeFactory",
    "../../core/board/GridLayout": "GridLayout",
    "../resources/ZoneBlobIconProvider": "ZoneBlobIconProvider",
    "./BoardFiller": "BoardFiller",
    "./NodeGrid": "NodeGrid"
  } ],
  BoardFiller: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "7b08e3iZDNPMbJIHciU3gcI", "BoardFiller");
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.BoardFiller = void 0;
    class BoardFiller {
      constructor(grid, factory) {
        this.grid = grid;
        this.factory = factory;
      }
      fill() {
        for (let r = 0; r < this.grid.rows; r++) for (let c = 0; c < this.grid.cols; c++) {
          const node = this.factory.create(r, c);
          this.grid.set(r, c, node);
        }
      }
    }
    exports.BoardFiller = BoardFiller;
    cc._RF.pop();
  }, {} ],
  BoardInstaller: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "1a69eaZi01OHaOnlw7JnaxF", "BoardInstaller");
    "use strict";
    var __decorate = this && this.__decorate || function(decorators, target, key, desc) {
      var c = arguments.length, r = c < 3 ? target : null === desc ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
      if ("object" === typeof Reflect && "function" === typeof Reflect.decorate) r = Reflect.decorate(decorators, target, key, desc); else for (var i = decorators.length - 1; i >= 0; i--) (d = decorators[i]) && (r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r);
      return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    const {ccclass: ccclass, property: property} = cc._decorator;
    const GameBoard_1 = require("../components/board/GameBoard");
    const ResultPanelView_1 = require("../components/panels/ResultPanelView");
    const BoardBuilder_1 = require("../infra/board/BoardBuilder");
    const BoardUtils_1 = require("../infra/board/BoardUtils");
    const ClusterSystem_1 = require("../infra/board/ClusterSystem");
    const TapHandlers_1 = require("../infra/input/TapHandlers");
    const GravitySystem_1 = require("../infra/systems/GravitySystem");
    const ShuffleSystem_1 = require("../infra/systems/ShuffleSystem");
    const GameStore_1 = require("../store/GameStore");
    const checkBoardState_1 = require("../app/checkBoardState");
    let BoardInstaller = class BoardInstaller extends cc.Component {
      constructor() {
        super(...arguments);
        this.store = null;
        this.board = null;
        this.resultPanel = null;
        this.runCheck = () => {
          checkBoardState_1.checkBoardState({
            isBoardAnimating: this.store.isBoardAnimating,
            isAutoShuffling: this.store.isAutoShuffling,
            gameEnded: this.store.gameEnded,
            score: this.store.score,
            scoreGoal: this.store.scoreGoalRO,
            movesLeft: this.store.movesLeft,
            autoShuffleLeft: this.store.autoShuffleLeft,
            resultPanel: this.store.resultPanel,
            cluster: this.cluster,
            shuffle: this.shuffle,
            endGame: () => {
              this.store.gameEnded = true;
            },
            setIsAutoShuffling: v => {
              this.store.isAutoShuffling = v;
            },
            decAutoShuffleLeft: () => {
              this.store.autoShuffleLeft = Math.max(0, this.store.autoShuffleLeft - 1);
            },
            showResult: win => {
              var _a;
              return null === (_a = this.store.resultPanel) || void 0 === _a ? void 0 : _a.show(win);
            }
          });
        };
      }
      start() {
        var _a, _b, _c, _d;
        if (!this.board.cubePrefab) {
          cc.error("Cube Prefab \u043d\u0435 \u043d\u0430\u0437\u043d\u0430\u0447\u0435\u043d.");
          return;
        }
        if (!(null === (_a = this.board.cubeIcons) || void 0 === _a ? void 0 : _a.length)) {
          cc.error("\u0421\u043f\u0438\u0441\u043e\u043a \u0438\u043a\u043e\u043d\u043e\u043a \u043f\u0443\u0441\u0442.");
          return;
        }
        const config = {
          rows: this.store.rows,
          cols: this.store.cols,
          cellSize: this.store.cellSize
        };
        const builder = new BoardBuilder_1.BoardBuilder({
          config: config,
          cubePrefab: this.board.cubePrefab,
          cubeIcons: this.board.cubeIcons,
          parent: this.board.node,
          colorsLimit: this.store.colorsLimit
        });
        const built = builder.build();
        this.board.attachBuilt(built);
        this.utils = new BoardUtils_1.BoardUtils(this.store);
        this.gravity = new GravitySystem_1.GravitySystem(this.board, this.store, this.utils);
        this.cluster = new ClusterSystem_1.ClusterSystem(this.board, this.utils, this.store);
        this.shuffle = new ShuffleSystem_1.ShuffleSystem(this.board, this.utils, this.store);
        this.taps = new TapHandlers_1.TapHandlers(this.board, this.gravity, this.store, this.cluster, this.utils);
        this.taps.installBubblingListener(this.board.node);
        this.store.resultPanel = null !== (_d = null !== (_b = this.resultPanel) && void 0 !== _b ? _b : null === (_c = cc.find("Canvas")) || void 0 === _c ? void 0 : _c.getComponentInChildren(ResultPanelView_1.ResultPanelView)) && void 0 !== _d ? _d : null;
        this.store.initLevelState();
        this.board.onBoardStabilized = this.runCheck;
        this.scheduleOnce(this.runCheck, 0);
        cc.game.setFrameRate(60);
      }
    };
    __decorate([ property(GameStore_1.GameStore) ], BoardInstaller.prototype, "store", void 0);
    __decorate([ property(GameBoard_1.GameBoard) ], BoardInstaller.prototype, "board", void 0);
    __decorate([ property(ResultPanelView_1.ResultPanelView) ], BoardInstaller.prototype, "resultPanel", void 0);
    BoardInstaller = __decorate([ ccclass ], BoardInstaller);
    exports.default = BoardInstaller;
    cc._RF.pop();
  }, {
    "../app/checkBoardState": "checkBoardState",
    "../components/board/GameBoard": "GameBoard",
    "../components/panels/ResultPanelView": "ResultPanelView",
    "../infra/board/BoardBuilder": "BoardBuilder",
    "../infra/board/BoardUtils": "BoardUtils",
    "../infra/board/ClusterSystem": "ClusterSystem",
    "../infra/input/TapHandlers": "TapHandlers",
    "../infra/systems/GravitySystem": "GravitySystem",
    "../infra/systems/ShuffleSystem": "ShuffleSystem",
    "../store/GameStore": "GameStore"
  } ],
  BoardUtils: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "370db+C+AVFA5+3S3KLGAfg", "BoardUtils");
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.BoardUtils = void 0;
    const CubeSelect_1 = require("../../components/cube/CubeSelect");
    class BoardUtils {
      constructor(gameBoard) {
        this.gameBoard = gameBoard;
      }
      colorOf(node) {
        var _a, _b;
        return null !== (_b = null === (_a = node.getComponent(CubeSelect_1.CubeSelect)) || void 0 === _a ? void 0 : _a.colorKey) && void 0 !== _b ? _b : "";
      }
      getCell(node) {
        const row = node.__row;
        const col = node.__col;
        return Number.isInteger(row) && Number.isInteger(col) ? {
          row: row,
          col: col
        } : null;
      }
      setCell(node, row, col) {
        const gridNode = node;
        gridNode.__row = row;
        gridNode.__col = col;
      }
      neighbors4(row, col) {
        const out = [];
        row > 0 && out.push({
          row: row - 1,
          col: col
        });
        row < this.gameBoard.rows - 1 && out.push({
          row: row + 1,
          col: col
        });
        col > 0 && out.push({
          row: row,
          col: col - 1
        });
        col < this.gameBoard.cols - 1 && out.push({
          row: row,
          col: col + 1
        });
        return out;
      }
    }
    exports.BoardUtils = BoardUtils;
    cc._RF.pop();
  }, {
    "../../components/cube/CubeSelect": "CubeSelect"
  } ],
  ClusterSystem: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "5a23aLaMwZAjYSaPuXnxmQ4", "ClusterSystem");
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.ClusterSystem = void 0;
    class ClusterSystem {
      constructor(gameBoard, utils, store) {
        this.gameBoard = gameBoard;
        this.utils = utils;
        this.store = store;
      }
      countComponent(startRow, startCol, key, out) {
        var _a;
        const rows = this.store.rows;
        const cols = this.store.cols;
        const board = this.gameBoard.board;
        const colorOf = node => this.utils.colorOf(node);
        const start = null === (_a = board[startRow]) || void 0 === _a ? void 0 : _a[startCol];
        const seen = new Uint8Array(rows * cols);
        const queue = [ {
          row: startRow,
          col: startCol
        } ];
        const indexOf = (row, col) => row * cols + col;
        let count = 0;
        if (!start || colorOf(start) !== key) return 0;
        seen[indexOf(startRow, startCol)] = 1;
        for (let i = 0; i < queue.length; i++) {
          const {row: row, col: col} = queue[i];
          null === out || void 0 === out ? void 0 : out.push({
            row: row,
            col: col
          });
          count++;
          for (const neighbor of this.utils.neighbors4(row, col)) {
            const neighborRow = neighbor.row;
            const neighborCol = neighbor.col;
            const node = board[neighborRow][neighborCol];
            const k = indexOf(neighborRow, neighborCol);
            if (seen[k]) continue;
            if (!node || colorOf(node) !== key) continue;
            seen[k] = 1;
            queue.push({
              row: neighborRow,
              col: neighborCol
            });
          }
        }
        return count;
      }
      collectCluster(start) {
        const colorOf = node => this.utils.colorOf(node);
        const getCell = node => this.utils.getCell(node);
        const neighbors = (row, col) => this.utils.neighbors4(row, col);
        const key = colorOf(start);
        const res = [];
        const seen = new Set([ start ]);
        const queue = [ start ];
        if (!key) return [ start ];
        for (let i = 0; i < queue.length; i++) {
          const node = queue[i];
          res.push(node);
          const {row: row, col: col} = getCell(node);
          for (const cell of neighbors(row, col)) {
            const {row: row, col: col} = cell;
            const node = this.gameBoard.board[row][col];
            if (!node || seen.has(node) || colorOf(node) !== key) continue;
            seen.add(node);
            queue.push(node);
          }
        }
        return res;
      }
      hasAnyMove() {
        const need = Math.max(3, 0 | this.store.minCluster);
        const rows = this.store.rows;
        const cols = this.store.cols;
        const processed = Array.from({
          length: rows
        }, () => Array(cols).fill(false));
        for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) {
          if (processed[r][c]) continue;
          const node = this.gameBoard.board[r][c];
          const key = this.utils.colorOf(node);
          if (!node) {
            processed[r][c] = true;
            continue;
          }
          if (!key) {
            processed[r][c] = true;
            continue;
          }
          const comp = [];
          const count = this.countComponent(r, c, key, comp);
          for (const p of comp) processed[p.row][p.col] = true;
          if (count >= need) return true;
        }
        return false;
      }
    }
    exports.ClusterSystem = ClusterSystem;
    cc._RF.pop();
  }, {} ],
  CubeSelect: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "255b00sPGdGpqcA8sPPX44H", "CubeSelect");
    "use strict";
    var __decorate = this && this.__decorate || function(decorators, target, key, desc) {
      var c = arguments.length, r = c < 3 ? target : null === desc ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
      if ("object" === typeof Reflect && "function" === typeof Reflect.decorate) r = Reflect.decorate(decorators, target, key, desc); else for (var i = decorators.length - 1; i >= 0; i--) (d = decorators[i]) && (r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r);
      return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    var CubeSelect_1;
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.CubeSelect = void 0;
    const {ccclass: ccclass} = cc._decorator;
    let CubeSelect = CubeSelect_1 = class CubeSelect extends cc.Component {
      constructor() {
        super(...arguments);
        this.colorKey = "";
        this.target = null;
        this.onTap = e => {
          const event = new cc.Event.EventCustom(CubeSelect_1.Events.TAP, true);
          event.setUserData({
            node: this.node,
            component: this,
            native: e
          });
          this.node.dispatchEvent(event);
        };
      }
      onEnable() {
        this.target = this.node;
        this.target.on(cc.Node.EventType.TOUCH_END, this.onTap, this);
      }
      onDisable() {
        this.target.off(cc.Node.EventType.TOUCH_END, this.onTap, this);
      }
    };
    CubeSelect.Events = {
      TAP: "cube:tap",
      SELECTED: "cube:selected",
      DESELECTED: "cube:deselected"
    };
    CubeSelect = CubeSelect_1 = __decorate([ ccclass ], CubeSelect);
    exports.CubeSelect = CubeSelect;
    cc._RF.pop();
  }, {} ],
  GameBoard: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "544fbAZ3DBHYpMujV+Kbihg", "GameBoard");
    "use strict";
    var __decorate = this && this.__decorate || function(decorators, target, key, desc) {
      var c = arguments.length, r = c < 3 ? target : null === desc ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
      if ("object" === typeof Reflect && "function" === typeof Reflect.decorate) r = Reflect.decorate(decorators, target, key, desc); else for (var i = decorators.length - 1; i >= 0; i--) (d = decorators[i]) && (r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r);
      return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.GameBoard = void 0;
    const {ccclass: ccclass, property: property} = cc._decorator;
    const GameStore_1 = require("../../store/GameStore");
    let GameBoard = class GameBoard extends cc.Component {
      constructor() {
        super(...arguments);
        this.cubePrefab = null;
        this.cubeIcons = [];
        this.store = null;
        this.shuffleCount = 0;
        this.board = [];
        this.factory = null;
      }
      start() {
        var _a;
        if (!this.cubePrefab) {
          cc.error("Cube Prefab \u043d\u0435 \u0443\u0441\u0442\u0430\u043d\u043e\u0432\u043b\u0435\u043d");
          return;
        }
        if (!(null === (_a = this.cubeIcons) || void 0 === _a ? void 0 : _a.length)) {
          cc.error("\u0421\u043f\u0438\u0441\u043e\u043a \u0438\u043a\u043e\u043d\u043e\u043a \u043f\u0443\u0441\u0442");
          return;
        }
      }
      attachBuilt(value) {
        this.board = value.board;
        this.layout = value.layout;
        this.factory = value.factory;
      }
    };
    __decorate([ property(cc.Prefab) ], GameBoard.prototype, "cubePrefab", void 0);
    __decorate([ property([ cc.SpriteFrame ]) ], GameBoard.prototype, "cubeIcons", void 0);
    __decorate([ property(GameStore_1.GameStore) ], GameBoard.prototype, "store", void 0);
    GameBoard = __decorate([ ccclass ], GameBoard);
    exports.GameBoard = GameBoard;
    cc._RF.pop();
  }, {
    "../../store/GameStore": "GameStore"
  } ],
  GameStore: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "c22bd5WJ05OxIemmwGxAQJk", "GameStore");
    "use strict";
    var __decorate = this && this.__decorate || function(decorators, target, key, desc) {
      var c = arguments.length, r = c < 3 ? target : null === desc ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
      if ("object" === typeof Reflect && "function" === typeof Reflect.decorate) r = Reflect.decorate(decorators, target, key, desc); else for (var i = decorators.length - 1; i >= 0; i--) (d = decorators[i]) && (r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r);
      return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.GameStore = void 0;
    const {ccclass: ccclass, property: property} = cc._decorator;
    const gameState_1 = require("../app/gameState");
    let GameStore = class GameStore extends cc.Component {
      constructor() {
        super(...arguments);
        this.rows = 9;
        this.cols = 9;
        this.cellSize = 100;
        this.minCluster = 3;
        this.totalMoves = 25;
        this.scoreGoal = 500;
        this.shuffleDuration = .25;
        this.shuffleCountStart = 3;
        this.colorsLimit = 5;
        this.autoShuffleLeft = 0;
        this.fallDurationPerCell = .06;
        this.isAutoShuffling = false;
        this.gameEnded = false;
        this.isBoardAnimating = false;
      }
      get movesLeft() {
        return gameState_1.gameState.moves;
      }
      get score() {
        return gameState_1.gameState.score;
      }
      get scoreGoalRO() {
        return gameState_1.gameState.goal;
      }
      set movesLeft(value) {
        gameState_1.gameState.setMoves(0 | value);
      }
      set score(value) {
        gameState_1.gameState.setScore(0 | value);
      }
      initLevelState() {
        this.score = 0;
        this.movesLeft = this.totalMoves;
        gameState_1.gameState.setGoal(this.scoreGoal);
        this.gameEnded = false;
        this.isBoardAnimating = false;
        this.isAutoShuffling = false;
        this.autoShuffleLeft = Math.max(0, 0 | this.shuffleCountStart);
      }
    };
    __decorate([ property ], GameStore.prototype, "rows", void 0);
    __decorate([ property ], GameStore.prototype, "cols", void 0);
    __decorate([ property ], GameStore.prototype, "cellSize", void 0);
    __decorate([ property ], GameStore.prototype, "minCluster", void 0);
    __decorate([ property ], GameStore.prototype, "totalMoves", void 0);
    __decorate([ property ], GameStore.prototype, "scoreGoal", void 0);
    __decorate([ property ], GameStore.prototype, "shuffleDuration", void 0);
    __decorate([ property ], GameStore.prototype, "shuffleCountStart", void 0);
    __decorate([ property({
      type: cc.Integer,
      range: [ 1, 5, 1 ],
      slide: true
    }) ], GameStore.prototype, "colorsLimit", void 0);
    GameStore = __decorate([ ccclass ], GameStore);
    exports.GameStore = GameStore;
    cc._RF.pop();
  }, {
    "../app/gameState": "gameState"
  } ],
  GravitySystem: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "42cf4OEPshA9LUVA65I3I1o", "GravitySystem");
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.GravitySystem = void 0;
    const animations_1 = require("../animation/animations");
    class GravitySystem {
      constructor(gameBoard, store, utils, onSpawn) {
        this.gameBoard = gameBoard;
        this.store = store;
        this.utils = utils;
        this.onSpawn = onSpawn;
      }
      get rows() {
        return this.gameBoard.board.length;
      }
      get cols() {
        var _a, _b;
        return null !== (_b = null === (_a = this.gameBoard.board[0]) || void 0 === _a ? void 0 : _a.length) && void 0 !== _b ? _b : 0;
      }
      gravityParams() {
        const rows = this.rows;
        const layout = this.gameBoard.layout;
        const y0 = layout.cellPosition(0, 0).y;
        const y1 = layout.cellPosition(1, 0).y;
        const downIsIncreasing = y1 < y0;
        const bottom = downIsIncreasing ? rows - 1 : 0;
        const top = downIsIncreasing ? 0 : rows - 1;
        const step = downIsIncreasing ? -1 : 1;
        return {
          downIsIncreasing: downIsIncreasing,
          bottom: bottom,
          top: top,
          step: step
        };
      }
      applyGravityAndFill() {
        var _a;
        this.store.isBoardAnimating = true;
        const {bottom: bottom, top: top, step: step} = this.gravityParams();
        const board = this.gameBoard.board;
        const layout = this.gameBoard.layout;
        const factory = this.gameBoard.factory;
        const cols = this.cols;
        const last = top + step;
        const PAD = .2;
        const SAFETY = 1;
        const fall = (node, toRow, col) => {
          const position = layout.cellPosition(toRow, col);
          animations_1.animation(node, position, {
            duration: PAD,
            easing: "quadIn",
            bringToFront: true
          });
        };
        for (let col = 0; col < cols; col++) {
          let write = bottom;
          for (let row = bottom; row !== last; row += step) {
            const node = board[row][col];
            if (!node) continue;
            if (row !== write) {
              board[row][col] = null;
              board[write][col] = node;
              node.__row = write;
              node.__col = col;
              fall(node, write, col);
            }
            node.zIndex = 0;
            write += step;
          }
          for (let row = write; row !== last; row += step) {
            const node = factory.create(row, col);
            this.utils.setCell(node, row, col);
            board[row][col] = node;
            null === (_a = this.onSpawn) || void 0 === _a ? void 0 : _a.call(this, node);
          }
        }
        this.gameBoard.scheduleOnce(() => {
          var _a, _b;
          this.store.isBoardAnimating = false;
          null === (_b = (_a = this.gameBoard).onBoardStabilized) || void 0 === _b ? void 0 : _b.call(_a);
        }, SAFETY);
      }
    }
    exports.GravitySystem = GravitySystem;
    cc._RF.pop();
  }, {
    "../animation/animations": "animations"
  } ],
  GridLayout: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "24526Cs2RlAuaAjU8Y2zKK6", "GridLayout");
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.GridLayout = void 0;
    class GridLayout {
      constructor(config) {
        this.config = config;
      }
      cellPosition(row, col) {
        const totalW = this.config.cols * this.config.cellSize;
        const totalH = this.config.rows * this.config.cellSize;
        const startX = -totalW / 2 + this.config.cellSize / 2;
        const startY = -totalH / 2 + this.config.cellSize / 2;
        const x = startX + col * this.config.cellSize;
        const y = startY + row * this.config.cellSize;
        return cc.v2(x, y);
      }
    }
    exports.GridLayout = GridLayout;
    cc._RF.pop();
  }, {} ],
  IBoardConfig: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "20c35NoneZDOY/yX2VzK7XB", "IBoardConfig");
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    cc._RF.pop();
  }, {} ],
  ICluster: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "e072cYsWPNPtZvw2zkw1gC0", "ICluster");
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    cc._RF.pop();
  }, {} ],
  IConfig: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "71d8e8TRsxF0aFsk26f9U3E", "IConfig");
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    cc._RF.pop();
  }, {} ],
  ICubeFactory: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "a5b3fA+VE9Ilob9Ar9EMmLx", "ICubeFactory");
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    cc._RF.pop();
  }, {} ],
  IGameRuntime: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "f03b9JPP/ZHfp0VKUUfCj/T", "IGameRuntime");
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    cc._RF.pop();
  }, {} ],
  IGravityStore: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "21c722F5z1ArYTPZIPlP3PI", "IGravityStore");
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    cc._RF.pop();
  }, {} ],
  IGravitySystem: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "953f0MtiX9B97o3FlNsnZW6", "IGravitySystem");
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    cc._RF.pop();
  }, {} ],
  IGravity: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "c0552xWlmxL0ZPkCzPPcAdT", "IGravity");
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    cc._RF.pop();
  }, {} ],
  ITapEvent: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "b5a317tSWJM3Z5L5TmgSGln", "ITapEvent");
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    cc._RF.pop();
  }, {} ],
  IUtils: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "3d824ioFY1P4qp0mceLAby8", "IUtils");
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    cc._RF.pop();
  }, {} ],
  MovesCount: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "c73dbiM3XFDLL2d3SAfRvOD", "MovesCount");
    "use strict";
    var __decorate = this && this.__decorate || function(decorators, target, key, desc) {
      var c = arguments.length, r = c < 3 ? target : null === desc ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
      if ("object" === typeof Reflect && "function" === typeof Reflect.decorate) r = Reflect.decorate(decorators, target, key, desc); else for (var i = decorators.length - 1; i >= 0; i--) (d = decorators[i]) && (r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r);
      return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.MovesCount = void 0;
    const gameEvents_1 = require("../../infra/events/gameEvents");
    const {ccclass: ccclass} = cc._decorator;
    let MovesCount = class MovesCount extends cc.Component {
      constructor() {
        super(...arguments);
        this.label = null;
        this.movesLeft = 0;
      }
      onLoad() {
        this.label = this.getComponent(cc.Label);
        this.label ? this.render() : cc.error("[MovesCount] \u041d\u0430 \u0442\u043e\u0439 \u0436\u0435 \u043d\u043e\u0434\u0435 \u0434\u043e\u043b\u0436\u0435\u043d \u0431\u044b\u0442\u044c cc.Label");
      }
      onEnable() {
        gameEvents_1.bus.on(gameEvents_1.GameEvent.MovesChanged, this.onMovesChanged, this);
      }
      onDisable() {
        gameEvents_1.bus.off(gameEvents_1.GameEvent.MovesChanged, this.onMovesChanged, this);
      }
      onMovesChanged(value) {
        this.movesLeft = value;
        this.render();
      }
      render() {
        if (!this.label) return;
        this.label && (this.label.string = String(this.movesLeft));
      }
    };
    MovesCount = __decorate([ ccclass ], MovesCount);
    exports.MovesCount = MovesCount;
    cc._RF.pop();
  }, {
    "../../infra/events/gameEvents": "gameEvents"
  } ],
  NodeGrid: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "8fde0Ko7dhHq6uApFgB00Za", "NodeGrid");
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.NodeGrid = void 0;
    class NodeGrid {
      constructor(rows, cols) {
        this.rows = rows;
        this.cols = cols;
        this.grid = Array.from({
          length: rows
        }, () => new Array(cols));
      }
      set(row, col, node) {
        this.grid[row][col] = node;
      }
      get(row, col) {
        return this.grid[row][col];
      }
      toArray() {
        return this.grid.map(row => row.slice());
      }
    }
    exports.NodeGrid = NodeGrid;
    cc._RF.pop();
  }, {} ],
  PrefabCubeFactory: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "bbec7NVQS9D66H0RaUI1/Ow", "PrefabCubeFactory");
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.PrefabCubeFactory = void 0;
    const animations_1 = require("../../infra/animation/animations");
    const CubeSelect_1 = require("../cube/CubeSelect");
    class PrefabCubeFactory {
      constructor(prefab, icons, layout, parent, config) {
        this.prefab = prefab;
        this.icons = icons;
        this.layout = layout;
        this.parent = parent;
        this.config = config;
      }
      ensureSprite(cube) {
        const iconNode = new cc.Node("Icon");
        cube.addChild(iconNode);
        return iconNode.getComponent(cc.Sprite) || iconNode.addComponent(cc.Sprite);
      }
      create(row, col) {
        var _a;
        const cube = cc.instantiate(this.prefab);
        cube.setContentSize(this.config.cellSize, this.config.cellSize);
        cube.zIndex = 0;
        this.parent.addChild(cube);
        const sprite = this.ensureSprite(cube);
        sprite.spriteFrame = this.icons.random();
        sprite.sizeMode = cc.Sprite.SizeMode.RAW;
        const select = null !== (_a = cube.getComponent(CubeSelect_1.CubeSelect)) && void 0 !== _a ? _a : cube.addComponent(CubeSelect_1.CubeSelect);
        select.colorKey = sprite.spriteFrame ? sprite.spriteFrame.name : "";
        cube.__row = row;
        cube.__col = col;
        const target = this.layout.cellPosition(row, col);
        animations_1.animation(cube, target, .02 * (row + col));
        return cube;
      }
    }
    exports.PrefabCubeFactory = PrefabCubeFactory;
    cc._RF.pop();
  }, {
    "../../infra/animation/animations": "animations",
    "../cube/CubeSelect": "CubeSelect"
  } ],
  ResultPanelView: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "ab4d8iRcepHH7AgD+Cf9qS7", "ResultPanelView");
    "use strict";
    var __decorate = this && this.__decorate || function(decorators, target, key, desc) {
      var c = arguments.length, r = c < 3 ? target : null === desc ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
      if ("object" === typeof Reflect && "function" === typeof Reflect.decorate) r = Reflect.decorate(decorators, target, key, desc); else for (var i = decorators.length - 1; i >= 0; i--) (d = decorators[i]) && (r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r);
      return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.ResultPanelView = void 0;
    const {ccclass: ccclass, property: property} = cc._decorator;
    const animations_1 = require("../../infra/animation/animations");
    let ResultPanelView = class ResultPanelView extends cc.Component {
      constructor() {
        super(...arguments);
        this.container = null;
        this.titleLabel = null;
        this.victoryTitle = "\u041f\u043e\u0431\u0435\u0434\u0430";
        this.defeatTitle = "\u041f\u043e\u0440\u0430\u0436\u0435\u043d\u0438\u0435";
      }
      ensureInit() {
        this.container && cc.isValid(this.container) || (this.container = this.node);
        this.container.getComponent(cc.BlockInputEvents) || this.container.addComponent(cc.BlockInputEvents);
      }
      show(isWin) {
        this.ensureInit();
        this.titleLabel && (this.titleLabel.string = isWin ? this.victoryTitle : this.defeatTitle);
        const parent = this.container.parent;
        parent && this.container.setSiblingIndex(parent.childrenCount - 1);
        animations_1.animation(this.container, "show");
      }
      hide() {
        this.ensureInit();
        if (!this.container.active) return;
        animations_1.animation(this.container, "hide");
      }
      onRestartClicked() {
        var _a;
        const scene = null === (_a = cc.director.getScene()) || void 0 === _a ? void 0 : _a.name;
        scene && cc.director.loadScene(scene);
      }
    };
    __decorate([ property({
      type: cc.Node
    }) ], ResultPanelView.prototype, "container", void 0);
    __decorate([ property({
      type: cc.Label
    }) ], ResultPanelView.prototype, "titleLabel", void 0);
    __decorate([ property ], ResultPanelView.prototype, "victoryTitle", void 0);
    __decorate([ property ], ResultPanelView.prototype, "defeatTitle", void 0);
    ResultPanelView = __decorate([ ccclass ], ResultPanelView);
    exports.ResultPanelView = ResultPanelView;
    cc._RF.pop();
  }, {
    "../../infra/animation/animations": "animations"
  } ],
  ScoreCount: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "08044ZVn5VD0JDvUzc2qup8", "ScoreCount");
    "use strict";
    var __decorate = this && this.__decorate || function(decorators, target, key, desc) {
      var c = arguments.length, r = c < 3 ? target : null === desc ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
      if ("object" === typeof Reflect && "function" === typeof Reflect.decorate) r = Reflect.decorate(decorators, target, key, desc); else for (var i = decorators.length - 1; i >= 0; i--) (d = decorators[i]) && (r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r);
      return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.ScoreCount = void 0;
    const {ccclass: ccclass} = cc._decorator;
    const gameEvents_1 = require("../../infra/events/gameEvents");
    const gameState_1 = require("../../app/gameState");
    let ScoreCount = class ScoreCount extends cc.Component {
      constructor() {
        super(...arguments);
        this.label = null;
        this.score = 0;
        this.goal = 0;
        this.onScore = n => {
          this.score = n;
          this.render();
        };
        this.onGoal = g => {
          this.goal = g;
          this.render();
        };
      }
      onLoad() {
        this.label = this.getComponent(cc.Label);
        this.score = gameState_1.gameState.score;
        this.goal = gameState_1.gameState.goal;
        this.render();
      }
      onEnable() {
        gameEvents_1.bus.on(gameEvents_1.GameEvent.ScoreChanged, this.onScore, this);
        gameEvents_1.bus.on(gameEvents_1.GameEvent.ScoreGoalChanged, this.onGoal, this);
      }
      onDisable() {
        gameEvents_1.bus.off(gameEvents_1.GameEvent.ScoreChanged, this.onScore, this);
        gameEvents_1.bus.off(gameEvents_1.GameEvent.ScoreGoalChanged, this.onGoal, this);
      }
      render() {
        if (!this.label) return;
        this.label.string = `${this.score}/${this.goal}`;
      }
    };
    ScoreCount = __decorate([ ccclass ], ScoreCount);
    exports.ScoreCount = ScoreCount;
    cc._RF.pop();
  }, {
    "../../app/gameState": "gameState",
    "../../infra/events/gameEvents": "gameEvents"
  } ],
  ShuffleSystem: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "3efee2TjLxMbK8HNANf/WNj", "ShuffleSystem");
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.ShuffleSystem = void 0;
    const fisherYates_1 = require("../../core/board/shuffle/fisherYates");
    const animations_1 = require("../animation/animations");
    class ShuffleSystem {
      constructor(gameBoard, utils, store) {
        this.gameBoard = gameBoard;
        this.utils = utils;
        this.store = store;
      }
      shuffleBoard(done) {
        if (this.store.isBoardAnimating) return null === done || void 0 === done ? void 0 : done(false);
        this.store.isBoardAnimating = true;
        const {rows: rows, cols: cols, cellSize: cellSize, shuffleDuration: shuffleDuration} = this.store;
        const {layout: layout} = this.gameBoard;
        const board = this.gameBoard.board;
        const cells = [];
        for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) {
          const node = board[r][c];
          node && cells.push({
            node: node,
            row: r,
            col: c,
            color: this.utils.colorOf(node)
          });
        }
        if (!cells.length) {
          this.store.isBoardAnimating = false;
          return;
        }
        const targets = cells.map(({row: row, col: col}) => ({
          row: row,
          col: col
        }));
        fisherYates_1.fisherYates(targets);
        for (let i = 0; i < cells.length; i++) {
          const node = cells[i].node;
          const {row: row, col: col} = targets[i];
          const position = layout.cellPosition(row, col);
          const durationX = node.x - position.x;
          const durationY = node.y - position.y;
          const dist = Math.sqrt(durationX * durationX + durationY * durationY);
          const duration = Math.max(.12, Math.min(shuffleDuration, dist / (10 * cellSize)));
          node.zIndex = row * cols + col;
          animations_1.animation(node, position, {
            duration: duration,
            easing: "quadInOut"
          });
          this.utils.setCell(node, row, col);
          board[row][col] = node;
        }
        this.gameBoard.scheduleOnce(() => {
          this.store.isBoardAnimating = false;
          null === done || void 0 === done ? void 0 : done(true);
        }, .02);
      }
    }
    exports.ShuffleSystem = ShuffleSystem;
    cc._RF.pop();
  }, {
    "../../core/board/shuffle/fisherYates": "fisherYates",
    "../animation/animations": "animations"
  } ],
  TapHandlers: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "73762KulHJODpG857VUu0hi", "TapHandlers");
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.TapHandlers = void 0;
    const animations_1 = require("../animation/animations");
    const gameState_1 = require("../../app/gameState");
    const CubeSelect_1 = require("../../components/cube/CubeSelect");
    class TapHandlers {
      constructor(gameBoard, gravity, store, cluster, utils) {
        this.gameBoard = gameBoard;
        this.gravity = gravity;
        this.store = store;
        this.cluster = cluster;
        this.utils = utils;
      }
      installBubblingListener(boardRoot) {
        var _a;
        const event = (null === (_a = CubeSelect_1.CubeSelect.Events) || void 0 === _a ? void 0 : _a.TAP) || "cube:tap";
        boardRoot.on(event, event => {
          const data = event.getUserData && event.getUserData();
          const cube = (null === data || void 0 === data ? void 0 : data.node) || event.target;
          cube && this.onCubeTap(cube);
        }, this);
      }
      onCubeTap(cube) {
        if (this.store.isBoardAnimating) return;
        if (gameState_1.gameState.moves <= 0) return;
        const need = Math.max(2, 0 | this.store.minCluster);
        const speedAnimation = .22;
        const finishAfterGravity = () => {
          this.gravity.applyGravityAndFill();
        };
        const cluster = this.cluster.collectCluster(cube);
        if (cluster.length < need) return;
        const add = 10 + 5 * (cluster.length - 3);
        gameState_1.gameState.addScore(add);
        gameState_1.gameState.setMoves(gameState_1.gameState.moves - 1);
        this.store.isBoardAnimating = true;
        let pending = cluster.length;
        cluster.forEach((node, i) => {
          var _a;
          const cell = this.utils.getCell(node);
          cell && (null === (_a = this.gameBoard.board[cell.row]) || void 0 === _a ? void 0 : _a[cell.col]) === node && (this.gameBoard.board[cell.row][cell.col] = null);
          animations_1.animation(node, "vanish", {
            duration: speedAnimation,
            delay: .01 * i,
            easing: "quadIn",
            remove: true,
            onComplete: () => {
              0 === --pending && finishAfterGravity();
            }
          });
        });
        0 === pending && finishAfterGravity();
      }
    }
    exports.TapHandlers = TapHandlers;
    cc._RF.pop();
  }, {
    "../../app/gameState": "gameState",
    "../../components/cube/CubeSelect": "CubeSelect",
    "../animation/animations": "animations"
  } ],
  ZoneBlobIconProvider: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "a6430f6SLxKx5LRcBT1BhOe", "ZoneBlobIconProvider");
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.ZoneBlobIconProvider = void 0;
    class ZoneBlobIconProvider {
      constructor(allIcons, opts) {
        var _a;
        const maxWanted = null !== (_a = opts.colorsLimit) && void 0 !== _a ? _a : allIcons.length;
        this.limit = Math.max(1, Math.min(allIcons.length, maxWanted));
        this.icons = allIcons.slice(0, this.limit);
      }
      random() {
        const i = Math.floor(Math.random() * this.limit);
        return this.icons[i];
      }
    }
    exports.ZoneBlobIconProvider = ZoneBlobIconProvider;
    cc._RF.pop();
  }, {} ],
  animations: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "a7fadstm6hHyKPxvUThjsq8", "animations");
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.animation = void 0;
    function animation(node, arg1, arg2) {
      var _a, _b, _c, _d, _e, _f, _g, _h;
      const isVec2 = arg1 && "object" === typeof arg1 && "number" === typeof arg1.x && "number" === typeof arg1.y;
      cc.Tween.stopAllByTarget(node);
      if (isVec2) {
        const to = arg1;
        if ("number" === typeof arg2 || void 0 === arg2) {
          const delay = "number" === typeof arg2 ? arg2 : 0;
          node.setPosition(to.x, to.y + 600);
          cc.tween(node).delay(delay).to(.8, {
            position: to
          }, {
            easing: "bounceOut"
          }).start();
          return;
        }
        if ("object" === typeof arg2) {
          const duration = null !== (_a = arg2.duration) && void 0 !== _a ? _a : .6;
          const easing = null !== (_b = arg2.easing) && void 0 !== _b ? _b : "quadIn";
          cc.tween(node).to(duration, {
            x: to.x,
            y: to.y
          }, {
            easing: easing
          }).start();
          return;
        }
      }
      if ("string" === typeof arg1) {
        if ("show" === arg1) {
          const options = arg2 || {};
          const easing = null !== (_c = options.easing) && void 0 !== _c ? _c : "quadOut";
          const activate = null === (_d = options.activate) || void 0 === _d || _d;
          activate && (node.active = true);
          cc.tween(node).to(.18, {
            opacity: 255,
            scale: 1
          }, {
            easing: easing
          }).start();
          return;
        }
        if ("hide" === arg1) {
          cc.tween(node).to(.12, {
            opacity: 0,
            scale: .98
          }, {
            easing: "quadIn"
          }).call(() => node.active = false).start();
          return;
        }
        if ("vanish" === arg1) {
          const obj = arg2 || {};
          const duration = null !== (_e = obj.duration) && void 0 !== _e ? _e : .22;
          const delay = null !== (_f = obj.delay) && void 0 !== _f ? _f : 0;
          const easing = null !== (_g = obj.easing) && void 0 !== _g ? _g : "quadIn";
          const remove = null === (_h = obj.remove) || void 0 === _h || _h;
          cc.tween(node).delay(delay).parallel(cc.tween().to(duration, {
            scale: 0
          }, {
            easing: easing
          }), cc.tween().to(duration, {
            opacity: 0
          }, {
            easing: easing
          })).call(() => {
            var _a;
            remove && node.removeFromParent();
            null === (_a = obj.onComplete) || void 0 === _a ? void 0 : _a.call(obj);
          }).start();
          return;
        }
      }
    }
    exports.animation = animation;
    cc._RF.pop();
  }, {} ],
  checkBoardState: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "5c6efm+1olFAIkmoqBOemXV", "checkBoardState");
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.checkBoardState = void 0;
    function checkBoardState(context) {
      if (context.isBoardAnimating || context.isAutoShuffling || context.gameEnded) return;
      if (context.score >= context.scoreGoal) {
        context.showResult(true);
        context.endGame();
        return;
      }
      if (context.movesLeft <= 0) {
        context.showResult(false);
        context.endGame();
        return;
      }
      const noMoves = !context.cluster.hasAnyMove();
      if (!noMoves) return;
      if (context.autoShuffleLeft > 0) {
        context.setIsAutoShuffling(true);
        context.shuffle.shuffleBoard(_ok => {
          context.decAutoShuffleLeft();
          context.setIsAutoShuffling(false);
          checkBoardState(context);
        });
        return;
      }
      context.showResult(false);
      context.endGame();
    }
    exports.checkBoardState = checkBoardState;
    cc._RF.pop();
  }, {} ],
  fisherYates: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "1a182qvLN1F17hG4PXoDwdu", "fisherYates");
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.fisherYates = void 0;
    function fisherYates(arr) {
      for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.random() * (i + 1) | 0;
        const tmp = arr[i];
        arr[i] = arr[j];
        arr[j] = tmp;
      }
    }
    exports.fisherYates = fisherYates;
    cc._RF.pop();
  }, {} ],
  gameEvents: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "91648jKKmJCUIi4+b/vwahV", "gameEvents");
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.bus = exports.GameEvent = void 0;
    var GameEvent;
    (function(GameEvent) {
      GameEvent["MovesChanged"] = "moves:changed";
      GameEvent["ScoreChanged"] = "score:changed";
      GameEvent["ScoreGoalChanged"] = "score:goal-changed";
    })(GameEvent = exports.GameEvent || (exports.GameEvent = {}));
    exports.bus = new cc.EventTarget();
    cc._RF.pop();
  }, {} ],
  gameState: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "75e17kBINZDQb8kCxT2b45o", "gameState");
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.gameState = void 0;
    const gameEvents_1 = require("../infra/events/gameEvents");
    exports.gameState = {
      moves: 0,
      score: 0,
      goal: 0,
      setMoves(number) {
        const next = Math.max(0, 0 | number);
        if (next === this.moves) return;
        this.moves = next;
        gameEvents_1.bus.emit(gameEvents_1.GameEvent.MovesChanged, this.moves);
      },
      setScore(number) {
        const capped = this.goal > 0 ? Math.min(this.goal, 0 | number) : 0 | number;
        const next = Math.max(0, capped);
        if (next === this.score) return;
        this.score = next;
        gameEvents_1.bus.emit(gameEvents_1.GameEvent.ScoreChanged, this.score);
      },
      addScore(delta) {
        this.setScore(this.score + (0 | delta));
      },
      setGoal(number) {
        const next = Math.max(0, 0 | number);
        if (next === this.goal) return;
        this.goal = next;
        gameEvents_1.bus.emit(gameEvents_1.GameEvent.ScoreGoalChanged, this.goal);
      }
    };
    cc._RF.pop();
  }, {
    "../infra/events/gameEvents": "gameEvents"
  } ],
  types: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "c403bMHhThFQYchias76WTe", "types");
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    cc._RF.pop();
  }, {} ]
}, {}, [ "checkBoardState", "gameState", "GameBoard", "CubeSelect", "PrefabCubeFactory", "MovesCount", "ResultPanelView", "ScoreCount", "BoardInstaller", "GridLayout", "fisherYates", "animations", "BoardBuilder", "BoardFiller", "BoardUtils", "ClusterSystem", "NodeGrid", "gameEvents", "TapHandlers", "ZoneBlobIconProvider", "GravitySystem", "ShuffleSystem", "GameStore", "IBoardConfig", "ICluster", "IConfig", "ICubeFactory", "IGameRuntime", "ITapEvent", "IUtils", "IGravity", "IGravityStore", "IGravitySystem", "types" ]);