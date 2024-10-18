import tkinter as tk
from tkinter import ttk
import random
import cv2
import numpy as np
import asyncio
import time
from PIL import Image, ImageDraw
import io

class SortingVisualizer:
    def __init__(self, root):
        self.root = root
        self.root.title("Sorting Algorithm Visualization")

        # Variablen
        self.array = []
        self.num_bars = 30
        self.delay = 50
        self.video_frames = []

        # UI-Elemente
        self.canvas = tk.Canvas(root, width=800, height=400, bg="white")
        self.canvas.pack()

        self.algorithm_label = ttk.Label(root, text="Algorithm:")
        self.algorithm_label.pack()
        self.algorithm = ttk.Combobox(root, values=["Bubble Sort", "Quick Sort", "Insertion Sort", "Selection Sort", "Merge Sort"])
        self.algorithm.pack()
        self.algorithm.current(0)

        self.speed_label = ttk.Label(root, text="Speed (ms):")
        self.speed_label.pack()
        self.speed_scale = tk.Scale(root, from_=10, to=500, orient=tk.HORIZONTAL)
        self.speed_scale.set(self.delay)
        self.speed_scale.pack()

        self.bars_label = ttk.Label(root, text="Number of Bars:")
        self.bars_label.pack()
        self.bars_scale = tk.Scale(root, from_=10, to=100, orient=tk.HORIZONTAL)
        self.bars_scale.set(self.num_bars)
        self.bars_scale.pack()

        self.start_button = tk.Button(root, text="Start Sorting", command=self.start_sorting)
        self.start_button.pack()

        self.download_button = tk.Button(root, text="Download Video", command=self.download_video)
        self.download_button.pack()

        self.reset_button = tk.Button(root, text="Reset", command=self.reset)
        self.reset_button.pack()

        self.generate_array()
        self.draw_bars()

    def generate_array(self):
        self.num_bars = self.bars_scale.get()
        self.array = [random.randint(1, 100) for _ in range(self.num_bars)]

    def draw_bars(self):
        self.canvas.delete("all")
        bar_width = 800 / self.num_bars
        for i, value in enumerate(self.array):
            x0 = i * bar_width
            y0 = 400 - (value * 3)
            x1 = (i + 1) * bar_width
            y1 = 400
            self.canvas.create_rectangle(x0, y0, x1, y1, fill="teal")

    def start_sorting(self):
        self.delay = self.speed_scale.get()
        self.generate_array()
        self.video_frames = []  # Video-Frames zurücksetzen

        # Algorithmus auswählen und asynchron aufrufen
        algorithm = self.algorithm.get()
        if algorithm == "Bubble Sort":
            asyncio.run(self.bubble_sort())
        elif algorithm == "Quick Sort":
            asyncio.run(self.quick_sort(0, len(self.array) - 1))
        elif algorithm == "Insertion Sort":
            asyncio.run(self.insertion_sort())
        elif algorithm == "Selection Sort":
            asyncio.run(self.selection_sort())
        elif algorithm == "Merge Sort":
            asyncio.run(self.merge_sort(0, len(self.array) - 1))

    def capture_frame(self):
        # Canvas-Größe abrufen
        x = self.canvas.winfo_x()
        y = self.canvas.winfo_y()
        width = self.canvas.winfo_width()
        height = self.canvas.winfo_height()

        # Canvas als PostScript speichern und in ein Bild umwandeln
        ps = self.canvas.postscript(colormode='color')
        img = Image.open(io.BytesIO(ps.encode('utf-8')))
        img = img.convert("RGB")  # In RGB konvertieren
        img = np.array(img)  # In ein NumPy-Array konvertieren
        self.video_frames.append(img)

    async def bubble_sort(self):
        n = len(self.array)
        for i in range(n):
            for j in range(0, n-i-1):
                if self.array[j] > self.array[j+1]:
                    self.array[j], self.array[j+1] = self.array[j+1], self.array[j]
                    self.draw_bars()
                    self.capture_frame()
                    self.root.update()
                    time.sleep(self.delay / 1000)

    async def quick_sort(self, low, high):
        if low < high:
            pi = await self.partition(low, high)
            await self.quick_sort(low, pi - 1)
            await self.quick_sort(pi + 1, high)

    async def partition(self, low, high):
        pivot = self.array[high]
        i = low - 1
        for j in range(low, high):
            if self.array[j] < pivot:
                i += 1
                self.array[i], self.array[j] = self.array[j], self.array[i]
                self.draw_bars()
                self.capture_frame()
                self.root.update()
                time.sleep(self.delay / 1000)
        self.array[i + 1], self.array[high] = self.array[high], self.array[i + 1]
        self.draw_bars()
        self.capture_frame()
        self.root.update()
        time.sleep(self.delay / 1000)
        return i + 1

    async def insertion_sort(self):
        for i in range(1, len(self.array)):
            key = self.array[i]
            j = i - 1
            while j >= 0 and self.array[j] > key:
                self.array[j + 1] = self.array[j]
                j -= 1
            self.array[j + 1] = key
            self.draw_bars()
            self.capture_frame()
            self.root.update()
            time.sleep(self.delay / 1000)

    async def selection_sort(self):
        n = len(self.array)
        for i in range(n):
            min_idx = i
            for j in range(i + 1, n):
                if self.array[j] < self.array[min_idx]:
                    min_idx = j
            self.array[i], self.array[min_idx] = self.array[min_idx], self.array[i]
            self.draw_bars()
            self.capture_frame()
            self.root.update()
            time.sleep(self.delay / 1000)

    async def merge_sort(self, left, right):
        if left < right:
            mid = left + (right - left) // 2
            await self.merge_sort(left, mid)
            await self.merge_sort(mid + 1, right)
            await self.merge(left, mid, right)

    async def merge(self, left, mid, right):
        n1 = mid - left + 1
        n2 = right - mid

        L = self.array[left:left + n1]
        R = self.array[mid + 1:mid + 1 + n2]

        i = 0
        j = 0
        k = left

        while i < n1 and j < n2:
            if L[i] <= R[j]:
                self.array[k] = L[i]
                i += 1
            else:
                self.array[k] = R[j]
                j += 1
            k += 1
            self.draw_bars()
            self.capture_frame()
            self.root.update()
            time.sleep(self.delay / 1000)

        while i < n1:
            self.array[k] = L[i]
            i += 1
            k += 1
            self.draw_bars()
            self.capture_frame()
            self.root.update()
            time.sleep(self.delay / 1000)

        while j < n2:
            self.array[k] = R[j]
            j += 1
            k += 1
            self.draw_bars()
            self.capture_frame()
            self.root.update()
            time.sleep(self.delay / 1000)

    def download_video(self):
        if not self.video_frames:
            print("No video frames available to download.")
            return

        # Video speichern
        height, width, layers = self.video_frames[0].shape
        video_writer = cv2.VideoWriter('sorting_animation.avi', cv2.VideoWriter_fourcc(*'XVID'), 20.0, (width, height))

        for frame in self.video_frames:
            video_writer.write(frame)

        video_writer.release()
        print("Video saved as sorting_animation.avi")

    def reset(self):
        self.generate_array()
        self.draw_bars()

if __name__ == "__main__":
    root = tk.Tk()
    app = SortingVisualizer(root)
    root.mainloop()
