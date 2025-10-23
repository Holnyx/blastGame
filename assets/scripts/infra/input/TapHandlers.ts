import { animation } from "../animation/animations";
import { gameState } from "../../app/gameState";
import { CubeSelect } from "../../components/cube/CubeSelect";

import { IGravitySystem } from "../../types/gravity/IGravitySystem";
import { IGravity } from "../../types/gravity/IGravity";
import { ICluster } from "../../types/ICluster";
import { ITapEvent } from "../../types/ITapEvent";
import { IUtils } from "../../types/IUtils";
import { TStore } from "../../types/types";

export class TapHandlers {
	constructor(
		private gameBoard: IGravitySystem,
		private gravity: IGravity,
		private store: TStore,
		private cluster: ICluster,
		private utils: IUtils
	) {}

	installBubblingListener(boardRoot: cc.Node) {
		const event = CubeSelect.Events?.TAP || "cube:tap";
		boardRoot.on(
			event,
			(event: cc.Event.EventCustom) => {
				const data: ITapEvent = event.getUserData && event.getUserData();
				const cube: cc.Node = data?.node || (event.target as cc.Node);
				if (cube) this.onCubeTap(cube);
			},
			this
		);
	}

	private onCubeTap(cube: cc.Node) {
		if (this.store.isBoardAnimating) return;
		if (gameState.moves <= 0) return;

		const need = Math.max(2, this.store.minCluster | 0);
		const speedAnimation = 0.22;
		const finishAfterGravity = () => {
			this.gravity.applyGravityAndFill();
		};

		const cluster = this.cluster.collectCluster(cube);
		if (cluster.length < need) return;

		const add = 10 + (cluster.length - 3) * 5;
		gameState.addScore(add);
		gameState.setMoves(gameState.moves - 1);
		this.store.isBoardAnimating = true;

		let pending = cluster.length;

		cluster.forEach((node, i) => {
			const cell = this.utils.getCell(node);
			if (cell && this.gameBoard.board[cell.row]?.[cell.col] === node) {
				this.gameBoard.board[cell.row][cell.col] = null;
			}
			animation(node, "vanish", {
				duration: speedAnimation,
				delay: i * 0.01,
				easing: "quadIn",
				remove: true,
				onComplete: () => {
					if (--pending === 0) finishAfterGravity();
				},
			});
		});

		if (pending === 0) finishAfterGravity();
	}
}
