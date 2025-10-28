import { _decorator, Component, EventTouch, input, Input, Node } from "cc";
import { Constants } from "../data/constants";
const { ccclass, property } = _decorator;

@ccclass("PageStart")
export class PageStart extends Component {

    gameStart(){
        Constants.game.node.emit(Constants.GAME_EVENT.RESTART);
        Constants.game.audioManager.playClip();
    }
    protected start(): void {
        input.on(Input.EventType.TOUCH_START, this.onTouchStart, this);
    }
    onTouchStart(event: EventTouch) {
            console.log("触摸2D MainUI", event);
        event.propagationStopped = false; // 允许事件继续传递
    }
}
