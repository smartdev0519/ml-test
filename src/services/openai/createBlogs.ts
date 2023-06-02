import { createAutoGPT } from './init/initAutoGpt';
import { BaseChatMessage } from 'langchain/dist/schema';

const createBlogsByAutoGpt = (data, socket) => {
    const { goals, temperature } = data;
    let message:any[] = [];
    let counter = 0;
    let response;
    let autogpt = createAutoGPT(temperature);
    autogpt.run(goals).then((value) => {
      response = value;
      console.log('response', response);
    });
    let myTimer = setInterval( function() {
      let histories = autogpt.fullMessageHistory;
      if(histories.length > counter) {
        const currentItem = histories[histories.length - 1];
        if(currentItem._getType() === 'ai') {
          message.push(JSON.parse(currentItem.text));
          socket.emit('response-auto-create-blogs', {...message[message.length - 1]});
        }
        counter = histories.length;
      }  
      if(response) {
        clearInterval(myTimer);
      }
    }, 500);
}

const getFinalDataFromMessageHistory = (histories: BaseChatMessage[]) => {
    let data: string[] = [];
    for(let i in histories) {
        let history = histories[i];
        if(history._getType() === 'ai') {
            let text = history.text;
            let jsonData = JSON.parse(text);
            let args = jsonData.command.args;
            if(args.text) {
                data.push(args.text);
            }
        }
    }
    return data;
}

export default createBlogsByAutoGpt;