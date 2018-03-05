import { Component, NgZone,ViewChild } from '@angular/core';
import { TextToSpeech } from '@ionic-native/text-to-speech';
import { Content } from 'ionic-angular';

declare var window;

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  messages: any[] = [];
  text: string = '';
  @ViewChild(Content) content;

  constructor(public ngZone: NgZone, private tts: TextToSpeech) {
    this.messages.push({
      text: 'Hi,How can I help you?',
      sender: 'api'
    });
  }

  sendText() {
    let message = this.text;
    this.messages.push({
      text: message,
      sender: 'me'
    });
    this.content.scrollToBottom(200);
    this.text = '';
    window['ApiAIPlugin'].requestText({
      query: message
    }, (response) => {

      this.ngZone.run(() => {
        this.messages.push({
          text: response.result.fulfillment.speech,
          sender: 'api'
        });
        this.content.scrollToBottom(200);
      });

    }, (error) => {
      alert("Error:" + JSON.stringify(error));
    });
  }

  sendVoice() {

    window['ApiAIPlugin'].requestVoice({},
      (response) => {
          this.tts.speak({ 
            text: response.result.fulfillment.speech, 
            locale: 'en-IN', 
            rate: 1 });
      }, (error) => {
        alert("Error:Voice" + JSON.stringify(error));
      });
  }

}
