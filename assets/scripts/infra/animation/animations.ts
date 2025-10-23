type AnimKind = "vanish" | "show" | "hide" | "move" | "spawn";

type AnimOpts = {
	duration?: number;
	easing?: string;
	bringToFront?: boolean;
	delay?: number;
	activate?: boolean;
	remove?: boolean;
	onComplete?: () => void;
};

export function animation(
	node: cc.Node,
	arg1: cc.Vec2 | AnimKind,
	arg2?: number | AnimOpts
): void {
	const isVec2 =
		arg1 &&
		typeof arg1 === "object" &&
		typeof arg1.x === "number" &&
		typeof arg1.y === "number";
	cc.Tween.stopAllByTarget(node);

	if (isVec2) {
		const to: cc.Vec2 = arg1;

		if (typeof arg2 === "number" || arg2 === undefined) {
			const delay = typeof arg2 === "number" ? arg2 : 0;

			node.setPosition(to.x, to.y + 600);
			cc.tween(node)
				.delay(delay)
				.to(0.8, { position: to }, { easing: "bounceOut" })
				.start();
			return;
		}

		if (typeof arg2 === "object") {
			const duration = arg2.duration ?? 0.6;
			const easing = arg2.easing ?? "quadIn";

			cc.tween(node).to(duration, { x: to.x, y: to.y }, { easing }).start();
			return;
		}
	}

	if (typeof arg1 === "string") {
		if (arg1 === "show") {
			const options = (arg2 || {}) as {
				easing?: string;
				activate?: boolean;
			};
			const easing = options.easing ?? "quadOut";
			const activate = options.activate ?? true;

			if (activate) node.active = true;

			cc.tween(node).to(0.18, { opacity: 255, scale: 1.0 }, { easing }).start();
			return;
		}
		if (arg1 === "hide") {
			cc.tween(node)
				.to(0.12, { opacity: 0, scale: 0.98 }, { easing: "quadIn" })
				.call(() => (node.active = false))
				.start();
			return;
		}
		if (arg1 === "vanish") {
			const obj = (arg2 || {}) as {
				duration?: number;
				delay?: number;
				easing?: string;
				remove?: boolean;
				onComplete?: () => void;
			};
			const duration = obj.duration ?? 0.22;
			const delay = obj.delay ?? 0;
			const easing = obj.easing ?? "quadIn";
			const remove = obj.remove ?? true;

			cc.tween(node)
				.delay(delay)
				.parallel(
					cc.tween().to(duration, { scale: 0 }, { easing }),
					cc.tween().to(duration, { opacity: 0 }, { easing })
				)
				.call(() => {
					if (remove) node.removeFromParent();
					obj.onComplete?.();
				})
				.start();
			return;
		}
	}
}
