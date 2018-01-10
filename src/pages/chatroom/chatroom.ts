import { Component } from '@angular/core';
import {  IonicPage, NavParams, ToastController,Platform,NavController } from 'ionic-angular';
import { SendMessageWithContent } from '../../interfaces/user-options';
import { SetupService } from '../../providers/setup.services'; 
import   *as socketIOClient  from 'socket.io-client';
import *as sailsIOClient  from 'sails.io.js';
import * as io from 'socket.io-client'

@IonicPage()
@Component({
  selector: 'page-chat-room',
  templateUrl: 'chatroom.html',
})
export class ChatroomPage {   
  nickname = '';
  chatId = '';
  responseData:any;
  data:any;
  msg:any;
  user:any;
  socket:any;
  io:any= sailsIOClient(socketIOClient);
  messageDetails: SendMessageWithContent = { sender: '', recipient: '',content:'',chatId:'' };
  messages =[];
 chatid={
           "chatId": ""           
  }

  myInfo = this.messages[0];
  constructor( public platform:Platform,private navCtrl:NavController,private navParams: NavParams, public _setupService: SetupService, 
    private toastCtrl: ToastController) {
      //this.io.sails.url = 'http://192.168.1.32:1338';
       this.io.sails.url = 'http://192.168.0.128:1338';
     this.user=JSON.parse(localStorage.getItem('logindetail'));     
        let backAction =  platform.registerBackButtonAction(() => {        
        this.navCtrl.pop();
        backAction();
      },2)

    this.messageDetails.sender=this.navParams.get('sender'); 
    this.nickname = this.messageDetails.sender;
    this.messageDetails.recipient=this.navParams.get('receiver');
    // this.messageDetails.chatId=this.navParams.get('chatId');
    this.messageDetails.chatId="33";
    this.chatid.chatId=this.messageDetails.chatId;
    
     this.io.socket.get('/chat/sendMessage',{chatId:33}, function(data, response){
      console.log("response = = "+response);
     });

     this.io.socket.on('NEWMESSAGE', function(response){
    
    })

   // this.ionViewWillLeave();  
   this._setupService.getChatMessages({chatId:33}).subscribe((response)=>{

     if(response.statusCode==200){
       this.data = response.data;
     }
   });

   //   if(this.chatid.chatId){
  //  //  this._setupService.getChatMessages(this.chatid).subscribe((response)=>{
  //  //   this.messages=response.data;  
  //  //  console.log("data = = "+JSON.stringify(this.data));     
  //  // })
  //  this._setupService.getOldMessage().subscribe((response)=>{
  //    this.messages=response.data;    
  //  })
  // }
 }


sendMessage(newInfo: string) {    
   //   // alert("this.messageDetails.sender = "+this.messageDetails.sender);
   //   this.io.socket.post('/chat/sendMessage',this.messageDetails, function(data, response){
   //    // debugger;
   //     if(response.statusCode == 200){
   //       this.messages.push({
   //         sender : 'panja',
   //         content : this.messageDetails.content ,
   //         createdAt :  new Date()
   //         });
   //     }
   //   console.log("response  = = "+JSON.stringify(response));    
   // });
     this._setupService.getcurrentMessage().subscribe((response)=>{
              this.messages=response.data;
      });
  }
  
 ionViewWillLeave() {
   this.io.socket.disconnect();
   delete this.io.sails;
  }

 

  showToast(msg) {
    let toast = this.toastCtrl.create({
      message: msg,
      duration: 2000
    });
    toast.present();
  }
}

class ContactInfo {
  constructor(public description: string) {}
}