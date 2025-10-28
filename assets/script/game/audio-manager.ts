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

    public audioComp: AudioSource = null!;

    __preload(){
        Constants.auidoManager = this
    }
    start() {
        this.audioComp = this.getComponent(AudioSource)!;
    }

    playSound(play = true) {
        if(!play){
            this.audioComp.stop();
            return;
        }

        this.audioComp.clip = this.bg;
        this.audioComp.play();
    }

    playClip() {
        // this.audioComp.playOneShot(RESSpriteFrame.instance.clickAudioClip);
        // AudioSource.prototype.playOneShot(RESSpriteFrame.instance.clickAudioClip,1)
        Constants.auidoManager.audioComp.playOneShot(RESSpriteFrame.instance.clickAudioClip,1)

    }
    playClip1(audio:AudioClip){
        Constants.auidoManager.audioComp.playOneShot(audio,1)
    }

}
