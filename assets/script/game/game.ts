
import { _decorator, Component, Node, Prefab, view, Canvas, ResolutionPolicy, director, Widget, Tween, Vec3, find, input, Input, EventTouch, Camera, PhysicsSystem, geometry, RigidBody, EventMouse } from "cc";
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
    move3DNode:Node = null!;
    @property(Node)
    leftNode:Node = null!;
    @property(Node)
    rightNode:Node = null!;
    @property(Node)
    startNode:Node = null!;
    @property(Camera)
    mainCamera: Camera = null!;

    bgmFlag:boolean = false;
    private isDragging3DNode: boolean = false; // 标记是否正在拖拽3D节点
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
        // 监听触摸事件，用于检测3D节点点击（包括move3DNode的拖拽开始）
        input.on(Input.EventType.TOUCH_START, this.onTouchStart, this);
        input.on(Input.EventType.MOUSE_DOWN, this.onMouseDown, this);
        
        // 监听鼠标/触摸移动和结束事件，用于3D节点跟随
        input.on(Input.EventType.TOUCH_MOVE, this.onTouchMove, this);
        input.on(Input.EventType.TOUCH_END, this.onTouchEnd, this);
        input.on(Input.EventType.MOUSE_MOVE, this.onMouseMove, this);
        input.on(Input.EventType.MOUSE_UP, this.onMouseUp, this);
        
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
            } else if (hitNode === this.move3DNode) {
                // 点击到了 move3DNode，开始拖拽
                console.log("点击到了 move3DNode，开始拖拽");
                this.isDragging3DNode = true;
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

    onTouchMove(event: EventTouch) {
        // 只有在拖拽状态下才更新位置
        if (this.isDragging3DNode) {
            this.update3DNodePosition(event.getLocationX(), event.getLocationY());
        }
    }
    
    onTouchEnd(event: EventTouch) {
        // 触摸结束，取消拖拽
        if (this.isDragging3DNode) {
            console.log("触摸结束，取消拖拽");
            this.isDragging3DNode = false;
        }
    }
    
    onMouseMove(event: EventMouse) {
        // 只有在拖拽状态下才更新位置
        if (this.isDragging3DNode) {
            this.update3DNodePosition(event.getLocationX(), event.getLocationY());
        }
    }
    
    onMouseDown(event: EventMouse) {
        // 处理鼠标按下事件，检测是否点击了 move3DNode
        if (!this.mainCamera) {
            return;
        }
        const mousePos = event.getLocation();
        const ray = new geometry.Ray();
        this.mainCamera.screenPointToRay(mousePos.x, mousePos.y, ray);
        if (PhysicsSystem.instance.raycastClosest(ray)) {
            const hitNode = PhysicsSystem.instance.raycastClosestResult.collider.node;
            if (hitNode === this.move3DNode) {
                console.log("鼠标点击到了 move3DNode，开始拖拽");
                this.isDragging3DNode = true;
            }
        }
    }
    
    onMouseUp(event: EventMouse) {
        // 鼠标抬起，取消拖拽
        if (this.isDragging3DNode) {
            console.log("鼠标抬起，取消拖拽");
            this.isDragging3DNode = false;
        }
    }
    
    /**
     * 更新3D节点位置，使其跟随鼠标/触摸位置
     * @param screenX 屏幕X坐标
     * @param screenY 屏幕Y坐标
     */
    private update3DNodePosition(screenX: number, screenY: number) {
        if (!this.mainCamera || !this.move3DNode) {
            return;
        }
        
        // 创建一个射线，从相机通过屏幕点
        const ray = new geometry.Ray();
        this.mainCamera.screenPointToRay(screenX, screenY, ray);
        
        // 假设节点在一个固定的Z平面上移动（例如 Z = 0）
        // 计算射线与 Z = 0 平面的交点
        const planeZ = this.move3DNode.position.z; // 使用节点当前的Z坐标作为平面
        
        // 射线方程: P = origin + direction * t
        // 平面方程: z = planeZ
        // 计算 t = (planeZ - ray.o.z) / ray.d.z
        if (Math.abs(ray.d.z) < 0.0001) {
            // 射线几乎平行于平面，不更新
            return;
        }
        
        const t = (planeZ - ray.o.z) / ray.d.z;
        if (t < 0) {
            // 射线方向相反，不更新
            return;
        }
        
        // 计算交点
        const worldPos = new Vec3();
        Vec3.scaleAndAdd(worldPos, ray.o, ray.d, t);
        
        // 更新节点位置（保持Z坐标不变）
        this.move3DNode.setPosition(worldPos.x, worldPos.y, this.move3DNode.position.z);
    }

    onDestroy() {
        // 清理所有事件监听
        input.off(Input.EventType.TOUCH_START, this.onTouchStart, this);
        input.off(Input.EventType.TOUCH_MOVE, this.onTouchMove, this);
        input.off(Input.EventType.TOUCH_END, this.onTouchEnd, this);
        input.off(Input.EventType.MOUSE_DOWN, this.onMouseDown, this);
        input.off(Input.EventType.MOUSE_MOVE, this.onMouseMove, this);
        input.off(Input.EventType.MOUSE_UP, this.onMouseUp, this);
    }
}
