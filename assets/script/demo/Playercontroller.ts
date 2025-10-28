import { _decorator, Component, input, Input, EventMouse, Vec3, Camera, PhysicsSystem, geometry } from 'cc';
const { ccclass, property } = _decorator;

@ccclass("PlayerController")
export class PlayerController extends Component {

    @property(Camera)
    private mainCamera!: Camera;
    awake() {
         PhysicsSystem.instance.enable = true; 
    }
    start () {
        console.log("PlayerController初始化，准备添加事件监听");
        input.on(Input.EventType.MOUSE_DOWN, this.onMouseDown, this);
    }

    onMouseDown(event: EventMouse) {
        console.log("点击屏幕",event);
        if(!this.mainCamera){
            console.error("没有相机");
            return;
        }
       console.log("点击3D方块");
        this.node.position.add(new Vec3(1,0,0));
    }
    onMouseDown1(event: EventMouse) {
        console.log("onMouseDown1");
        // 获取点击的屏幕坐标
        const pos = event.getLocation();
        // 用摄像机生成射线
        const ray = new geometry.Ray();
        this.mainCamera.screenPointToRay(pos.x, pos.y, ray);
        // 射线检测
        if (PhysicsSystem.instance.raycastClosest(ray)) {
            const hitNode = PhysicsSystem.instance.raycastClosestResult.collider.node;
            console.log("点击到了3D节点：", hitNode.name);
            hitNode.position.add(new Vec3(1,0,0));
        }
    }
    protected onDestroy(): void {
        input.off(Input.EventType.MOUSE_DOWN, this.onMouseDown, this);
        input.off(Input.EventType.MOUSE_DOWN, this.onMouseDown1, this);
    }
}