import { ResultPanelView } from "../components/panels/ResultPanelView";
import { ClusterSystem } from "../infra/board/ClusterSystem";
import { ShuffleSystem } from "../infra/systems/ShuffleSystem";

export type BoardStateContext = {
	isBoardAnimating: boolean;
	isAutoShuffling: boolean;
	gameEnded: boolean;
	score: number;
	scoreGoal: number;
	movesLeft: number;
	autoShuffleLeft: number;
	resultPanel: ResultPanelView;
	cluster: ClusterSystem;
	shuffle: ShuffleSystem;
	endGame: () => void;
	setIsAutoShuffling: (v: boolean) => void;
	decAutoShuffleLeft: () => void;
	showResult: (isWin: boolean) => void;
};

export function checkBoardState(context: BoardStateContext) {
	if (context.isBoardAnimating || context.isAutoShuffling || context.gameEnded)
		return;

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
		context.shuffle.shuffleBoard((_ok) => {
			context.decAutoShuffleLeft();
			context.setIsAutoShuffling(false);

			checkBoardState(context);
		});
		return;
	}

	context.showResult(false);
	context.endGame();
}
