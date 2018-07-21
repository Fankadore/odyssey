"use strict";

export default {
  shuffle = (array) => {
    let currentIndex = array.length;
    let temp;
    let randomIndex;
    while (currentIndex !== 0) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;
      temp = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temp;
    }
    return array;
  },
  swap = (array, i, j) => {
    let temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  },  
  lerp = (start, end, time) => {
    //return start + (time * (end - start));
    return ((1 - time) * start) + (time * end);
  },  
  clamp = (value, min, max) => {
    if (value < min) {
      return min;
    }
    else if (value > max) {
      return max;
    }
    else {
      return value;
    }
  }
};