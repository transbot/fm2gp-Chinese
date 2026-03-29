export interface SearchStep {
  phase: 'lower_bound' | 'upper_bound' | 'lower_bound_done' | 'upper_bound_done';
  left: number;
  right: number;
  mid?: number;
  target: number;
  valueAtMid?: number;
}

export interface SortStep {
  array: number[];
  pivotIdx?: number;
  comparing?: [number, number];
  swapping?: [number, number];
}

// In-place QuickSort Generator
export function* quickSortGenerator(arr: number[], low = 0, high = arr.length - 1): Generator<SortStep, void, void> {
  if (low < high) {
    let pivot = arr[high];
    let i = low - 1;

    for (let j = low; j < high; j++) {
      yield { array: [...arr], pivotIdx: high, comparing: [j, high] };
      if (arr[j] < pivot) {
        i++;
        // Swap
        let temp = arr[i];
        arr[i] = arr[j];
        arr[j] = temp;
        yield { array: [...arr], pivotIdx: high, swapping: [i, j] };
      }
    }

    // Swap pivot to correct position
    let temp = arr[i + 1];
    arr[i + 1] = arr[high];
    arr[high] = temp;
    let pi = i + 1;
    
    yield { array: [...arr], pivotIdx: pi, swapping: [pi, high] };

    yield* quickSortGenerator(arr, low, pi - 1);
    yield* quickSortGenerator(arr, pi + 1, high);
  }
}

// Binary Search Lower Bound
// Returns the first iterator i in [0, array.length) such that array[i] >= a
export function* lowerBoundGenerator(arr: number[], a: number): Generator<SearchStep, number, void> {
  let left = 0;
  let right = arr.length; // half-open interval [left, right)
  
  while (left !== right) {
    let half = Math.floor((right - left) / 2);
    let mid = left + half;
    
    yield { phase: 'lower_bound', left, right, mid, target: a, valueAtMid: arr[mid] };
    
    if (arr[mid] < a) {
      left = mid + 1;
    } else {
      right = mid;
    }
  }
  
  yield { phase: 'lower_bound_done', left, right, target: a };
  return left;
}

// Binary Search Upper Bound
// Returns the first iterator i in [0, array.length) such that a < array[i]
export function* upperBoundGenerator(arr: number[], a: number): Generator<SearchStep, number, void> {
  let left = 0;
  let right = arr.length;
  
  while (left !== right) {
    let half = Math.floor((right - left) / 2);
    let mid = left + half;
    
    yield { phase: 'upper_bound', left, right, mid, target: a, valueAtMid: arr[mid] };
    
    if (a < arr[mid]) {
      right = mid;
    } else {
      left = mid + 1;
    }
  }
  
  yield { phase: 'upper_bound_done', left, right, target: a };
  return left;
}
