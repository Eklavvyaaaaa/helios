# Drone Monitoring & Control System

## Overview
This project is about building a system that allows a user to monitor and control a drone through a web interface. Along with basic control, the system also focuses on detecting possible intrusions using sensor data and displaying alerts in real time.

The main idea was to combine hardware (ESP32-based drone) with a simple and usable software interface so that everything can be controlled and monitored from one place.

---

## Objectives
- Create a simple interface to monitor drone activity  
- Allow remote control of the drone  
- Show intrusion alerts based on sensor data  
- Display basic reports and system information  
- Follow a proper development workflow using Figma, Jira, and GitHub  

---

## Features

### Login
- Basic login system to access the dashboard  

### Dashboard
- Shows drone status  
- Displays battery level  
- Quick view of alerts  

### Control Panel
- Start and stop the drone  
- Basic directional controls  
- Live feed section (UI-based)  

### Alerts
- Displays intrusion-related alerts  
- Includes time and type of detection  

### Reports
- Shows past alerts  
- Basic activity and usage data  

---

## System Description

The system mainly has two parts:

### 1. Drone Side
- Built using ESP32  
- Uses sensors like MPU6050  
- Handles flight stability and intrusion detection  

### 2. Web Interface
- Used to monitor and control the drone  
- Displays all data in a simple dashboard  

---

## Tech Stack
- Frontend: HTML, CSS, JavaScript  
- Hardware: ESP32 (Arduino)  
- Design: Figma  
- Project Tracking: Jira  
- Version Control: GitHub  

---

## Workflow Followed

Figma (Design)  
→ Jira (Planning and Tracking)  
→ GitHub (Implementation)  

Each feature was first designed, then added as a user story in Jira, and finally implemented and committed in GitHub.

---

## Project Structure

/frontend → Website UI  
/backend → ESP32 / hardware code  
/docs → Screenshots and references  

---

## Screens Included
- Login Screen  
- Dashboard  
- Drone Control  
- Alerts  
- Reports  

(All screens are connected in a clickable Figma prototype)

---

## Jira Tracking
- User stories created for each feature  
- Sprint created and tasks tracked  
- Tasks moved across stages (To Do → In Progress → Done)  
- Charts like burndown and velocity used  

---

## GitHub Work
- Project uploaded with proper structure  
- Multiple commits showing progress  
- Each commit linked to a feature  

---

## Integration

- Figma → UI design  
- Jira → planning and tracking  
- GitHub → implementation  

All three are connected based on the same features.

---

## Future Scope
- Add AI-based detection  
- Improve real-time monitoring  
- Add mobile support  
- Enhance automation  

---

## Contributors
- Eklavya Puri  
- Team Members  

---

## Final Note
This project helped in understanding how a complete system is built — not just designing UI, but also planning, tracking, and implementing it step by step.
