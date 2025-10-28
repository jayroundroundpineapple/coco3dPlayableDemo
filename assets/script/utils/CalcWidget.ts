import { CCBoolean, Component, UITransform, UITransformComponent, view, Widget, _decorator } from "cc";

const { ccclass, property } = _decorator;

@ccclass
export class CalcWidget extends Component {
    @property({type:CCBoolean})
    public isLeft:boolean = true

    start() {
        this.fitFunc();
        // cc.view.setResizeCallback(() => {
        //     this.fitFunc();
        // })
    }
    private fitFunc(){
        let winSize = view.getVisibleSize()
        this.node.active = winSize.width > winSize.height ? true : false
        let widget = this.node.getComponent(Widget)!
        // if(widget == null)return
        let data = this.node.getComponent(UITransform)!
        if(this.isLeft){
            widget.left = (((winSize.width - 720 ) / 2) - data.width) / 2
        }else{
            widget.right = (((winSize.width - 720 ) / 2) - data.width) / 2
        }
    }
}
