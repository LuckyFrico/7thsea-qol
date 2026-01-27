# 7th Sea quality of life improvments - FoundryVTT

![Dynamic JSON Badge](https://img.shields.io/badge/dynamic/json?url=https%3A%2F%2Fgithub.com%2FLuckyFrico%2F7thsea-qol%2Freleases%2Flatest%2Fdownload%2Fmodule.json&query=version&style=for-the-badge&logo=databricks&logoColor=violet&label=Latest%20version%20available&color=violet)
![GitHub Downloads (all assets, all releases)](https://img.shields.io/github/downloads/LuckyFrico/7thsea-qol/total?style=for-the-badge&logo=github&color=teal)
![GitHub Downloads (all assets, latest release)](https://img.shields.io/github/downloads/LuckyFrico/7thsea-qol/latest/total?style=for-the-badge&logo=github&label=Downloads%20Latest&color=teal)

A lightweight and modular Quality of Life (QoL) enhancement module for the **7th Sea Second Edition** system on Foundry VTT.  
This project focuses on improving usability, streamlining gameplay, and adding non‑intrusive helpers that respect the original rules and design.

---

## Features

### **Initiative Tracker**
A custom, resizable, and draggable initiative tracker designed around 7th Sea’s Raise‑based action economy.

- Track **Player Characters**, **Heroes**, **Villains**, **Monsters**, and **Brutes**
- Add actors via drag‑and‑drop from the sidebar or sheets
- Modify initiative values with +1 / −1 buttons
- Automatic sorting (non‑Brutes first, Brutes last)
- Reset options:
- Fully localized UI

<p align="center"> <img src="img/tracker_1.png" width="300"> <img src="img/tracker_3.png" width="300"> <img src="img/tracker_2.png" width="300"> </p>

### **Chat Integration for Initiative**
The module wires the “Add to Initiative” button in roll messages directly into the tracker logic.

- Uses the actor and raise data embedded in the chat card
- Automatically refreshes the tracker when a tracked actor is updated
- Localizable notification messages

### **Dramatic Wounds Helpers**
The module provides small but impactful helpers around **Dramatic Wounds**, aimed at clarity rather than automation overload.

- Visual and/or structural support for tracking Dramatic Wounds on relevant actors
- Consistent access to Dramatic Wound state during scenes
- Designed to complement, not replace, the GM’s narrative control

<p align="center"> <img src="img/dramatic_wounds_1.png" width="300"> <img src="img/dramatic_wounds_2.png" width="300"> </p>
<p align="center"> <img src="img/dramatic_wounds_3.png" width="300"> </p>

### **Localization Support**
All module strings are fully localizable.  
Currently supported:

- **English**
- **Italian**
- **French**
- **Spanish**
- **German**

---

## Installation

Paste this URL into Foundry’s “Install Module” dialog: 
[http://github.com/LuckyFrico/7thsea-qol/releases/latest/download/module.json](https://github.com/LuckyFrico/7thsea-qol/releases/latest/download/module.json)

## Compatibility
Foundry VTT: 

![Dynamic JSON Badge](https://img.shields.io/badge/dynamic/json?url=https%3A%2F%2Fgithub.com%2FLuckyFrico%2F7thsea-qol%2Freleases%2Flatest%2Fdownload%2Fmodule.json&query=compatibility.minimum&style=for-the-badge&logo=foundryvirtualtabletop&label=Fondry%20Minimum%20Version&color=orange)
![Dynamic JSON Badge](https://img.shields.io/badge/dynamic/json?url=https%3A%2F%2Fgithub.com%2FLuckyFrico%2F7thsea-qol%2Freleases%2Flatest%2Fdownload%2Fmodule.json&query=compatibility.verified&style=for-the-badge&logo=foundryvirtualtabletop&label=Fondry%20Verified%20Version&color=orange)

---

System: 
[7th Sea Second Edition (Unofficial)](https://foundryvtt.com/packages/svnsea2e)
