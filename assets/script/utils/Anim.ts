// import { AudioClip, AudioSource, instantiate, Prefab, resources, Sprite, tween } from "cc";
// import { LanguageManager } from "../language/LanguageManager";
// import RESSpriteFrame from "../RESSpriteFrame";
// import MoneyChange from "./MoneyChange";
// import { utils } from "./utils";

// export default class Anim {
//     public static _instance: Anim;

//     public static ins(): Anim {
//         if (!Anim._instance) {
//             Anim._instance = new Anim();
//         }
//         return Anim._instance;
//     }

//     private prefab: Prefab[];

//     /**最大数量 */
//     private MusicID:any = null
//     private maxNum: number = 40;
//     private count: number = 0;
//     private _staLen: number = 0;
//     public MoneychangeFlag:boolean = true
//     private _fun: Function;
//     private _thisObj: any;


//     /**
//      * 播放飞的动画
//      * @param len 数量
//      * @param endPoint 飞到的位置
//      * @param 设置金币起始位置
//      * @param comFun 执行结束
//      * @param thisObj this指向
//      * @param MoneyChangeArr 金币文本
//      * @param Money 金币数额moneyCb
//      * @param moneyCb 金钱动画结束回调
//      * 
//      */
//     public ShowFlyAni(prefab: Prefab, parent, len: number, endPoint: Vec2,comFun: Function = null, thisObj: any = null,MoneyChangeArr?:MoneyChange[],Money?:number,moneyCb?:Function,canPlayMusic:boolean = true,originPos?:Vec2) {
//         this.count = 0;
//         this._staLen = len;
//         this._fun = comFun;
//         this._thisObj = thisObj;
//         let halfX: number = 0;
//         let halfY: number = 0;
//         if(originPos!=null){
//             halfX = originPos.x
//             halfY = originPos.y
//         }
//         let X, Y, showMS, delay;

//         for (var i = 0; i < len; i++) {
//             var img: Node = instantiate(prefab);
//             let sprite: Sprite = img.getComponent(Sprite)
//             img.parent = parent;
//             img.opacity = 255;
//             img.x = halfX;
//             img.y = halfY;

//             if (cc.winSize.width > cc.winSize.height) {
//                 img.scale = utils.limit(1.4, 1.7);
//             } else {
//                 img.scale = utils.limit(0.7, 0.9);
//             }
//             img.scale = 0.34;

//             // //加载标题
//             // loader.loadRes(`common/moneyIcon`, SpriteFrame, function (err, spriteFrame) {
//             //     // loader.loadRes(`common/usdIcon${Utils.limitInteger(0, 3)}`, SpriteFrame, function (err, spriteFrame) {
//             //     if (err) return;
//             //     sprite.spriteFrame = spriteFrame;
//             // });
//             delay = 0.08 + i * 0.02;
//             showMS = utils.getRadian(utils.limit(0, 18) * 20);
//             X = halfX + Math.cos(showMS) * utils.limit(8, 25) * 10;
//             Y = halfY + Math.sin(showMS) * utils.limit(8, 25) * 6;

//             tween(img).delay(delay).to(0.2 + delay,
//                 { x: X + utils.limit(-10, 10), y: Y + utils.limit(-2, 4) }, { easing: 'backOut' })
//                 .delay(0.05).to(0.3, { x: endPoint.x, y: endPoint.y })
//                 .to(0.2, { opacity: 0 })
//                 .call((than, target) => {
//                     if(this.MoneychangeFlag && MoneyChangeArr!= null){
//                         if(canPlayMusic){
//                             this.MusicID = cc.audioEngine.play(RESSpriteFrame.instance.numberAddAudioClip,false,1)
//                         }
//                         this.MoneychangeFlag = false
//                         if(Money!=null){
//                             // MoneyChange.play(LanguageManager.instance.formatUnit(Money),0.8,()=>{
//                             //     if(moneyCb!=null)moneyCb()
//                             // },this)
//                             [...MoneyChangeArr].forEach((item,index)=>{
//                                 item.play(LanguageManager.instance.formatUnit(Money),0.8,()=>{
//                                         if(moneyCb!=null)moneyCb()
//                                 },this)
//                             })
//                         }
//                     }
//                     this.onEffectComplete(target)
//                 }, this, img).start();
//         }

//     }

//     private onEffectComplete(img: Node): void {
//         if (img && img.parent) {
//             img.destroy();;
//             this.count++;
//             // Sound.ins().playaddCoin();
//             // Sound.ins().playsound_usd();
//             resources.load(`music/addCoin`, AudioClip, function (err, AudioClip) {
//                 if (err) return;

//                 AudioSource.playOneShot(AudioClip, false, 1)
//             });


//             if (this.count == this._staLen) {
//                 this.MusicID && AudioSource.pause(this.MusicID)
//                 if (this._fun != null) {
//                     this._fun.call(this._thisObj);
//                     this._fun = null;
//                     this._thisObj = null;
//                 }
//             }
//         }
//     }
//    /**
//      * @param node 动画节点
//      * @param ActionArr 动作数组
//      * @param isRepeatForever 是否循环播放
//      */
//    public sequenceAnim(node: Node, ActionArr: any, isRepeatForever: boolean = false, callback?: Function) {
//     let seq = sequence([...ActionArr])
//     if (isRepeatForever) {
//         let repeat = repeatForever(seq)
//         node.runAction(repeat)
//     } else {
//         if (callback) {
//             let func = callFunc(callback, this)
//             seq = sequence([...ActionArr, func])
//         }
//         node.runAction(seq)
//     }
// }
//     public shakeEffect(node:Node,duration) {
//         node.runAction(
//             repeatForever(
//                 sequence(
//                     moveTo(0.02, v2(5, 7)),
//                     moveTo(0.02, v2(-6, 7)),
//                     moveTo(0.02, v2(-13, 3)),
//                     moveTo(0.02, v2(3, -6)),
//                     moveTo(0.02, v2(-5, 5)),
//                     moveTo(0.02, v2(2, -8)),
//                     moveTo(0.02, v2(-8, -10)),
//                     moveTo(0.02, v2(3, 10)),
//                     moveTo(0.02, v2(0, 0))
//                 )
//             )
//         );
//         setTimeout(() => {
//             node.stopAllActions();
//             node.setPosition(0,0);
//         }, duration*1000);
//     }
// }