import { AudioClip, Component, _decorator } from "cc";

const { ccclass, property } = _decorator;

@ccclass
export default class RESSpriteFrame extends Component {
    public static instance: RESSpriteFrame;

    //声音
    @property({ type: AudioClip })
    public clickAudioClip: AudioClip = null!;
    @property({ type: AudioClip })
    public bgmAudioClip: AudioClip = null!;
    @property({ type: AudioClip })
    public numberAddAudioClip: AudioClip = null!;
    @property({ type: AudioClip })
    public comeOutAudioClip: AudioClip = null!;
    @property({ type: AudioClip })
    public cherrUpAudioClip: AudioClip = null!;
    @property({ type: AudioClip })
    public getCoinAudioClip: AudioClip = null!;
    @property({ type: AudioClip })
    public failAudioClip: AudioClip = null!;
    start() {
        RESSpriteFrame.instance = this;
    }
}
