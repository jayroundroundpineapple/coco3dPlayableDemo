import { _decorator, Component, Node, Material, UIRenderer } from "cc";
const { ccclass, property } = _decorator;

export const utils = {
    getDiffCoeff: function (e: number, t: number, a: number) {
        return (a * e + 1) / (1 * e + ((a + 1) / t - 1));
    },

    getRandomInt: function (min: number, max: number) {
        var r = Math.random();
        var rr = r * (max - min + 1) + min;
        return Math.floor(rr);
    },
    /**汇率浮点数处理 */
    getFloatNum(a: number, b: number) {
        let aLen = a.toString().split(".")[1]?.length || 0
        let bLen = b.toString().split(".")[1]?.length || 0
        let powLen = Math.max(aLen, bLen)
        let power = Math.pow(10, powLen)
        const compare = (n: number) => {
            let result = Math.round(n)
            return n - result < Number.EPSILON ? result : n    //最小浮点数之间的差值
        }
        return compare(a * power) * compare(b * power) / power / power
    },
    // setGrey(node: Node | Component, grey: boolean = true) {
    //     const components = node.getComponentsInChildren(UIRenderer)
    //     if (components.length > 0) {
    //         // var material = cc.Material.createWithBuiltin(grey ? cc.Material.BUILTIN_NAME.GRAY_SPRITE: cc.Material.BUILTIN_NAME.SPRITE,0)
    //         var material = Material['getBuiltinMaterial'](grey ? Material.BUILTIN_NAME.GRAY_SPRITE : Material.BUILTIN_NAME.SPRITE)

    //     }
    //     for (let i = 0; i < components.length; i++) {
    //         const component = components[i]
    //         component.setMaterial(0, material)
    //     }
    // },
    /**
    * 角度值转换为弧度制
    * @param angle
    */
    getRadian(angle: number): number {
        return angle / 180 * Math.PI;
    },
    /**
   * 获取一个区间的随机数
   * @param $from 最小值
   * @param $end 最大值
   * @returns {number}
   */
    limit($from: number, $end: number): number {
        $from = Math.min($from, $end);
        $end = Math.max($from, $end);
        let range: number = $end - $from;
        return $from + Math.random() * range;
    }
}
