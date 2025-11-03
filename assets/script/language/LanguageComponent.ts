import { CCBoolean, CCInteger, Component, Label, RichText, _decorator } from "cc";
import { LanguageManager } from "./LanguageManager";

const {ccclass, property} = _decorator;

@ccclass
export class LanguageComponent extends Component {

    @property(CCInteger)
    languageId: number = 0;
    @property({type:CCBoolean,tooltip:'是否需要自定义配置%s'})
    IsCustom:boolean = false
    @property({type:CCInteger,tooltip:'配置的数字'})
    cusTomNum:number = 0
    private lable: Label | RichText = null!;
    private formatArgs: any[] | null = null;

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
        //this.formatArgs != null
        if (this.IsCustom && this.cusTomNum){
            this.lable.string = mgr.getText(this.languageId,this.cusTomNum);
        } else {
            this.lable.string = mgr.getText(this.languageId);
        }
    }

    public ChangeNormalId(textId: number, ...args: any[]): void {
        this.languageId = textId;
        if (args.length <= 0) {
            this.formatArgs = null;
        } else {
            this.formatArgs = args;
        }

        this.ChangeLanguage();
    }

    public SetFormatText(...args: any[]): void {
        this.formatArgs = args;
        this.ChangeLanguage();
    }
}
