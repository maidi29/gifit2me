import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-avatar-generator',
  templateUrl: './avatar-generator.component.html',
  styleUrls: ['./avatar-generator.component.scss']
})
export class AvatarGeneratorComponent implements OnInit {
  @Input() show = false;
  @Output() avatar: EventEmitter<string> = new EventEmitter<string>();
  @Output() close: EventEmitter<void> = new EventEmitter<void>();

  constructor() { }

  ngOnInit(): void {}

  public setAvatar(event: string) {
    this.avatar.emit(event);
  }

  public save() {
    this.show = false;
    this.close.emit();
  }

}
