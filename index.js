const Discord = require('discord.js');
const config = require('./config.js');
const client = new Discord.Client();


var UserID = new Map();
/*function mapstruct(){
    this.
}*/

/*function ID(message){
    const userId = message.guild.members.cache.find(member => member.id === message.author.id)
    return userId;
}*/
function MessageCount(message){
    if(UserID.has(message.author.username))
    {var NewValue = UserID.get(message.author.username); UserID.delete(message.author.username); UserID.set(message.author.username,NewValue+1);}
    else UserID.set(message.author.username,1);
}
function cout(message){
    console.log(UserID.get(message.author.username));
}
/*function CreateCategory(message){
    message.guild.createChannel("NAME OF THE CHANNEL", "category");
}*/
function MakeList(Num,message){
    var i = 1;
    while(i<=Num){
        const UserName = message.author.username;
        //const UserName = client.users.cache.get(ID(message)); 
        //message.reply(UserName);
        message.guild.channels.create("#TOP"+ i +" : " + UserName + "(" + UserID.get(UserName)+ ")" ,{type: 'voice'})
        //.then((channel)=> {});
        i++;
    }
}


client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
  client.user.setActivity('!activitylist <number>',{type: "LISTENING"});
});


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
        MakeList(NUMBER,msg);
        else msg.reply('You can not create a new Activity List because  ' + args[1] + '  is not a NUMBER!');
    } //else if(){

   // }
});

client.login(config.token);