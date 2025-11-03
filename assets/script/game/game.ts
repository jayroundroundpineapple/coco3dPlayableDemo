
import { _decorator, Component, Node, Prefab, view, Canvas, ResolutionPolicy, director, Widget, Tween, Vec3, find } from "cc";
import { Constants } from "../data/constants";
import { CameraCtrl } from "./camera-ctrl";
import { AudioManager } from "./audio-manager";
import { PlayerAdSdk } from "../PlayerAdSdk";
import RESSpriteFrame from "../RESSpriteFrame";
const { ccclass, property } = _decorator;

/**
 * @zh 游戏管理类，同时也是事件监听核心对象。
 */
@ccclass("Game")
export class Game extends Component {
    @property(Node)
    boxNode:Node = null!;
    @property(Node)
    leftNode:Node = null!;
    @property(Node)
    rightNode:Node = null!;
    @property(Node)
    startNode:Node = null!;

    bgmFlag:boolean = false;
    __preload () {
        Constants.game = this;
    }

    onLoad(){
        PlayerAdSdk.init()
        this.resize()
    }

    start(){
        let that = this;
        /**屏幕旋转尺寸改变 */
        view.setResizeCallback(() => {
            that.resize();
        })
        find('Canvas')?.on('touchstart',()=>{
            this.bgmFlag = true;
            AudioManager.instance.playSound(AudioManager.instance.bgmAudioClip, true, 1);
        });
        this.startNode.on(Node.EventType.TOUCH_START, this.clickStart, this);
        new Tween(this.boxNode)
        .to(3,{eulerAngles:new Vec3(0,360,0)},{easing:"linear"})
        .start();
    }
    clickStart(){
        this.startNode.off(Node.EventType.TOUCH_START, this.clickStart, this);
        console.log("clickStart");
        this.cashoutFunc();
    }
    cashoutFunc(){
        PlayerAdSdk.gameEnd();
        PlayerAdSdk.jumpStore();
        console.log("跳转商店");
    }

    private resize() {
        let winSize = view.getVisibleSize()
        console.log(winSize);
        let isVerTical = winSize.height > winSize.width
        this.leftNode.active = this.rightNode.active = !isVerTical
        if (isVerTical) {//竖屏
            if (winSize.width / winSize.height > 0.7) {
                view.setResolutionPolicy(ResolutionPolicy.FIXED_HEIGHT)
            } else {
                view.setResolutionPolicy(ResolutionPolicy.FIXED_WIDTH)
            }
        } else {
            view.setResolutionPolicy(ResolutionPolicy.FIXED_HEIGHT)
        }
        director.getScene()?.getComponentsInChildren(Widget).forEach(function (t) {
            t.updateAlignment()
        });
    }

    onDestroy() {
       
    }
}
