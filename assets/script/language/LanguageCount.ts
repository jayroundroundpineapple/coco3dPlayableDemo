import { CCBoolean, CCInteger, CCString, Component, Label, RichText, _decorator } from "cc";
import { LanguageManager } from "./LanguageManager";

const {ccclass, property} = _decorator;

@ccclass
export class LanguageCount extends Component {
    @property({type:CCBoolean,tooltip: '是否自动配置货币'})
    autoPrefix:boolean = true
    @property({type:CCBoolean,tooltip: '是否自动配置货币后缀'})
    autoEndfix:boolean = false
    @property({type:CCInteger,tooltip: '数字'})
    languageNum: number = 0;
    @property({type:CCString,tooltip: '前缀'})
    prefix:string = ''
    @property({type:CCString,tooltip: '后缀'})
    endFix:string = ''
    private lable: Label | RichText = null!;

    protected onLoad(): void {
        const label = this.getComponent(Label);
        if (label) {
            this.lable = label;
        } else {
            const richText = this.getComponent(RichText);
            if (richText) {
                this.lable = richText;
            }
        }
    }

    protected start(): void {
        this.ChangeLanguage();
    }

    protected onEnable(): void {
        this.ChangeLanguage();
    }

    private ChangeLanguage(): void {
        if (!this.lable)
            return;
        let mgr = LanguageManager.instance;
        let unit = mgr.getText(10001)
        if(this.autoPrefix){
            this.lable.string = `${this.prefix}${unit}${mgr.formatUnit(this.languageNum)}${this.endFix}`;
        }else{
            this.lable.string = `${this.prefix}${mgr.formatUnit(this.languageNum)}${this.endFix}`;
        }
        if(this.autoEndfix){
            this.lable.string = `${this.prefix}${mgr.formatUnit(this.languageNum)}${this.endFix}${unit}`;
        }
    }
}
