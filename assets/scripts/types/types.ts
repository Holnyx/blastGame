import { IGravityStore } from "./gravity/IGravityStore";
import { IConfig } from "./IConfig";
import { ITapEvent } from "./ITapEvent";

export type TGridNode = cc.Node & { __row?: number; __col?: number };

export type TTapHandler = (e: ITapEvent) => void;

export type TStore = IConfig & IGravityStore;
