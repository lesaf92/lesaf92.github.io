---
layout: page
title: Ultrasonic MNIST
description: Write a digit in the air between two ultrasonic sensors and a neural network trained from scratch reads it.
img: assets/img/ultrasonic_mnist/thumbnail_ultrasonic_mnist.png 
importance: 1
category: webapp
related_publications: false
giscus_comments: true
---

I wanted a project small enough to build in a few evenings, but with every layer in plain sight: sensors, a microcontroller, a network link, a web page and a neural network, with no library doing the interesting part.

**Ultrasonic MNIST** is the result. Two HC-SR04 sensors on an ESP32-S3 measure the distance to a pen held in the air, one along each axis of a 10 cm square. The board sends each point over WiFi, the browser draws the trail as it happens, and 4 seconds after the first point a small network trained on MNIST says which digit it was.

{% include figure.liquid loading="eager" path="assets/img/ultrasonic_mnist/air_read.jpg" title="screenshot" class="img-fluid rounded z-depth-1" zoomable=true %}

### Key Features

* **Three tabs:** **Mouse** to draw with the cursor and test the network without any hardware, **Ultrasonic** for the live trail from the sensors, and **Model** for how the network was built and trained.
* **A network you can read:** a 784-256-10 perceptron written in NumPy, forward pass, backpropagation and all. It trains in about 11 seconds on a laptop CPU and gets 97.5% of the MNIST test set right.
* **Smoothed readings:** the server takes the median of the last three readings to drop bad pings, then a low-pass filter evens out the jitter, which cut the noise on a still object from 5.9 to 2.0 mm.
* **Your own symbols:** put images of a letter or symbol in `data/custom/<label>/`, rerun `train.py`, and the app reads it next to the ten digits.
* **One config file:** drawing area, pen and trail width, timeout, the sensors' range and the filters all live in `config.toml`.

### The Technical Details

The firmware is a short Arduino sketch that pings both sensors about 16 times a second and sends `x y` in millimetres over UDP. The server is plain Python with only the standard library and NumPy: it filters the readings, maps them to the drawing area and streams them to the browser with server-sent events. The page is one HTML file with vanilla JavaScript on a canvas.

The electronics, the filtering, the backpropagation math and how I'd use this in a class are all in the blog post: [**Drawing digits in the air with two ultrasonic sensors**]({% post_url 2026-10-31-ultrasonic-mnist %}).

### Running the app
- Link to the app: *coming soon*
- Link to the repo: [**github.com**](https://github.com/lesaf92/ultrasonic_mnist)

---
