// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    @property(cc.Node)
    button: cc.Node = null;

    @property(cc.EditBox)
    Name: cc.EditBox = null;

    @property(cc.EditBox)
    password: cc.EditBox = null;


    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start () {

    }
    
    hide(){
        this.button.active =true;
        this.node.active=false;
    }
    show(){
        this.button.active = false;
        this.node.active=true;
    }
    play(){
        var player = {  
            "Type": "action.join",      // Request type
            "Name": this.Name.string
        };
        this.node.parent.getComponent("game").ws.send(JSON.stringify(player));
    }
    history(){
        this.node.parent.getComponent("game").ws.send(JSON.stringify({ "Type": "get.history" }));
    }
    alive(){
        this.node.parent.getComponent("game").ws.send(JSON.stringify({ "Type": "get.players" }));
    }
    newGame(){
        var password = {  
            "Type": "system.nextgame",            // Request type
            "Name": this.password.string          // System command password
        };
        this.node.parent.getComponent("game").ws.send(JSON.stringify(password));
    }

    // update (dt) {}
}
