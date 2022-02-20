import Map1 from './map1.js';
import Map2 from './map2.js';

export default function load(mapId, canvas){
  switch(mapId){
    case 1:
      return new Map1(canvas);
    case 2:
      return new Map2(canvas);
    default:
      return new Map1(canvas);
  }
} 