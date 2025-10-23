const { ccclass, property } = cc._decorator;

import { GameBoard } from "../components/board/GameBoard";
import { ResultPanelView } from "../components/panels/ResultPanelView";
import { BoardBuilder } from "../infra/board/BoardBuilder";
import { BoardUtils } from "../infra/board/BoardUtils";
import { ClusterSystem } from "../infra/board/ClusterSystem";
import { TapHandlers } from "../infra/input/TapHandlers";
import { GravitySystem } from "../infra/systems/GravitySystem";
import { ShuffleSystem } from "../infra/systems/ShuffleSystem";
import { GameStore } from "../store/GameStore";

import { checkBoardState } from "../app/checkBoardState";

import { IUtils } from "../types/IUtils";

@ccclass
export default class BoardInstaller extends cc.Component {
	@property(GameStore) store: GameStore = null!;
	@property(GameBoard) board: GameBoard = null!;
	@property(ResultPanelView) resultPanel: ResultPanelView = null!;

	private utils: IUtils;
	private cluster: ClusterSystem;
	private gravity: GravitySystem;
	private taps: TapHandlers;
	private shuffle: ShuffleSystem;

	start() {
		if (!this.board.cubePrefab) {
			cc.error("Cube Prefab не назначен.");
			return;
		}
		if (!this.board.cubeIcons?.length) {
			cc.error("Список иконок пуст.");
			return;
		}

		const config = {
			rows: this.store.rows,
			cols: this.store.cols,
			cellSize: this.store.cellSize,
		};
		const builder = new BoardBuilder({
			config,
			cubePrefab: this.board.cubePrefab,
			cubeIcons: this.board.cubeIcons,
			parent: this.board.node,
			colorsLimit: this.store.colorsLimit,
		});
		const built = builder.build();
		this.board.attachBuilt(built);

		this.utils = new BoardUtils(this.store);
		this.gravity = new GravitySystem(this.board, this.store, this.utils);
		this.cluster = new ClusterSystem(this.board, this.utils, this.store);
		this.shuffle = new ShuffleSystem(this.board, this.utils, this.store);
		this.taps = new TapHandlers(
			this.board,
			this.gravity,
			this.store,
			this.cluster,
			this.utils
		);

		this.taps.installBubblingListener(this.board.node);

		this.store.resultPanel =
			this.resultPanel ??
			cc.find("Canvas")?.getComponentInChildren(ResultPanelView) ??
			null;

		this.store.initLevelState();
		this.board.onBoardStabilized = this.runCheck;
		this.scheduleOnce(this.runCheck, 0);

		cc.game.setFrameRate(60);
	}

	private runCheck = () => {
		checkBoardState({
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
			setIsAutoShuffling: (v) => {
				this.store.isAutoShuffling = v;
			},
			decAutoShuffleLeft: () => {
				this.store.autoShuffleLeft = Math.max(
					0,
					this.store.autoShuffleLeft - 1
				);
			},
			showResult: (win) => this.store.resultPanel?.show(win),
		});
	};
}
