import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {ControlValueAccessor, FormGroup, NG_VALUE_ACCESSOR} from "@angular/forms";

@Component({
  selector: 'app-input',
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: InputComponent,
      multi: true
    }]
})
export class InputComponent implements ControlValueAccessor {
  @Input() placeholder: string = "";
  @Input() inputValue: string = "";
  @Input() errorMessage?: string;

  constructor() { }

  onChange: any = () => {}
  onTouch: any = () => {}

  public onBlur(): void {
    this.onTouch();
  }

  set value(val: string){
    this.inputValue = val;
    this.onChange(val);
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouch = fn;
  }

  writeValue(obj: any): void {
    this.value = obj;
  }

}
