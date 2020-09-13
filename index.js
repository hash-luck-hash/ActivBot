const Discord = require('discord.js');
const config = require('./config.js');
const PriorityQueue = require('js-priority-queue');
const { Server } = require('http');
const client = new Discord.Client();


function PriorityQStruct(num,USERidNAME){
    this.num=num;
    this.USERidNAME=USERidNAME;
}
var MessageID;
var Topmembers = 0;
var UserID = new Map();
var compareNumbers = function(a, b) { return a.num - b.num; };
var queue = new PriorityQueue({ comparator: compareNumbers });
var helpqueue = new  Array();
var ChannelsToDelete = new Array();
/*function mapstruct(){
    this.
}*/

/*function ID(message){
    const userId = message.guild.members.cache.find(member => member.id === message.author.id)
    return userId;
}*/
function MessageCount(message){
    if(UserID.has(message.author.username)){
    var NewValue = UserID.get(message.author.username);
         UserID.delete(message.author.username);
          UserID.set(message.author.username,NewValue+1);}
    else {
        UserID.set(message.author.username,1);
        queue.queue(new PriorityQStruct(-1,message.author.username));//////////////QUEUE
    }
}
function cout(message){
    console.log(UserID.get(message.author.username));
}
/*function CreateCategory(message){
    message.guild.createChannel("NAME OF THE CHANNEL", "category");
}*/
function NumList(nr,message){
    Topmembers = nr;
    MessageID = message;
}
function ReloadQueue(){
    //if(queue.length>0) console.log(queue.peek());
    helpqueue.length=0;
    while(queue.length>0){
        helpqueue.push(queue.dequeue());
    }
    while(helpqueue.length>0){
        var Elements = helpqueue.pop();
        queue.queue(new PriorityQStruct(-(UserID.get(Elements.USERidNAME)),
        Elements.USERidNAME));
    }
    helpqueue.length=0;
}
function TopQueue(Num){
   helpqueue.length=0;
   var helpqueue2 = new Array();
    var i = 1;
   while(queue.length>=1&&i<=Num){
       var Val = queue.dequeue();
       helpqueue.push(Val);
       helpqueue2.push(Val);
   }
   while(helpqueue2.length>0){
       queue.queue(helpqueue2.pop());
   }
}
function MakeList(Num,message){
    var i = 1;
    TopQueue(Num);
    console.log(helpqueue);
    while(i<=Num&&helpqueue.length>=i){
        const UserName = helpqueue[i-1].USERidNAME;
        let Description = "#TOP"+ i +" : " + UserName + "(" + UserID.get(UserName)+ ")";
        message.guild.channels.create(Description,{type: 'voice'}).then((channel)=> {});
        ChannelsToDelete.push(Description);
        i++;
    }
}
function DeleteChannels(){
    if(!MessageID) return;
    for(i = 0;i<ChannelsToDelete.length;i++){
        const fetchedChannel = MessageID.guild.channels.cache.find(r => r.name === ChannelsToDelete[i]);
        fetchedChannel.delete();
    }
    ChannelsToDelete.length = 0;
}
function ReloadList(){
    ReloadQueue();
    DeleteChannels();
    MakeList(Topmembers,MessageID);
}

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
  client.user.setActivity('!activitylist <num>',{type: "LISTENING"});
});

const Reloading = setInterval(() => {    //RELOADING LIST
    ReloadList();
    console.log('Reloading!');
}, 5000);


client.on('message', msg => {

    MessageCount(msg);
    cout(msg);
    if(msg.content.startsWith("!activitylist")){
        if (!msg.member.hasPermission("ADMINISTRATOR)")) return msg.reply("NOPE");
        var args = msg.content
        .trim()
        .split(/ +/g);
        console.log(args);
        var NUMBER = parseInt(args[1],10);
        if(NUMBER==args[1])    
        NumList(NUMBER,msg); /////TWORZENIE LISTY
        else msg.reply('You can not create a new Activity List because  ' + args[1] + '  is not a NUMBER!');
    } //else if(){

   // }
});

client.login(config.token);