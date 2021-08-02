import Game from "./game"

const {ccclass, property} = cc._decorator;

@ccclass
export default class Num extends cc.Component {

    @property(cc.Label)
    label: cc.Label = null;
    @property(cc.Node)
    flag: cc.Node = null;
    @property
    num: number = null;
    @property
    ID: number = 0;
    @property(cc.Node)
    bg:cc.Node=null;
    @property(cc.SpriteFrame)
    minepic: cc.SpriteFrame = null;
    @property(cc.SpriteFrame)
    flagpic: cc.SpriteFrame = null;
    @property(cc.SpriteFrame)
    openedpic: cc.SpriteFrame = null;
    @property(cc.SpriteFrame)
    unknowpic: cc.SpriteFrame = null;
    @property(cc.SpriteFrame)
    numberpics: cc.SpriteFrame[] = [];

    game:Game=null;

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}
    onLoad () {
        this.game=cc.find('Canvas/Main Camera').getComponent(Game);
        //console.log(this.game);
        this.node.on(cc.Node.EventType.MOUSE_DOWN, this.onMouseDown, this);
    }

    onDestroy () {
        this.node.off(cc.Node.EventType.MOUSE_DOWN, this.onMouseDown, this);
    }
    onMouseDown(event){
        let mouseType = event.getButton();
        if (mouseType === cc.Event.EventMouse.BUTTON_LEFT){
            this.click(false);
            //console.log('left');
        }
        else if(mouseType === cc.Event.EventMouse.BUTTON_RIGHT){
            this.click(true);
            //console.log('right');
        }
        else
        {
            //console.log('middle');
        }
    }
    
    //start () {}

    click(flag:boolean){
        if(this.game.getComponent("game").ws.readyState === WebSocket.OPEN){

            var click = {
                "Type": "action.click", // Request type
                "Index": this.ID,          // Element index of game array
                "Flag": flag       // false: normal click, true: set up flag
            }
            this.game.getComponent("game").ws.send(JSON.stringify(click));
        }
    }

    up(){
        let number = this.num % 10;
        if( number == 9){ 
            this.flag.active=true;
        }
        else if(number > 0){
            this.bg.getComponent(cc.Sprite).spriteFrame=this.numberpics[number-1];
        }else if(number == 0){
            this.bg.getComponent(cc.Sprite).spriteFrame=this.openedpic;
        }else{
            this.bg.getComponent(cc.Sprite).spriteFrame=this.minepic;
        }


        // this.node.getComponent(cc.Button).normalColor = this.randomHexColor();
        
        this.node.getComponent(cc.Button).normalColor = this.game.getComponent("game").playerColor[Math.floor(this.num/10)];
        this.node.getComponent(cc.Button).enabled = false;
    }
    // update (dt) {}
}
