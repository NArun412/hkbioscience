import {Inject, Injectable } from '@angular/core';
import nlp from 'compromise';
import Fuse from 'fuse.js';
import { ChatModel } from '../../Model/ChatModel';
import { TrainbotGet } from '../../Model/TrainbotGet';
import { Observable } from 'rxjs';
import { Chatlog } from '../../Model/Chatlog';
import { Category } from '../../Model/Category';
import {HttpService} from '../services/http-service'

@Injectable({
  providedIn: 'root'
})
export class ChatService {
private responses: ChatModel[] = [];
  private fuse: Fuse<ChatModel>;

  constructor(@Inject(HttpService) private httpservice: HttpService) {
    // You should initialize `fuse` only when `responses` are loaded
    this.fuse = new Fuse(this.responses, {
      threshold: 0.3,
      includeScore: true,
      keys: ['keywords']
    });
  }

  updateChatlog(chatlog: Chatlog[]) {
    const UpdateChatlogAPI= 'Chatbot/UpdateChatlog';
    return this.httpservice.post<any>(UpdateChatlogAPI, chatlog);
  }

  getBotData(): Observable<ChatModel[]> {
    let FetchBotDataAPI:any= 'Chatbot/FetchBotData';
    return this.httpservice.get<ChatModel[]>(FetchBotDataAPI);
  }

  getTraindata(): Observable<TrainbotGet[]> {
    let FetchBotDataAPI:any= 'Chatbot/FetchTrainBotData';
    return this.httpservice.get<TrainbotGet[]>(FetchBotDataAPI);
  }

  UpdateBot(UpdatedId: number, selectedval: string, textType: string, Isinsert:boolean) {
    const UpdateBotData = `Chatbot/UpdateBotData?Intentid=${UpdatedId}&textval=${selectedval}&textType=${textType}&Isinsert=${Isinsert}`;
    return this.httpservice.get<any>(UpdateBotData);
    
  }

  deleteEvent(value: any, id: any, title: string) {
    const DeleteBotData = `Chatbot/DeleteBotData?value=${value}&id=${id}&title=${title}`;
    return this.httpservice.get<any>(DeleteBotData);
  }

  AddIntentBot(textintent: string, textkeyword: string, textresponse: string) {
    const AddBotData = `Chatbot/AddBotData?textintent=${textintent}&textkeyword=${textkeyword}&textresponse=${textresponse}`;
    return this.httpservice.get<any>(AddBotData);
  }



  // Method to load data and re-initialize Fuse with the new data
  public getdata(message: string, responses: ChatModel[]) {
    this.responses = responses;  // Assign passed data to the class variable
    this.reinitializeFuse();     // Reinitialize Fuse with the updated responses
    return this.processMessage(message);
  }

  // Reinitialize Fuse when responses data changes
  private reinitializeFuse() {
    this.fuse = new Fuse(this.responses, {
      threshold: 0.3, // Adjust the threshold for fuzziness
      includeScore: true,
      keys: ['keywords'] // This should match the structure of your data
    });
  }

  // Process the message and search for the best matching intent
  private processMessage(message: string){
    const doc = nlp(message.toLowerCase());
    const query = doc.out('text');

    // Perform fuzzy matching to find the best matching intent
    const result = this.fuse.search(query);

    // Check if result is defined and has valid entries
    if (result.length > 0) {
      const bestMatch = result[0];
      const bestMatchScore = bestMatch.score !== undefined ? bestMatch.score : 1;

      // Ensure the match is below the threshold
      if (bestMatchScore <= 0.3) {
        const currentIntent = bestMatch.item.intentName;

        // Return a random response based on the matched intent
        const response= this.getRandomResponse(currentIntent,false);
        return response;
      }
    }

    // Fallback if no intent no matches
    const response = this.getRandomResponse('nomatches',true);
    return response;
  }

  // Select a random response for a given intent
  private getRandomResponse(intent: string,Isnomatches:boolean) {
    const response = this.responses.find(r => r.intentName ===intent);
    const responses = response ? response.responses : ["Unfortunately, the chat service is currently down. We recommend trying again in a little while."];
    const randomResponse = responses[Math.floor(Math.random() * responses.length)];
  return {
    Responses: randomResponse,
    ISnomatches: Isnomatches,
    IntentId:response?.id,
  };
  }
}
