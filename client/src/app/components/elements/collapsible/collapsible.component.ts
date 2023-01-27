import {Component, Input } from '@angular/core';

@Component({
  selector: 'app-collapsible',
  templateUrl: './collapsible.component.html',
  styleUrls: ['./collapsible.component.scss']
})
export class CollapsibleComponent {
  @Input() header: string = "";

  public isOpen = false;

  constructor() { }

  public handleOpen () {
    this.isOpen = !this.isOpen;
  }

}
