const {ccclass, property} = cc._decorator;

import Num, * as num from "./number";

@ccclass
export default class NewClass extends cc.Component {

    @property(cc.Node)
    connectUI:cc.Node=null;
    @property(cc.Button)
    button_url:cc.Button=null;
    @property(cc.EditBox)
    editBox_url:cc.EditBox=null;

    @property(cc.Prefab)
    prefab: cc.Prefab = null;
    
    @property(cc.Node)
    view: cc.Node = null;

    @property
    playerColor: cc.Color[] = [];
    // LIFE-CYCLE CALLBACKS:

    @property
    ws:  WebSocket = null;

    @property(cc.Node)
    gameOver: cc.Node = null;

    @property(cc.Node)
    menu: cc.Node = null;

    @property(cc.Label)
    history: cc.Label = null;

    @property(cc.Label)
    players: cc.Label = null;

    @property
    index: number = null;

    @property(cc.Label)
    Gindex: cc.Label = null;

    @property(cc.Label)
    leader: cc.Label = null;

    server_url:string=null;


    onLoad () { 
        this.connectUI.y=0;
        this.button_url.node.on('click',this.link,this);
    }

    link()
    {
        this.server_url= this.editBox_url.string;
        this.connectUI.y=1000;
        this.ws = new WebSocket("wss://" + this.server_url );
        //console.log('cajcklna');
        //setTimeout(()=>{this.game_start();},3000);
        this.schedule(()=>{
            //console.log('1');
            if(this.ws.readyState===WebSocket.OPEN)
            {
                this.game_start();
            }
        } ,1,0,0)
        
    }

    game_start()
    {
        this.ws.send(JSON.stringify({ "Type": "get.board" }));
        this.ws.send(JSON.stringify({ "Type": "get.players" }));
        
        // setTimeout( ()=>{this.ws.send(JSON.stringify({ "Type": "get.board" }))}, 500);
        // setTimeout( ()=>{this.ws.send(JSON.stringify({ "Type": "get.players" }))}, 600);
        
        this.ws.onmessage =  (event) => {
            var data = JSON.parse(event.data);
            if(data.Client)
            {
                // renew map
                this.index = data.GID;
                //this.Gindex.string = "index:" + this.index;
                for (let i = 0; i < 4096; i++)
                 {
                    var now:number = +data.Client[i];//每格slots的值
                    if( this.view.children[i].getComponent(Num).num != now )
                    {
                        this.view.children[i].getComponent(Num).num = now;//更新資料
                    }
                    if( now != -1)
                    {
                        this.view.children[i].getComponent(Num).up();//決定1~8跟flag
                        //console.log('now');
                    }                      
                }
            }
            else if(data[0]) 
            {
                if(data[0].hasOwnProperty("GID"))
                {
                    // history
                    this.history.string = "(Last Game)\n";
                    if(this.index)
                    {
                        data[this.index-1].Players.sort((n1,n2)=>{return n2.Score-n1.Score;});
                        
                        for(var i:number = 0 ; i<5;i++)
                        {
                            this.history.string += data[this.index-1].Players[i].Name + "\t\t";
                            this.history.string += data[this.index-1].Players[i].Score + "\n";
                        }
                    }
                    this.history.node.parent.active = !this.history.node.parent.active;
                    if(this.players.node.parent.active)this.players.node.parent.active=false;
                    
                }
                else
                {
                // players
                this.players.string = "(Alive Player)\n";
                for(var i:number = 0 ; i<data.length;i++){
                    if(data[i].Alive){
                        this.players.string+=data[i].Name+"\n";
                    }
                }

                    this.leader.string = "Leader  Score\n"
                    data.sort((n1,n2)=>{return n2.Score-n1.Score;});
                    var max = Math.min(5,data.length);

                    for(var i:number = 0 ; i< max ;i++){
                        this.leader.string += data[i].Name + "\t\t";
                        this.leader.string += data[i].Score.toString() + "\n";
                    }

                    this.players.node.parent.active = !this.players.node.parent.active ;
                    if(this.history.node.parent.active)this.history.node.parent.active=false;
                }
            }
            else if(data.Score)
            {   
                //click
                this.ws.send(JSON.stringify({ "Type": "get.board" }));
                if(data.Score==-1){
                    this.gameOver.active = true;
                    setTimeout(()=>{this.menu.active=true;}, 1000);
                }

            }
            else if(data.Msg)
            {
                //newGame
                if(!data.Code)
                {
                    cc.director.loadScene("map");
                }
                else{
                    alert("密碼輸入錯誤");
                }
            }
            else if(data.Pid || (data.Code && !data.hasOwnProperty("Score")))
            {    
                    // join
                if(data.Code == 0)
                {
                    this.gameOver.active = false;
                    this.menu.getComponent("menu").hide();
                }
                else if(data.Code == 1)
                {
                    alert("名字重複");
                }else if(data.Code == 2)
                {
                    alert("現在玩家已滿人");
                }
                else if(data.Code == 3)
                {
                    alert("遊戲玩家已滿人");
                }
                else if(data.Code == 4)
                {
                    alert("已經在遊戲中");
                }
                
            }
        }
    }
    
    start () {
        this.menu.active=true;
        // this.players.node.parent.active = true;

        for (let i = 0; i < 64; i++) {
            for (let j = 0; j < 64; j++) {
                var newStar = cc.instantiate(this.prefab);
                newStar.getComponent(Num).ID = i*64+j;
                this.view.addChild(newStar);
                newStar.setPosition(cc.v2(i*50-1600+25,j*50-1600+25));

            }
            this.playerColor.push( this.randomHexColor());
        }
    }
    
    randomHexColor() {	
        return cc.Color.fromHEX(new cc.Color,'#' + ('01010' + (Math.random() * 0x1000000 << 0).toString(16)).substr(-6));
    }


    update (dt) {
    }
}
