import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss']
})
export class ButtonComponent implements OnInit {
  @Input() label!: string;
  @Input() disabled: boolean = false;
  @Input() autoWidth?: boolean = false;
  @Input() secondary?: boolean = false;
  constructor() { }

  ngOnInit(): void {
  }

}
