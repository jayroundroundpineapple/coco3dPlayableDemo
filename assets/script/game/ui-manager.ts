/**
 * Copyright (c) 2019 Xiamen Yaji Software Co.Ltd. All rights reserved.
 * Created by daisy on 2019/06/25.
 */
import { _decorator, Component, Node, Tween, tween, math, Vec3, Label } from "cc";
import { Constants } from "../data/constants";
import { LanguageManager } from "../language/LanguageManager";
import RESSpriteFrame from "../RESSpriteFrame";
const { ccclass, property } = _decorator;

@ccclass("UIManager")
export class UIManager extends Component {
    @property(Node)
    pageStart: Node = null!;
    @property(Node)
    pageResult: Node = null!;
    @property(Node)
    successUI:Node = null!;
    @property(Label)
    moneyLb:Label = null!;
    @property(Node)
    MaskNode:Node = null!
    onLoad(){
        Constants.game.uiManager = this;
    }

    start () {
        this.pageResult.active = false;
        this.successUI.active = false
        this.MaskNode.active = false
    }

    showDialog(isMain: boolean, ...args: any[]){
        this.pageResult.active = !isMain;
        this.pageStart.active = isMain;
    }
    showFailUI(){
        this.pageResult.active = false;
    }
    showSuccessUI(){
        setTimeout(() => {
            this.MaskNode.active = true
        }, 200);
        this.successUI.scale = new Vec3(0,0,0) 
        this.successUI.active = true
        this.moneyLb.string  = `${LanguageManager.instance.getText(10001)}${Constants.game.score}`
        Constants.game.audioManager.playClip1(RESSpriteFrame.instance.comeOutAudioClip)
        tween(this.successUI).delay(0.3)
        .to(0.5,{scale:new Vec3(1,1,1)})
        .start()
    }
}
