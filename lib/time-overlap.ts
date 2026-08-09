export function overlaps(aStart:number,aEnd:number,bStart:number,bEnd:number){
 return aStart < bEnd && bStart < aEnd;
}
export function fitsWithin(start:number,end:number,workStart:number,workEnd:number){
 return start>=workStart && end<=workEnd;
}
