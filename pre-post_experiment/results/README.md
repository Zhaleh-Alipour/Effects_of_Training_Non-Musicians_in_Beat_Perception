# Results

This folder contains outputs from different analyses or questionnaires performed in the project.

## end_of_study_questionnaire_prettest.xlsx
## end_of_study_questionnaire_postttest.xlsx

- **Description:**  
  After the end of the pre-test experiment, participants completed a questionnaire created on Qualtrics that included biographical, music-related, and experiment-related questions.
  On the post-test questionnaire, biographical and music-related questions were removed.

- **Input:**  
  The original Excel file `data/EndofStudyQuestionnaire_Pretest_64participants.xlsx` and `EndofStudyQuestionnaire_posttest_64participants.xlsx`containing all participants’ raw questionnaire responses.
**Note:** This file is not shared but a sample of the pre-test questionnaire file `EndofStudyQuestionnaire_Pretest_sample.xlsx` is shared for reproducing the code. 

- **Analysis:**  
  A preprocessing step was applied to the raw questionnaire data to extract variables of interest. This analysis is saved in `survey_analysis/Qualtrics inf_analysis_pretest.py` and `Qualtrics inf_analysis_posttest.py`. The processed information was then compiled and saved into a cleaned output file.

- **Output:**  
  `end_of_study_questionnaire_pretest.xlsx`
  `end_of_study_questionnaire_posttest.xlsx`
  This file contain the variables required for inclusion in the final `report/`paper.

- **Notes:**  
  - Columns with labels such as `(>=2 -> 2)` indicate categorical encoding, where:
    - values **less than 2 years** are encoded as `1`
    - values **2 years or more** are encoded as `2`
  - The `unique_id` column represents the unique identifier assigned to each participant.

---

## PrimaryResults_prepost.xlsx

- **Description:**  
  This file contains the main pre-test and post-test results from all participants included in the study (**N = 75**).

- **Columns 2–7: Block-wise performance with detailed annotations**  
  These columns report participant performance across the nine experimental blocks.

  Block labels:
  - **SD** = Single Duration  
  - **Irreg** = Irregular (non-beat)  
  - **Reg** = Regular (beat)

  Data are presented in the following format: 0.79 [0] (0) {2}
where:
- `0.79` → mean performance for that block (per participant)
- `[ ]` → number of **attention-check failures**
- `( )` → number of **false alarms**, i.e., trials in which:
  - the trial was a normal trial (keys 1, 2, or 3 expected), but  
  - the participant responded with the attention-check key (`G`)
- `{ }` → number of **easy-trial failures** (present only in Single Duration blocks)

*Easy trials* are defined as trials in which the difference between standard and deviant durations is large (e.g., 1.4 vs. 4).  
These annotated values were used during preprocessing to identify and exclude low-quality participants from further analyses.

- **Columns 9–14: Mean block performance (cleaned)**  
These columns contain only the mean performance values for each block and participant, without additional annotations.

- **Columns 15–26: Transposed-interval difference metrics**  
These columns report the mean difference between transposed intervals for **correctly** and **incorrectly** answered trials in each block.

In each sequence trial of the experiment:
- Three stimuli were presented
- One stimulus was deviant, created by **transposing two intervals** in the sequence

Example:
- Standard stimulus: `22314`
- Deviant stimulus: `22134`  
  (intervals `1` and `3` are transposed)

In Single Duration trials, these values instead reflect the difference between standard and deviant durations.

These measures were derived to test the hypothesis that performance in beat (Reg) and non-beat (Irreg) blocks varies as a function of the magnitude of interval transposition—specifically, that larger differences facilitate discrimination.

For example:
- `AudRegIntDiff (T)` represents the average transposed-interval difference for **correct trials** in the auditory beat (regular) block.

- **Columns 28–33: Block presentation order**  
These columns indicate the order in which each block was presented to each participant.  
Block order was randomized across participants.

These data were later used to assess potential order effects, such as whether completing auditory blocks earlier improved performance in subsequent visual or tactile blocks.

---

## PreprocessedResults_NoOutliers.csv

- **Description:**  
  This spreadsheet is the preprocessed version of `PrimaryResults_prepost.xlsx`.

- **Participant exclusion criteria:**  
  Data from 11 participants identified as outliers were excluded from analysis due to proportional performance (gain scores) that fell more than 3 standard deviations below the mean resulting in a sample size of **N = 64**. The corresponding analysis is documented in `EDA-preprocessing/Proportional results (Pre-Post) + finding outliers.ipynb`. 

