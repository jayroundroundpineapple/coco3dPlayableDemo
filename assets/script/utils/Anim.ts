import { AudioClip, instantiate, Node, Prefab, resources, Sprite, Tween, UIOpacity, Vec2, Vec3, view } from "cc";
import { LanguageManager } from "../language/LanguageManager";
import RESSpriteFrame from "../RESSpriteFrame";
import MoneyChange from "./MoneyChange";
import { utils } from "./utils";
// 定义一个状态对象类
class FlyAniState {
    count: number = 0;
    staLen: number;
    fun: Function | null;
    thisObj: any;
    musicID: any = null;
    moneyChangeFlag: boolean = true;

    constructor(staLen: number, fun: Function | null, thisObj: any) {
        this.staLen = staLen;
        this.fun = fun;
        this.thisObj = thisObj;
    }
}

export default class Anim {
    public static _instance: Anim;

    public static ins(): Anim {
        if (!Anim._instance) {
            Anim._instance = new Anim();
        }
        return Anim._instance;
    }

    /**最大数量 */
    private MusicID:any = null
    private maxNum: number = 40;
    private count: number = 0;
    private _staLen: number = 0;
    public MoneychangeFlag:boolean = true
    private _fun: Function | null = null;
    private _thisObj: any;


    /**
     * 播放飞的动画
     * @param len 数量
     * @param endPoint 飞到的位置
     * @param 设置金币起始位置
     * @param comFun 执行结束
     * @param thisObj this指向
     * @param MoneyChangeArr 金币文本
     * @param Money 金币数额moneyCb
     * @param moneyCb 金钱动画结束回调
     * 
     */
    public ShowFlyAni(prefab: Prefab, parent:Node, len: number, endPoint: Vec2,comFun: Function | null = null, thisObj: any = null,MoneyChangeArr?:MoneyChange[],Money?:number,moneyCb?:Function,originPos?:Vec2) {
        // 创建一个新的状态对象
        const state = new FlyAniState(len, comFun, thisObj);

        let halfX: number = 0;
        let halfY: number = 0;
        if (originPos != null) {
            halfX = originPos.x;
            halfY = originPos.y;
        }
        let X, Y, showMS, delay;

        for (var i = 0; i < len; i++) {
            var img: Node = instantiate(prefab);
            img.parent = parent;
            img.setPosition(halfX, halfY, 0);
            let uiOpacity = img.getComponent(UIOpacity) || img.addComponent(UIOpacity);
            uiOpacity.opacity = 255;

            const winSize = view.getVisibleSize();
            let scaleValue: number;
            if (winSize.width > winSize.height) {
                scaleValue = utils.limit(1.4, 1.7);
            } else {
                scaleValue = utils.limit(0.7, 0.9);
            }
            scaleValue = 0.3;
            img.setScale(scaleValue, scaleValue, scaleValue);

            delay = 0.08 + i * 0.02;
            showMS = utils.getRadian(utils.limit(0, 18) * 20);
            X = halfX + Math.cos(showMS) * utils.limit(8, 25) * 10;
            Y = halfY + Math.sin(showMS) * utils.limit(8, 25) * 6;

            new Tween(img)
                .delay(delay)
                .to(0.2 + delay, { position: new Vec3(X + utils.limit(-10, 10), Y + utils.limit(-2, 4), 0) }, { easing: 'backOut' })
                .delay(0.05)
                .to(0.3, { position: new Vec3(endPoint.x, endPoint.y, 0) })
                .call(() => {
                    new Tween(uiOpacity).to(0.2, { opacity: 0 }).start();
                })
                .call(() => {
                    if (state.moneyChangeFlag && MoneyChangeArr != null) {
                        state.musicID = (cc as any).audioEngine.play(RESSpriteFrame.instance.numberAddAudioClip, false, 1);
                        state.moneyChangeFlag = false;
                        if (Money != null && LanguageManager.instance) {
                            // MoneyChange.play(LanguageManager.instance.formatUnit(Money),0.8,()=>{
                            //     if(moneyCb!=null)moneyCb()
                            // },this)
                            [...MoneyChangeArr].forEach((item, index) => {
                                item.play(LanguageManager.instance!.formatUnit(Money), 0.8, () => {
                                    if (index == [...MoneyChangeArr].length-1 ) {
                                        if (moneyCb != null) moneyCb();
                                    }
                                }, this);
                            });
                        }
                    }
                    this.onEffectComplete(img, state);
                }).start();
        }
    }

    private onEffectComplete(img: Node, state: FlyAniState): void {
        if (img && img.parent) {
            img.destroy();
            state.count++;
            // Sound.ins().playaddCoin();
            // Sound.ins().playsound_usd();
            resources.load(`music/addCoin`, AudioClip, (err, audioClip) => {
                if (err) return;

                cc.audioEngine.play(AudioClip, false, 1);
            });

            if (state.count == state.staLen) {
                state.musicID && cc.audioEngine.pause(state.musicID);
                state.moneyChangeFlag = true;
                if (state.fun != null) {
                    state.fun.call(state.thisObj);
                    state.fun = null;
                    state.thisObj = null;
                }
            }
        }
    }

}