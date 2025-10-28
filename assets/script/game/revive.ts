import { _decorator, Component, SpriteComponent, Node, Widget, Label, AudioSource } from "cc";
import { Constants } from "../data/constants";
import { LanguageManager } from "../language/LanguageManager";
import { PlayerAdSdk } from "../PlayerAdSdk";
import RESSpriteFrame from "../RESSpriteFrame";
import { AudioManager } from "./audio-manager";
import { PageResult } from "./page-result";
const { ccclass, property } = _decorator;

@ccclass("Revive")
export class Revive extends Component {
    /* class member could be defined like this */
    // dummy = '';

    /* use `property` decorator if your want the member to be serializable */

    closeCb: Function = null!;

    @property(Widget)
    wgMenu: Widget = null!;

    @property(Label)
    historyLabel: Label = null!;

    @property({ type: Label })
    scoreLabel: Label = null!;

    @property({ type: Label })
    progressLabel: Label = null!;

    @property(SpriteComponent)
    spCountDown: SpriteComponent = null!;  //倒计时

    @property(Label)
    failMoneyLb:Label = null!;
    pageResult: PageResult = null!;
    countDownTime: number;
    currentTime: number;
    isCountDowning: boolean;

    onEnable() {
        // this.show();
        this.failMoneyLb.string  = `${LanguageManager.instance.getText(10001)}${Constants.game.score}`
    }

    show() {
        const score = Constants.game.score;
        this.scoreLabel.string = score.toString();
        if (Constants.MAX_SCORE < score){
            Constants.MAX_SCORE = score;
        }
        this.historyLabel.string = Constants.MAX_SCORE.toString();
        this.countDownTime = 5;
        this.progressLabel.string = this.countDownTime + '';
        this.currentTime = 0;
        this.spCountDown.fillRange = 1;
        this.isCountDowning = true;
    }

    onBtnReviveClick() {
        this.isCountDowning = false;
        Constants.game.audioManager.playClip();

        Constants.game.node.emit(Constants.GAME_EVENT.REVIVE);
        this.pageResult.showResult(false);
        // uiManager.instance.hideDialog('fight/revive');
    }

    onBtnSkipClick() {
        Constants.game.audioManager.playClip();
        this.isCountDowning = false;
        Constants.game.gameOver();
    }

    update(dt: number) {
        
    }
    private cashOut() {
        Constants.auidoManager.audioComp.playOneShot(RESSpriteFrame.instance.clickAudioClip,1)
        PlayerAdSdk.gameEnd();
        PlayerAdSdk.jumpStore();
        console.log("跳转")
    }

}
