import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
    name: 'filter'
})
export class FilterPipe implements PipeTransform {
    transform(value: any, args?: string, key?: string): Object[] {
        let filter = args && args.toLowerCase() || null;
        if (filter && Array.isArray(value)) {
            return value.filter(item => {
                if (item[key]) {
                    return item[key].toLowerCase().startsWith(filter);
                }
            }
            );
        } else {
            return value;
        }
    }
}
