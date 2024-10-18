const container = document.getElementById('bars-container');
const algorithmSelect = document.getElementById('algorithm');
const speedInput = document.getElementById('speed');
const speedValue = document.getElementById('speed-value');
const barCountInput = document.getElementById('barCount');
const barCountValue = document.getElementById('bar-count-value');
const description = document.getElementById('algorithm-description');
const downloadButton = document.getElementById('download');
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

let array = [];
let delay = 50;  // Geschwindigkeit der Animation
let numBars = 30;  // Anzahl der Balken

// Geschwindigkeit aktualisieren
speedInput.addEventListener('input', function() {
  delay = parseInt(speedInput.value);
  speedValue.textContent = delay;
});

// Balkenanzahl aktualisieren
barCountInput.addEventListener('input', function() {
  numBars = parseInt(barCountInput.value);
  barCountValue.textContent = numBars;
  array = generateRandomArray(numBars);
  createBars(array);
});

// Erklärungen für die verschiedenen Algorithmen
const algorithmDescriptions = {
  bubble: "Bubble Sort ist ein einfacher Vergleichs-basierter Algorithmus. Er arbeitet durch wiederholtes Tauschen benachbarter Elemente, wenn sie in der falschen Reihenfolge sind.",
  quick: "Quick Sort ist ein schneller, auf dem Teilen-und-Herrsche-Prinzip basierender Algorithmus. Er wählt ein Pivot-Element und sortiert die restlichen Elemente um das Pivot herum.",
  insertion: "Insertion Sort ist ein inkrementeller Sortieralgorithmus, der jedes neue Element in die bereits sortierte Liste einfügt.",
  selection: "Selection Sort ist ein einfacher Algorithmus, der wiederholt das kleinste Element im unsortierten Teil der Liste auswählt und es an die richtige Position bringt.",
  merge: "Merge Sort ist ein auf Teilen-und-Herrsche-Prinzip basierender Algorithmus, der das Array in zwei Hälften teilt, sortiert und dann wieder zusammenführt."
};

// Beschreibung basierend auf der Auswahl des Algorithmus aktualisieren
function updateDescription() {
  const selectedAlgorithm = algorithmSelect.value;
  description.textContent = algorithmDescriptions[selectedAlgorithm];
}

// Zufälliges Array generieren
function generateRandomArray(size) {
  return Array.from({ length: size }, () => Math.floor(Math.random() * 100) + 1);
}

// Balken basierend auf Array erstellen
function createBars(arr) {
  container.innerHTML = '';
  arr.forEach(value => {
    const bar = document.createElement('div');
    bar.style.height = `${value * 3}px`;
    bar.style.width = `${Math.floor(600 / arr.length)}px`;  // Größe der Balken basierend auf der Anzahl anpassen
    bar.classList.add('bar');
    container.appendChild(bar);
  });
}

// Animation mit `requestAnimationFrame` für flüssigere Bewegungen
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Bubble Sort Algorithmus
async function bubbleSort(arr) {
  let n = arr.length;
  for (let i = 0; i < n - 1; i++) {
    for (let j = 0; j < n - i - 1; j++) {
      if (arr[j] > arr[j + 1]) {
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
        createBars(arr);
        await sleep(delay);
      }
    }
  }
}

// Quick Sort Algorithmus
async function quickSort(arr, low = 0, high = arr.length - 1) {
  if (low < high) {
    const pi = await partition(arr, low, high);
    await quickSort(arr, low, pi - 1);
    await quickSort(arr, pi + 1, high);
  }
}

async function partition(arr, low, high) {
  const pivot = arr[high];
  let i = low - 1;
  for (let j = low; j < high; j++) {
    if (arr[j] < pivot) {
      i++;
      [arr[i], arr[j]] = [arr[j], arr[i]];
      createBars(arr);
      await sleep(delay);
    }
  }
  [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
  createBars(arr);
  await sleep(delay);
  return i + 1;
}

// Insertion Sort Algorithmus
async function insertionSort(arr) {
  let n = arr.length;
  for (let i = 1; i < n; i++) {
    let key = arr[i];
    let j = i - 1;
    while (j >= 0 && arr[j] > key) {
      arr[j + 1] = arr[j];
      j = j - 1;
      createBars(arr);
      await sleep(delay);
    }
    arr[j + 1] = key;
    createBars(arr);
    await sleep(delay);
  }
}

// Selection Sort Algorithmus
async function selectionSort(arr) {
  let n = arr.length;
  for (let i = 0; i < n; i++) {
    let minIdx = i;
    for (let j = i + 1; j < n; j++) {
      if (arr[j] < arr[minIdx]) {
        minIdx = j;
      }
    }
    if (minIdx !== i) {
      [arr[i], arr[minIdx]] = [arr[minIdx], arr[i]];
      createBars(arr);
      await sleep(delay);
    }
  }
}

// Merge Sort Algorithmus
async function mergeSort(arr, l = 0, r = arr.length - 1) {
  if (l >= r) return;
  const m = l + Math.floor((r - l) / 2);
  await mergeSort(arr, l, m);
  await mergeSort(arr, m + 1, r);
  await merge(arr, l, m, r);
}

async function merge(arr, l, m, r) {
  const leftArr = arr.slice(l, m + 1);
  const rightArr = arr.slice(m + 1, r + 1);
  let i = 0, j = 0, k = l;
  
  while (i < leftArr.length && j < rightArr.length) {
    if (leftArr[i] <= rightArr[j]) {
      arr[k] = leftArr[i];
      i++;
    } else {
      arr[k] = rightArr[j];
      j++;
    }
    k++;
    createBars(arr);
    await sleep(delay);
  }
  while (i < leftArr.length) {
    arr[k] = leftArr[i];
    i++;
    k++;
    createBars(arr);
    await sleep(delay);
  }
  while (j < rightArr.length) {
    arr[k] = rightArr[j];
    j++;
    k++;
    createBars(arr);
    await sleep(delay);
  }
}

// Starten des Sortierens basierend auf der Auswahl des Algorithmus
function startSort() {
  const selectedAlgorithm = algorithmSelect.value;
  switch (selectedAlgorithm) {
    case 'bubble':
      bubbleSort([...array]);
      break;
    case 'quick':
      quickSort([...array]);
      break;
    case 'insertion':
      insertionSort([...array]);
      break;
    case 'selection':
      selectionSort([...array]);
      break;
    case 'merge':
      mergeSort([...array]);
      break;
  }
}

// Download der Animation als Bild
downloadButton.addEventListener('click', () => {
  canvas.width = container.offsetWidth;
  canvas.height = container.offsetHeight;

  const bars = container.children;
  const barWidth = canvas.width / bars.length;

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  Array.from(bars).forEach((bar, index) => {
    const height = parseFloat(bar.style.height);
    ctx.fillStyle = 'teal';
    ctx.fillRect(index * barWidth, canvas.height - height, barWidth - 1, height);
  });

  const link = document.createElement('a');
  link.download = 'sort-animation.png';
  link.href = canvas.toDataURL();
  link.click();
});

// Initiales Array und Balken erzeugen
array = generateRandomArray(numBars);
createBars(array);
