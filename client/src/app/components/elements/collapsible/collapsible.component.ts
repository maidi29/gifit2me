import {Component, OnInit, Input, ViewChild, ElementRef} from '@angular/core';

@Component({
  selector: 'app-collapsible',
  templateUrl: './collapsible.component.html',
  styleUrls: ['./collapsible.component.scss']
})
export class CollapsibleComponent implements OnInit {
  @Input() header: string = "";

  public isOpen = false;

  constructor() { }

  ngOnInit(): void {
  }

  public handleOpen () {
    this.isOpen = !this.isOpen;
  }

}
