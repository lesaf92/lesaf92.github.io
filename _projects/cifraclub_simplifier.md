---
layout: page
title: CifraClub Simplifier
description: A web application that cleans and simplifies guitar tabs for focused practice sessions, featuring a hands-free autoscroll mode.
img: https://raw.githubusercontent.com/lesaf92/cc_for_dummies/main/cc_for_dummies_page_screenshot.png
importance: 1
category: webapp
related_publications: false
giscus_comments: true
---

As a musician, I often found myself wanting to quickly practice a song without getting bogged down by complex tablature for solos or intricate riffs. While sites like CifraClub are incredible resources, I needed a way to distill the content down to its core: the chords and the lyrics.

This led me to create the [**CifraClub Simplifier**](https://github.com/lesaf92/cc_for_dummies), a web application built to solve this exact problem.

The tool allows a user to paste any guitar tab URL from CifraClub, and it intelligently scrapes the page, removes all tablature, and presents a clean, readable version of the song. This creates a distraction-free view perfect for learning, practicing, or a casual sing-along.

{% include figure.liquid loading="eager" path="https://raw.githubusercontent.com/lesaf92/cc_for_dummies/main/cc_for_dummies_page_screenshot.png" title="screenshot" class="img-fluid rounded z-depth-1" zoomable=true %}


### Key Features

To make the tool as useful as possible, I included several key features:

* **Intelligent Tab Removal:** The core of the application is a Python script using Beautiful Soup that specifically targets and removes `<span>` tags containing tablature, leaving the chord and lyric structure intact.
* **Hands-Free Autoscroll:** For uninterrupted practice, I implemented an autoscroll feature using vanilla JavaScript. This allows musicians to play through an entire song without ever needing to touch their mouse or screen.
* **Adjustable Speed Control:** Every player has their own tempo. A simple slider allows the user to precisely control the scrolling speed, making it suitable for both slow practice and upbeat performances.
* **Fully Responsive UI:** The interface was designed to be clean and functional on any device, ensuring a seamless experience whether you're practicing with a laptop or a phone on a music stand.

### The Technical Details

The application is powered by a Python **Flask** backend that handles the web scraping logic. The frontend is built with simple, efficient **HTML, CSS, and vanilla JavaScript**. For public access, the app is deployed on **Render**'s free tier and integrated with my personal domain.

This project was a fantastic exercise in combining backend logic with a user-focused frontend. It solved a personal problem and gave me valuable experience in web scraping, application deployment, and creating practical tools.

### Running the app
- Link to the app: [**cifraclub.lesaf.cc**](https://cifraclub.lesaf.cc)
- Link to the repo: [**github.com**](https://github.com/lesaf92/cc_for_dummies)

---
