// import { tween } from "cc"
// // 按钮、手指引导
// export default class GuideEffect {
//     //手指
//      /**
//   * 
//   * @param node 节点
//   * @param statrScale 起始缩放默认1.1 
//   *  @param endScale 末尾缩放默认1
//   * @param time 时间间隔默认0.3秒
//   * @param isRepeat 默认重复
//   * @param times 播放次数
//   */
//   public static SetScale(node: Node,time:number = 0.3,statrScale: number = 1.1,endScale:number = 1, isRepeat: boolean = true, times: number = 3) {
//     if (isRepeat == null) isRepeat = true
//     let scale1 = tween().to(time, { scale: statrScale })
//     let scale2 = tween().to(time, { scale: endScale })
//     var tween = tween().sequence(scale1, scale2)
//     if (isRepeat) {
//       tween(node).repeatForever(tween).start()
//     } else {
//       tween(node).repeat(times, tween).start()
//     }
//   }
//     /**
//      * 上下引导特效
//      * @param node 
//      * @param y 
//      * @param time 
//      */
//     public static UpDownGuide(node: Node, disY: number = 10, time: number = 0.1) {
//         node.stopAllActions()
//         tween(node).repeatForever(
//             tween().to(time, { scale: 1.15, y: node.y + disY })
//                 .to(time, { scale: 1.15, y: node.y - disY })
//         ).start()
//     }
//     /**?
//      * 旋转引导特效
//      * @param 时间间隔
//      */
//     public static RotateGuideEffect
//     (node: Node, lightNode: Node, startAngle: number = 0, endAngle: number = 12, time = 0.12) {
//         node.stopAllActions()
//         node.angle = startAngle
//         tween(node).repeatForever(
//             tween(node)
//                 .to(time, { angle: endAngle })
//                 .to(time, { angle: startAngle })
//         ).start()
//         tween(lightNode).repeatForever(
//             tween(lightNode)
//                 .to(time, { opacity: 255 })
//                 .to(time, { opacity: 0 })
//         ).start()
//     }
//     /**?
//      * 引导特效1
//      */
//     public static GuideEffect1(node: Node, lightNode: Node, clickTime: number = 3, clickSclae: number = 1.15, endScale: number = 2, clickGapTime: number = 0.3, moveTime: number = 0.5) {
//         lightNode.opacity = 0
//         node.active = true
//         let clickTween = tween(node)
//             .to(clickGapTime, { scale: 1 })
//             .to(clickGapTime, { scale: clickSclae })
//             .start()
//         tween(node).repeatForever(
//             tween(node).repeat(clickTime, clickTween)
//                 .to(clickGapTime, { scale: 1 })
//                 .delay(0.1)
//                 .to(moveTime, { x: node.x + 200, y: node.y - 200, scale: endScale, opacity: 0 }, { easing: 'quadOut' })
//                 .delay(0.2)
//                 .to(moveTime, { x: node.x, y: node.y, scale: 1, opacity: 255 }, { easing: 'quadInOut' })
//                 .start()
//         ).start()
//         tween(lightNode).repeatForever(
//             tween(lightNode)
//             .delay(clickGapTime)
//             .repeat(clickTime,tween(lightNode)
//             .to(clickGapTime,{opacity:0})
//             .to(clickGapTime,{opacity:255})
//              )
//              .to(0.01,{opacity:0})
//              .delay(0.3+moveTime*2)
//              .start()
//         ).start()

//     }

//     //按钮
//     /**
//      * Q弹 按钮动态
//      */
//     public static BtnElasticX(node: Node, startScaleX: number = 0.7, endSclaeX: number = 1.25, time: number = 0.3) {
//         node.stopAllActions()
//         tween(node).repeatForever(
//             tween(node).delay(time)
//                 .to(time, { scaleX: startScaleX })
//                 .to(time, { scaleX: endSclaeX })
//                 .to(time, { scaleX: 1 })
//         ).start()
//     }

//     public static BtnElasticY(node: Node, startScaleY: number = 0.7, endSclaeY: number = 1.25, time: number = 0.3) {
//         node.stopAllActions()
//         tween(node).repeatForever(
//             tween(node).delay(time)
//                 .to(time, { scaleY: startScaleY })
//                 .to(time, { scaleY: endSclaeY })
//                 .to(time, { scaleY: 1 })
//         ).start()
//     }
// }