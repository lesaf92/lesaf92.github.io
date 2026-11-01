---
layout: page
title: ICCC
description: An interactive web application for simulating and designing custom control laws for dynamic systems, featuring an inverted pendulum, an acrobot, 2D and 3D ballbots, a rocket lander, a quadcopter and a flying inverted pendulum.
img: assets/img/ICCC_screenshot.png
importance: 1
category: webapp
related_publications: false
giscus_comments: true
---

As a control systems enthusiast, I wanted to build a platform where users could easily test and visualize custom control laws for complex dynamic systems without needing heavy software like MATLAB or Simulink. The goal was to make control theory accessible, interactive, and competitive.

This led me to create **ICCC** (International Cupadi Control Competition), a web application built to solve this exact problem.

The tool allows a user to study the mathematical model of a plant and directly write their own control law in JavaScript syntax (e.g., LQR or Pole Placement). The app then instantly simulates the system's dynamics, visualizes the response, and grades the performance, allowing users to submit their designs to a leaderboard for each system. There are currently seven plants, each in its own tab:

* **2D Inverted Pendulum:** the classic nonlinear cart-pole, a staple of control and reinforcement-learning courses, with the equations from Russ Tedrake's [*Underactuated Robotics*](https://underactuated.csail.mit.edu/acrobot.html#cart_pole) (MIT 6.832). You balance it by pushing the cart, or, in the harder swing-up mode, start it hanging down on a short track and swing it up first.
* **2D Acrobot:** two links with a motor only at the elbow, the classic underactuated swing-up problem ([Spong, 1995](https://doi.org/10.1109/37.341864)). No linear controller can do it: you have to pump energy into the system before catching it upright.
* **2D Ballbot:** the planar model of the [Ballbot_LMI_V2](https://github.com/Intelligent-Machines-Lab/Ballbot_LMI_V2) prototype built at ITA, with its real physical parameters. You command the motor torque, and the score uses the same weights as the original controller design.
* **2D Rocket Landing:** the powered-descent model of [Açıkmeşe & Ploen (2007)](https://doi.org/10.2514/1.27553): a Mars lander whose engine can neither shut off nor exceed its limits, landing on a pad without dipping below a glide slope. It's scored on fuel against the true optimum, computed with the paper's own convex-optimization method.
* **3D Ballbot:** the same robot in three dimensions. The original work models three separate planes and leaves a coupled 3D model as future work; this one couples roll, pitch, yaw and the rolling ball, and reduces exactly to the planar models in each plane. The ballbot starts out shoved, moving and spinning, and you command torques about all three body axes.
* **3D Quadcopter:** the model from Heeg, Song & Scaramuzza, [*Learning Quadrotor Control From Visual Features Using Differentiable Simulation*](https://arxiv.org/abs/2410.15979). You command collective thrust and body rates to recover from a throw and hover, scored with the paper's reward terms.
* **3D Flying Inverted Pendulum:** the same quadcopter balancing a pole on top, after [Hehn & D'Andrea's (2011)](https://doi.org/10.1109/ICRA.2011.5980244) flying inverted pendulum.

{% include figure.liquid loading="eager" path="assets/img/ICCC_screenshot.png" title="screenshot" class="img-fluid rounded z-depth-1" zoomable=true %}


### Key Features

To make the tool as engaging and useful as possible, I included several key features:

* **Interactive Code Editor:** Competitors can define their control laws directly in the browser using JavaScript syntax, with access to each system's state variables (like position, velocity, angle, and angular velocity). Each tab keeps its own code.
* **Simulation & Visualization:** Features custom canvas animations, from the cart and pendulum to perspective 3D views of the ballbot and the quadcopter, alongside live Chart.js graphs mapping the system response and control signals.
* **Competition Mechanics:** Each run is scored with a cost that penalizes tracking error and control effort, so the best design is a well-tuned controller rather than the one with the biggest gains. Once you stabilize a system, you can submit your control law to that system's leaderboard.
* **Verified Scores:** The server never trusts a score sent from the browser. It re-runs every submitted control law in a sandbox and records its own result.
* **Printable Reports:** A print-optimized layout turns your equations, control law, and graphs into a clean report you can print or save as a PDF straight from the browser.

### The Competition

Each system has its own leaderboard, ranking competitors by their best server-verified score. The [official rules](/assets/pdf/iccc_rules.pdf) give every system's objective, starting state, failure conditions and scoring, the limits on control laws, and the four competition categories: Web or Networked, AI, Digital and Analog Control. This edition opens the first two, in simulation; the other two need the physical systems and will follow.

### The Technical Details

The application is powered by a **Node.js** and **Express** backend, utilizing **Mongoose** to interact with a MongoDB database. The simulators live in a single JavaScript module shared by the browser and the server, so the server reproduces the browser's score exactly. Submitted code runs inside **QuickJS** compiled to WebAssembly, an isolated interpreter with no access to the server, capped in time and memory.

The frontend is built with an appealing glassmorphism UI using **HTML, CSS, and vanilla JavaScript**. It leverages specialized libraries like **MathJax** for rendering LaTeX equations elegantly and **Chart.js** for data plotting, while reports rely on the browser's own print engine and a dedicated print stylesheet.

This project was a fantastic exercise in combining mathematical modeling with interactive web technologies. It bridged the gap between theoretical control systems and practical software engineering, resulting in a responsive, educational, and fun competitive tool.

### Running the app
- Link to the app: [**iccc.lesaf.cc**](https://iccc.lesaf.cc)
- Official rules: [**PDF**](/assets/pdf/iccc_rules.pdf)

---
