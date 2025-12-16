
import { _decorator, Component, Node, Prefab, view, Canvas, ResolutionPolicy, director, Widget, Tween, Vec3, find, input, Input, EventTouch, Camera, PhysicsSystem, geometry, RigidBody, EventMouse, Mask, MaskComponent, Graphics, UITransform, math, Vec2 } from "cc";
import { Constants } from "../data/constants";
import { CameraCtrl } from "./camera-ctrl";
import { AudioManager } from "./audio-manager";
import { PlayerAdSdk } from "../PlayerAdSdk";
import { utils } from "../utils/utils";
const { ccclass, property } = _decorator;
/**
 * @zh 游戏管理类，同时也是事件监听核心对象。
 */
@ccclass("GameUI")
export class GameUI extends Component {
    @property(Node)
    private StartBtn:Node = null!;
    @property(Mask)
    TestMask:Mask = null!;
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
        this.testMaskFunc();
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
    testMaskFunc(){
        let graphics = this.TestMask.getComponent(Graphics);
        graphics?.roundRect(0,0,100,100,10);
        const btnPos = utils.convertWorldToNodeSpace(this.StartBtn, this.TestMask.node);
        if (!btnPos) return;
        const btnTransform = this.StartBtn.getComponent(UITransform);
        if (!btnTransform) return;
        const btnWidth = btnTransform.width;
        const btnHeight = btnTransform.height;
        graphics?.roundRect(btnPos.x - btnWidth / 2, btnPos.y - btnHeight / 2, 400, 145, 20);
        graphics?.fill();
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
     * 
     * 【核心问题】：如何把屏幕上的2D坐标转换成3D世界坐标？
     * 
     * 【思路】：
     * 1. 屏幕坐标（比如鼠标点击位置）是2D的，只有X和Y（像素坐标）
     * 2. 3D世界是3D的，有X、Y、Z三个维度
     * 3. 我们需要找到：鼠标指向屏幕时，在3D世界中对应的是哪个位置
     * 
     * 【解决方案】：使用"射线"概念
     * - 想象一下：你的眼睛（相机）看向屏幕上的一点
     * - 这条"视线"就是一条从相机发射出去的射线，一直延伸进入3D世界
     * - 我们让节点始终停留在这条射线的某个固定高度（Z平面）上
     * - 然后计算射线与这个平面的交点，那就是节点应该移动到的位置
     * 
     * @param screenX 屏幕X坐标（像素坐标，比如 100）
     * @param screenY 屏幕Y坐标（像素坐标，比如 200）
     */
    private update3DNodePosition(screenX: number, screenY: number) {
        // ========== 第一步：安全检查 ==========
        // 如果没有相机或节点，直接返回，不做任何处理
        if (!this.mainCamera || !this.move3DNode) {
            return;
        }
        
        // ========== 第二步：创建并计算射线 ==========
        // 什么是射线（Ray）？
        // - 射线 = 起点（origin） + 方向（direction）
        // - 就像你用手指指向一个方向，有起点（手指位置）和方向（指的方向）
        
        // 创建一个空的射线对象
        const ray = new geometry.Ray();
        
        // 【关键步骤】：把屏幕坐标转换成3D射线
        // screenPointToRay 做了什么事？
        // 1. 接收：屏幕上的像素坐标 (screenX, screenY)
        // 2. 计算：从相机位置发射，穿过屏幕这个点的方向
        // 3. 填充：把计算结果存到 ray 对象里
        // 
        // 射线包含两部分：
        // - ray.o (origin) = 射线的起点，通常是相机的位置
        // - ray.d (direction) = 射线的方向，是一个归一化的向量
        //
        // 比如：相机在 (0, 5, 10)，屏幕点 (100, 200) 对应的方向可能是 (0.1, -0.2, -0.9)
        // 这意味着射线从 (0, 5, 10) 出发，沿着 (0.1, -0.2, -0.9) 这个方向延伸
        this.mainCamera.screenPointToRay(screenX, screenY, ray);
        
        // ========== 第三步：确定节点移动的平面（Z平面） ==========
        // 我们让节点在一个固定的Z平面上移动
        // 想象地面是一个平面，节点就像在地面上滑动的物体，不能飞起来也不能沉下去
        
        // planeZ 就是平面的高度（Z坐标值）
        // 比如如果 planeZ = 0，说明节点在 Z=0 这个平面上移动（地面）
        // 我们使用节点当前的Z坐标作为平面高度，这样节点就不会改变高度
        const planeZ = this.move3DNode.position.z; // 比如 planeZ = 0
        
        // ========== 第四步：计算射线与平面的交点 ==========
        // 
        // 【数学原理】：
        // 射线方程：P = origin + direction * t
        // - P 是射线上的任意一点
        // - origin 是射线起点（ray.o）
        // - direction 是方向向量（ray.d）
        // - t 是一个参数，当 t 变化时，P 就在射线上移动
        // 
        // 平面方程：z = planeZ（一个水平平面）
        // - 这个平面在Z轴上的高度是固定的
        // 
        // 【计算交点】：
        // 我们要求射线上的点 P，使得 P.z = planeZ
        // 
        // 把射线方程展开：
        //   P.x = ray.o.x + ray.d.x * t
        //   P.y = ray.o.y + ray.d.y * t
        //   P.z = ray.o.z + ray.d.z * t
        // 
        // 因为 P.z = planeZ，所以：
        //   ray.o.z + ray.d.z * t = planeZ
        // 
        // 解出 t：
        //   ray.d.z * t = planeZ - ray.o.z
        //   t = (planeZ - ray.o.z) / ray.d.z
        
        // 【边界情况检查1】：射线方向几乎与平面平行
        // 如果 ray.d.z 非常接近0，说明射线几乎平行于Z平面
        // 就像你平视前方，视线几乎平行于地面，永远不会与地面相交
        // 这时计算会出错（除以0），所以直接返回
        if (Math.abs(ray.d.z) < 0.0001) {
            // 射线几乎平行于平面，永远不会相交，不更新位置
            return;
        }
        
        // 计算参数 t
        // t 的含义：从射线起点出发，沿着方向走多远才能到达平面
        // 比如 t = 5，说明要走5个单位长度才能到达平面
        const t = (planeZ - ray.o.z) / ray.d.z;
        
        // 【边界情况检查2】：射线方向相反
        // 如果 t < 0，说明射线方向与平面相反
        // 想象你站在地面上，眼睛向上看，视线永远不会与地面相交（因为你在地面上方）
        // 这时也不更新位置
        if (t < 0) {
            // 射线方向相反，不会与平面相交，不更新位置
            return;
        }
        
        // ========== 第五步：计算交点的具体坐标 ==========
        // 现在我们知道了 t，可以用射线方程计算交点的完整坐标
        // 
        // 射线方程：P = origin + direction * t
        // 展开：
        //   worldPos.x = ray.o.x + ray.d.x * t
        //   worldPos.y = ray.o.y + ray.d.y * t
        //   worldPos.z = ray.o.z + ray.d.z * t = planeZ（因为我们就是在找这个交点）
        
        // 创建一个新的3D坐标对象来存储交点
        const worldPos = new Vec3();
        
        // Vec3.scaleAndAdd 做了什么？
        // 计算：worldPos = ray.o + ray.d * t
        // 这是向量运算的简写形式
        // 等价于：
        //   worldPos.x = ray.o.x + ray.d.x * t
        //   worldPos.y = ray.o.y + ray.d.y * t
        //   worldPos.z = ray.o.z + ray.d.z * t
        Vec3.scaleAndAdd(worldPos, ray.o, ray.d, t);
        
        // ========== 第六步：更新节点位置 ==========
        // 把计算出的交点坐标赋值给节点
        // 注意：我们保持节点的Z坐标不变（使用原来的 planeZ）
        // 这样节点就只在XY平面上移动，不会改变高度
        this.move3DNode.setPosition(worldPos.x, worldPos.y, this.move3DNode.position.z);
        
        // 【总结】：
        // 整个过程就像：
        // 1. 你用手指指向屏幕上的某个点
        // 2. 从你的眼睛（相机）沿这个方向画一条射线
        // 3. 找到这条射线与地面（Z平面）的交点
        // 4. 把节点移动到这个交点的位置
        // 这样，节点就"跟随"你的手指/鼠标了！
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
