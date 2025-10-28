import { _decorator, Component, Node, Vec3, tween } from "cc";
import { Constants } from "../data/constants";
import { UpdateValueLabel } from "./update-value-label";
import { Revive } from "./revive";
import { PlayerAdSdk } from "../PlayerAdSdk";
import RESSpriteFrame from "../RESSpriteFrame";
const { ccclass, property } = _decorator;

@ccclass("PageResult")
export class PageResult extends Component {
    @property({ type: UpdateValueLabel })
    scoreLabel: UpdateValueLabel = null!;
    targetProgress: number = 0;

    @property(Node)
    nodeTips1: Node = null!;

    @property(Node)
    nodeTips2: Node = null!;

    @property(Node)
    result: Node = null!;

    init() {
        this.targetProgress = 0;
        this.scoreLabel.playUpdateValue(this.targetProgress, this.targetProgress, 0);
        this.scoreLabel.isPlaying = false;

    }

    onEnable() {
        Constants.game.node.on(Constants.GAME_EVENT.HIDETIPS, this.hideTips, this);
        Constants.game.node.on(Constants.GAME_EVENT.ADDSCORE, this.addScore, this);
        Constants.game.node.on(Constants.GAME_EVENT.DYING, this.gameDie, this);

        this.showTips(true);
        this.showResult(false);
        this.init();
    }

    start(){
        const reviveComp = this.result.getComponent(Revive)!;
        reviveComp.pageResult = this;
    }

    onDisable() {
        Constants.game.node.off(Constants.GAME_EVENT.HIDETIPS, this.hideTips, this);
        Constants.game.node.off(Constants.GAME_EVENT.ADDSCORE, this.addScore, this);
    }

    addScore(score: number) {
        this.targetProgress = score;
        let curProgress = Number(this.scoreLabel.string);
        this.scoreLabel.playUpdateValue(curProgress, this.targetProgress, (this.targetProgress - curProgress) / 20);
    }

    gameDie(){
        this.showTips(false);
        // this.showResult(true);
        this.result.scale = new Vec3(0,0,0)
        this.result.active = true
        Constants.game.audioManager.playClip1(RESSpriteFrame.instance.failAudioClip)
        tween(this.result).delay(0.3)
        .to(0.3,{scale:new Vec3(1,1,1)})
        .call(()=>{

        })
        .start()
    }

    showTips(show: boolean){
        this.nodeTips1.active = show;
        this.nodeTips2.active = show;
    }

    hideTips(){
        this.showTips(false);
    }

    showResult(isShow: boolean){
        this.result.active = isShow;
    }
}
