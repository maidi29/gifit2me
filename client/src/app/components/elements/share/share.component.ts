import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-share',
  templateUrl: './share.component.html',
  styleUrls: ['./share.component.scss']
})
export class ShareComponent {
  @Input() gameId: string = "";
  public message?: string;

  constructor() { }

  private copyToClipboard(str: string) {
    if (navigator && navigator.clipboard && navigator.clipboard.writeText)
      return navigator.clipboard.writeText(str);
    return Promise.reject("The Clipboard API is not available.");
  };

  private displayMessage(msg: string) {
    this.message = msg;
    setTimeout(() => this.message = undefined, 3000)
  }

  public share() {
   if (navigator.share) {
      navigator.share({
        title: 'Invite',
        text: "Play Gif it 2 me online!",
        url: `${window.location.origin}?id=${this.gameId}`,
      }).catch();
    } else {
      this.copyToClipboard(`${window.location.origin}?id=${this.gameId}`).then(
        () => this.displayMessage("Invite link copied to clipboard."),
        () => alert(`Failed to copy the invite link ${window.location}?id=${this.gameId}. Please copy it yourself or tell them the Game ID to enter it manually.`)
      );
    }
  }

}
