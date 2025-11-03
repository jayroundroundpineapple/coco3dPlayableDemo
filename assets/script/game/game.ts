
import { _decorator, Component, Node, Prefab, view, Canvas, ResolutionPolicy, director, Widget, Tween, Vec3, find, input, Input, EventTouch, Camera, PhysicsSystem, geometry, RigidBody } from "cc";
import { Constants } from "../data/constants";
import { CameraCtrl } from "./camera-ctrl";
import { AudioManager } from "./audio-manager";
import { PlayerAdSdk } from "../PlayerAdSdk";
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
    @property(Camera)
    mainCamera: Camera = null!;

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
        // 启用物理系统用于射线检测
        PhysicsSystem.instance.enable = true;
        // 监听触摸事件，用于检测3D节点点击
        input.on(Input.EventType.TOUCH_START, this.onTouchStart, this);
        // 使用 by() 方法进行相对旋转，确保永久循环
        new Tween(this.boxNode)
            .by(3, { eulerAngles: new Vec3(0, 360, 0) }, { easing: "linear" })
            .repeatForever()
            .start();
    }
    onTouchStart(event: EventTouch) {
        console.log("3D节点点击了onTouchStart");
        if (!this.mainCamera) {
            console.warn("未设置主相机，无法进行3D射线检测");
            return;
        }
        const touchPos = event.getLocation();
        // 从相机发射射线（将屏幕坐标转为 3D 射线）
        const ray = new geometry.Ray();
        this.mainCamera.screenPointToRay(touchPos.x, touchPos.y, ray);
        // 检测射线与 3D 物体的碰撞
        if (PhysicsSystem.instance.raycastClosest(ray)) {
            const hitNode = PhysicsSystem.instance.raycastClosestResult.collider.node;
            if (hitNode === this.boxNode) {
                console.log("点击到了3D节点 boxNode");
                const rigidBody = this.boxNode.getComponent(RigidBody);
                if (rigidBody) {
                    rigidBody.useGravity = true;
                }
                this.cashoutFunc();
            }
        }
    }
    clickStart(){
        this.startNode.off(Node.EventType.TOUCH_START, this.clickStart, this);
        console.log("clickStart");
        // this.cashoutFunc();
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
        // 清理触摸事件监听
        input.off(Input.EventType.TOUCH_START, this.onTouchStart, this);
    }
}
