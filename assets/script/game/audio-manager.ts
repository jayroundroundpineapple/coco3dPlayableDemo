import { constants } from "buffer";
import { _decorator, AudioClip, loader, Component, AudioSource } from "cc";
import { Constants } from "../data/constants";
import RESSpriteFrame from "../RESSpriteFrame";
const { ccclass, property } = _decorator;

@ccclass("AudioManager")
export class AudioManager extends Component{
    @property(AudioClip)
    bg: AudioClip = null!;
    @property(AudioClip)
    click: AudioClip = null!;
    @property({ type: AudioClip })
    public bgmAudioClip: AudioClip = null!;

    public static instance: AudioManager;
    public audioComp: AudioSource = null!;

    __preload(){
        Constants.auidoManager = this
    }
    start() {
        AudioManager.instance = this;
        this.audioComp = this.getComponent(AudioSource)!;
    }

    playSound(audio:AudioClip,loop:boolean = true,volume:number = 1) {
        this.audioComp.clip = audio;
        this.audioComp.play();
        this.audioComp.loop = loop;
        this.audioComp.volume = volume;
    }
    stopSound() {
        this.audioComp.stop();
    }
}
