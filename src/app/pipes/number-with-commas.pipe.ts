import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'numberWithCommas'
})
export class NumberWithCommasPipe implements PipeTransform {

  transform(value: any, args?: any[]): any {
    let val = null;
    if(value != null){
      val = value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    }

    return val;
  }

}
