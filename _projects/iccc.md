---
layout: page
title: ICCC
description: An interactive web application for simulating and designing custom control laws for dynamic dynamic systems, featuring a real-time 2D inverted pendulum.
img: assets/img/ICCC_screenshot.png
importance: 1
category: webapp
related_publications: false
giscus_comments: true
---

As a control systems enthusiast, I wanted to build a platform where users could easily test and visualize custom control laws for complex dynamic systems without needing heavy software like MATLAB or Simulink. The goal was to make control theory accessible, interactive, and competitive.

This led me to create **ICCC** (International Cupadi Control Competition), a web application built to solve this exact problem.

The tool allows a user to study the mathematical model of a plant—such as the nonlinear equations of a 2D Inverted Pendulum on a cart—and directly write their own control law in JavaScript syntax (e.g., LQR or Pole Placement). The app then instantly simulates the system's dynamics, visualizes the real-time response, and grades the performance, allowing users to submit their scores to a global leaderboard.

{% include figure.liquid loading="eager" path="https://raw.githubusercontent.com/lesaf92/iccc/main/assets/ICCC_screenshot.png" title="screenshot" class="img-fluid rounded z-depth-1" zoomable=true %}


### Key Features

To make the tool as engaging and useful as possible, I included several key features:

* **Interactive Code Editor:** Competitors can define their control laws directly in the browser using JavaScript syntax, with access to real-time state variables (like position, velocity, angle, and angular velocity).
* **Real-time Simulation & Visualization:** Features a custom canvas animation of the first model (inverted pendulum and cart), alongside live Chart.js graphs mapping the system response and control signals.
* **Competition Mechanics:** A built-in scoring system tracks performance metrics and allows users to submit their best results to a backend leaderboard upon achieving stabilization.
* **PDF Report Generation:** Users can export their simulation results, equations, and control graphs into a compiled PDF document with a single click, perfect for documentation or sharing.

### The Technical Details

The application is powered by a **Node.js** and **Express** backend, utilizing **Mongoose** to interact with a MongoDB database for secure score submissions.

The frontend is built with an appealing glassmorphism UI using **HTML, CSS, and vanilla JavaScript**. It leverages specialized libraries like **MathJax** for rendering LaTeX equations elegantly, **Chart.js** for data plotting, and **html2canvas** alongside **jsPDF** for generating PDF reports directly from the DOM.

This project was a fantastic exercise in combining mathematical modeling with interactive web technologies. It bridged the gap between theoretical control systems and practical software engineering, resulting in a responsive, educational, and fun competitive tool.

### Running the app
- Link to the app: [**iccc.lesaf.cc**](https://iccc.lesaf.cc)
- Link to the repo: [**github.com**](https://github.com/lesaf92/iccc)

---
