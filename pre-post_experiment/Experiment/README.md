# Timing Perception Experiment (Auditory, Visual, tactile)

## Overview
This repository contains a PsychoPy experiment designed to investigate **human timing perception** in **auditory**, **visual** and **tactile** modalities. The experiment was developed using **PsychoPy v2021.2.3**.

The study consists of **nine experimental blocks**, presented in a **randomized order**:
- **3 auditory blocks**
- **3 visual blocks**
- **3 tactile blocks**

Each modality includes the following block types:
1. **Regular (beat-based) patterns**
2. **Irregular (non-beat) patterns**
3. **Single-interval durations**

This folder includes all code, stimuli, and files required to run the experiment.

---

## Experimental Design

### Trial Structure
- In each trial, participants are presented with **three sequential stimuli**, shown in **random order**.
- **One stimulus differs** from the other two in temporal structure or duration.
- Participants indicate which stimulus was different by pressing **key 1, 2, or 3**.
- Attention check trials require a different response (see below).

---

## Auditory Modality

### Stimulus Generation
- Auditory stimuli were generated using **MATLAB** script located in the `Matlab/` folder.
- Stimuli were created externally to ensure **high-quality pure tones**, as PsychoPy-generated sounds did not provide sufficient audio fidelity.
- Final audio files were placed into condition-specific folders.
- File paths were referenced via corresponding `.xlsx` files, which were imported into the PsychoPy experiment:
  - `mainReg.xlsx`
  - `mainIrreg.xlsx`
  - `mainSD.xlsx`

### Audio Folders
The following folders contain the auditory stimuli used in the experiment:

- `RegPatterns/` – regular (beat-based) auditory stimuli  
- `IrregPatterns/` – irregular (non-beat) auditory stimuli  
- `SingleDurations/` – single-interval auditory stimuli  

Due to their large file size, these folders are **not tracked in this GitHub repository** and are included in `.gitignore`.

All auditory stimuli are publicly available on the **Open Science Framework (OSF)**:
https://doi.org/10.17605/OSF.IO/CJGHY

To run the experiment locally, download the auditory stimuli from OSF and place the folders **with the same names** (`RegPatterns`, `IrregPatterns`, `singleDurations`) **inside the `Experiment/` directory**.

---

## Visual Modality

### Visual Stimulus Design
- Visual stimuli were created using the **PsychoPy Builder interface**.
- Stimuli consist of a **black square displayed on a gray background**.

#### Beat and non-beat sequence blocks
- The square rotates 45 degrees in the center of the screen and remains at each location for the duration of interest.
- This alternating presentation creates a **rhythmic visual rotation**.

#### Single-Interval Condition
- The square appears in the center of the screen and remains visible for the duration of interest, without any movement or rotation.

---

## Tactile Modality

### Tactile Stimulus Design
Tactile stimuli were generated using a custom mobile application developed for **Android devices** using **Android Studio (version 2021.3.1)**. The stimuli were presented on a **Samsung Galaxy S8** smartphone.

The application package is located in the repository as:
- `app-debug_latestVersion.apk`

This application must be installed on an Android device in order to run the tactile modality of the experiment.

### Tactile Stimulus Delivery
The tactile application requires an active **server connection**. A running server address must be specified:
- In the **application source code**, and
- In the **PsychoPy experiment code**, at the designated locations.

During the experiment:
- PsychoPy transmitted predefined temporal patterns and interval durations to the external server.
- The server forwarded these signals to the smartphone.
- The smartphone application triggered the corresponding **vibrotactile patterns**.

### Auditory Masking
During tactile blocks, **white noise** was presented to mask any sound produced by the device vibrations.  
The masking noise file used in the experiment is `file.wav.wav`. This file is not tracked due to the big size of the file. To run the tactile blocks, you need to either deactivate this file in the `InPersonFinal.psyexp` or produce a white noise file of about 20 min using `Audacity` software. 

---

## Attention Check Trials

Attention check trials are embedded within **each block** to ensure participant engagement.

### Auditory Attention Checks
- **White noise** was presented for **5 seconds** instead of the standard **500 Hz pure tones**.
- Attention check files in all auditory blocks are called `Noise.wav`and they are inside the auditory folders.
- The noise files are referenced via separate `.xlsx` files:
  - `pitchReg.xlsx`
  - `pitchIrreg.xlsx`
  - `pitchSD.xlsx`
- Participants must press the **“G” key** instead of keys 1–3.

### Visual Attention Checks
- A **green square** was presented for **5 seconds** in the center of the screen instead of the standard gray square.
- Participants must respond using the **“G” key**.

---

### Tactile Attention Checks
- A **constant vibration** was presented for **5 seconds**.
- Participants must respond using the **“G” key**.

---

## Practice Trials
- Each block begins with **6 practice trials**, two of which are attention checks.
- Practice trials familiarize participants with the task and response mapping.
- The practice trials are referenced via separate `.xlsx` files:  
  - `practiceReg.xlsx`
  - `practiceIrreg.xlsx`
  - `practiceSD.xlsx`

---

## Headphone / Microphone Check
To ensure participants are wearing headphones:
- Participants hear a **spoken three-digit number** before the experiment begins, and must type it correctly to proceed.
- The audio file used for this check is:
  - `four-one-one.wav`

---

## Volume Calibration
Before the main experiment:
- Participants adjust audio volume to a comfortable level.
- The audio file used for this is embeded inside `volset.xlsx`

---

## Post-Experiment Questionnaire

After completing the experiment, participants completed a questionnaire collecting:
- Demographic information
- Music-related background
- Experiment-related feedback

The questionnaire was created using **Qualtrics**.

---

## Data Output and Preprocessing
- The experiment outputs a **CSV file** for each participant. 
- Raw output includes many **extra rows and columns** generated by PsychoPy.
- **Extensive preprocessing is required** before analysis.
- Preprocessing scripts and detailed instructions are provided in:
  - `raw_to_preprocessed/`

---

## Implementation

### Requirements
- **PsychoPy v2021.2.3**

### Running the Experiment
1. Install and open **PsychoPy Builder**.
2. Load the `InPersonFinal.psyexp` file.
4. Run the experiment locally.
- To run locally, **all audio files must be in `.wav` format**.

---

## License

This project is released under the **MIT License**.

You are free to use, modify, and redistribute the code and experimental stimuli, provided that appropriate credit is given and the associated work is cited.

---

## Contact

**Zhaleh Mohammad Alipour**  
📧 zhaleh.m.alipour@gmail.com