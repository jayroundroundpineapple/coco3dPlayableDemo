import { Component, Enum, resources, Sprite, SpriteFrame, sys, _decorator } from "cc";
import { PayType } from "../sdk/PlayableSDK";
import { LanguageManager } from "./LanguageManager";
const { ccclass, property } = _decorator;

@ccclass
export class LanguageIcons extends Component {

    @property({ type: Boolean })
    public isFollowLanage: boolean = true;

    @property({ type: String, tooltip: 'pay文件夹下的路径名,全部按语言缩写配置' })
    public srcName: string = ''

    @property({
        type: Enum(PayType),
        visible: function () {
            return !this.isFollowLanage;
        }
    })
    public payType: PayType = PayType.One;
    private icon: Sprite = null!;

    onLoad() {
        this.icon = this.node.getComponent(Sprite)!;
    }

    start() {
        this.initIcon();
    }

    private initIcon(): void {
        if (this.icon == null) return;
        let lang = ''
        if (sys.language == 'zh') {
            lang = 'us'  //us
        } else {
            lang = sys.language
        }
        // let cfg = this.isFollowLanage ? LanguageManager.instance.payAppInfo : LanguageManager.instance.getPayAppInfo(this.payType);
        let res = `${this.srcName}/${lang}`;
        if(sys.language == 'zh'){
            res = `${this.srcName}/${lang}`
        }else{
            let country = sys.languageCode.split('-')[1]
            res = `${this.srcName}/${country}`
        }
        resources.load(`/pay/${res}/spriteFrame`, SpriteFrame, (error, res) => {  //   loader.loadRes   resources.load
            if (error) {
                console.log("error = ", error);
                return;
            }
            this.icon.spriteFrame = res;
        });
    }
}
