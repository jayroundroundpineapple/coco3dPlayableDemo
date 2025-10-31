import {TweenEasing,Vec3, _decorator, Component, Node, instantiate, Prefab, view, Canvas, ResolutionPolicy, director, Widget, Tween, Quat, PhysicsSystem, geometry, EventTouch, Camera, Input, input } from "cc";
import { Constants } from "../data/constants";
import { PlayerAdSdk } from "../PlayerAdSdk";
const { ccclass, property } = _decorator;

/**
 * @zh 游戏管理类，同时也是事件监听核心对象。
 */
@ccclass("StartGame")
export class StartGame extends Component {
    @property(Camera)
    private camera!: Camera;
    @property(Node)
    private box0: Node = null!;
    @property(Node)
    private box1: Node = null!;
    @property(Node)
    private card: Node = null!;

    __preload () {

    }
    onLoad(){
        PlayerAdSdk.init()
        this.resize()
    }
    start(){
        PhysicsSystem.instance.enable = true; 
        let that = this;
        /**屏幕旋转尺寸改变 */
        view.setResizeCallback(() => {
            that.resize(); 
        })
        input.on(Input.EventType.TOUCH_START, this.onTouchStart, this);
        new Tween(this.card).repeatForever(
            new Tween(this.card)
            .to(4,{eulerAngles:new Vec3(0,360,0)})
            .start()
        ).start();
        this.startRotationAnimation()
    }
    onTouchStart(event: EventTouch) {
        const touchPos = event.getLocation();
        // 从相机发射射线（将屏幕坐标转为 3D 射线）
        const ray = new geometry.Ray();
        this.camera.screenPointToRay(touchPos.x, touchPos.y, ray);
        // 检测射线与 3D 物体的碰撞
        if (PhysicsSystem.instance.raycastClosest(ray)) {
            const hitNode = PhysicsSystem.instance.raycastClosestResult.collider.node;
            if (hitNode === this.box1) {
                console.log("点击到了3D-Cube节点：", hitNode.name);
                // hitNode.position.add(new Vec3(1,0,0));
                // hitNode.position = hitNode.position.add(new Vec3(1,0,0));
                const tempVec3 = new Vec3();
                Vec3.add(tempVec3, hitNode.position, new Vec3(0.1,0,0));
                hitNode.setPosition(tempVec3);
            }
            if (hitNode === this.box0) {
                console.log("点击到了3D-饭碗节点：", hitNode.name);
                hitNode.position = hitNode.position.add(new Vec3(1,0,0));
            }
        }
    }
    private startRotationAnimation() {
        const rotateQuat = Quat.fromEuler(new Quat(), 150, 0, 0);
        new Tween(this.box0)
            .to(2, { rotation: rotateQuat }, { easing: "linear" })
            // .to(2, { eulerAngles: new Vec3(360, 0, 0) }, { easing: "linear" }) // 2秒旋转一圈
            // .repeatForever()
            .start();
    }

    onDestroy() {
        input.off(Input.EventType.TOUCH_START, this.onTouchStart, this);
    }
    private resize() {
        let winSize = view.getVisibleSize();
        console.log(winSize);
        let isVerTical = winSize.height > winSize.width
        if (isVerTical) {
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
}
