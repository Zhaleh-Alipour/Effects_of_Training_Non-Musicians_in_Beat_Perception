# EDA-preprocessing

## Proportional results (Pre-Post) + finding outliers.ipynb

Because baseline performance in the beat sequence discrimination task varied across participants, changes in performance between the pre- and post-test measures were more accurately expressed as a function of the gain given a participant’s pre-training performance.  

Accordingly, the change in percentage accuracy between pre- and post-tests was normalized across modalities using the following formula: 
$g = \frac{\%corr_{post} - \%corr_{pre}}{100\% - \%corr_{pre}}$

where `g` is the gain in performance for an individual on a given task, and `\%corr_{pre}` and `\%corr_{post}` denote that individual’s pre-training and post-training accuracy, respectively.

- **Purpose**
Participants whose gain scores were more than **3 standard deviations below the mean** were identified as outliers and excluded from subsequent analyses.


---

## ItemAnalysis_inPerson.js

- **Description**
  This code computes performance for each trial and each participant separately.
  For each trial:
 - 0 indicates an incorrect response
 - 1 indicates a correct response
  The results are exported in a spreadsheet format for further statistical analysis.

- **Input:**  
  `data/3_json_files`

- **Analysis code:**  
  `EDA-preprocessing/ItemAnalysis_inPerson.js`

- **Outputs:**  
  - `auditory_training/results/TrainingMaterials.csv`  
  - `visual_training/results/TrainingMaterials_vis.csv`
  
The two output files listed above are polished versions of the original item-level results:

- Outliers have been removed, resulting in a final sample size of **N = 64** participants.  
- A prefix of `1` was added to columns corresponding to **auditory training group 1** materials.  
- A prefix of `2` was added to columns corresponding to **auditory training group 2** materials.  

- **Purpose**
These files are used to visualize performance differences between **trained** and **untrained** trials, as implemented in:
`visualizations/Trained_untrained trial difference.ipynb`
