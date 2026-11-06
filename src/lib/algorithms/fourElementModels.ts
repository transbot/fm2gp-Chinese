export interface FourElementModel {
  id: 'z4'|'u5'|'u8';
  elements: readonly number[];
  identity: number;
  combine: (x:number,y:number)=>number;
}

export const z4:FourElementModel = {id:'z4',elements:[0,1,2,3],identity:0,combine:(x,y)=>(x+y)%4};
export const u5:FourElementModel = {id:'u5',elements:[1,2,3,4],identity:1,combine:(x,y)=>(x*y)%5};
export const u8:FourElementModel = {id:'u8',elements:[1,3,5,7],identity:1,combine:(x,y)=>(x*y)%8};
export type MapPreset = 'f2'|'f3'|'b';

export function table(model:FourElementModel) {
  return model.elements.map(x=>model.elements.map(y=>model.combine(x,y)));
}

export function properties(model:FourElementModel) {
  const orders=model.elements.map(x=>{
    let current=model.identity;
    for(let k=1;k<=model.elements.length;k++){
      current=model.combine(current,x);
      if(current===model.identity)return k;
    }
    throw new Error('Invalid finite group');
  });
  return {
    orders,
    self:model.elements.map(x=>model.combine(x,x)),
    generators:model.elements.filter((_,i)=>orders[i]===model.elements.length),
  };
}

export function images(preset:MapPreset) {
  if(preset==='b')return [1,2,3,4];
  const generator=preset==='f2'?2:3;
  return z4.elements.map(k=>generator**k%5);
}

export function compare(f:readonly number[],x:number,y:number) {
  const sum=z4.combine(x,y);
  const fx=f[x], fy=f[y];
  return {sum,fx,fy,left:f[sum],right:u5.combine(fx,fy)};
}

export function matchCount(f:readonly number[]) {
  let count=0;
  for(const x of z4.elements)for(const y of z4.elements){
    const {left,right}=compare(f,x,y);
    if(left===right)count++;
  }
  return count;
}
