import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filter'
})
export class FilterPipe implements PipeTransform {
  // https://stackoverflow.com/questions/49783032/add-search-filter-in-an-observable-array
  transform(athletes: any, searchAthlete: string): any {
    // if (!athletes) {
    //   return [];
    // }
    if (!searchAthlete) {
      return athletes;
    }
    searchAthlete = searchAthlete.toLocaleLowerCase();

    return athletes.filter(it => {
      return it.name.toLowerCase().includes(searchAthlete);
    });
  }

}
