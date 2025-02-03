const { TelegramClient } = require("telegram");
const { StringSession } = require("telegram/sessions");
const { NewMessage } = require("telegram/events");
const input = require('input');

let channelName = 'Telegram', id = 0, hash = '', session = [];
let client = [], dialogs = [], prevMsgs = [], msgs = [];
let prevResult = '', result = '', blocked = false;


id = parseInt(process.env.ID);
hash = process.env.HASH;
session = new StringSession(process.env.SESSION);
OnInit();






async function handler() {

    return new Promise(async (resolve) => {
    //Get all open conversations, print the title of the first
    dialogs = await client.getDialogs({archived:false});

    //Channel name
    if (dialogs[0].title == channelName) {
        
        let k = 0;
        msgs = await client.getMessages(dialogs[0], { limit: 50 });
  
        for (let i = 0; i <= k; i++) {        
          if (msgs[i].className == 'Message' && prevResult == msgs[i].message) {       
  
            prevResult = msgs[0].message;
            break;
          }
          k++;//New messages received
        }
  
        if (k == 0) { return resolve("Done"); }

        for (let i = 0; i <= k - 1; i++) {
          if (msgs[i].className != 'Message')
            continue;
    
            result = `{${msgs[i].message}}`;
            console.log(new Date().toLocaleString(),` ---- ${dialogs[0].title}:\n`,result,"\n");
        }

    } 
  return resolve("Done");});
}



async function OnInit() {

  client = new TelegramClient(session, id, hash, { connectionRetries: 5 });
  await client.start({
  //   phoneNumber: async () => await input.text("Please enter your number: "),
  //   password: async () => await input.text("Please enter your password: "),
  //   phoneCode: async () => await input.text("Please enter the code you received: "),
  //   onError: (err) => console.log(err),
  });
  // console.log("Save the following string to avoid logging in again:\n");
  // console.log(client.session.save(),"\n"); // Save this string to avoid logging in again
  //Let's find our chat
  dialogs = await client.getDialogs({archived:false});
  let pos = 0;
  for (let i = 0; i <= pos; i++) {
    if (dialogs[i].title == channelName)
      break;

    pos++;
  }
  
  prevMsgs = await client.getMessages(dialogs[pos], { limit: 1 });   
  if(prevMsgs[0].className == 'Message')
      prevResult = prevMsgs[0].message;
  
  //console.log(prevMsgs[0]);
  console.log(`Last message on ${dialogs[pos].title}:\n${prevResult}\n`);

  client.addEventHandler( async function() { if(blocked == true) return; blocked = true; await handler(); blocked = false; }, new NewMessage({}));
}