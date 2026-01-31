# results

## PrimaryResults_audtraining.xlsx
- **Description:**  
  This file contains the results of training participants in **auditory beat sequence** timing from all participants in the auditory training group (**N = 26**).

- **Column 2 (AudReg): Block-wise performance with detailed annotations**  
  The columns report participant performance across the auditory beat sequence block.

  Block labels: 
  - **AudReg** = Auditory Regular (beat)

  Data are presented in the following format: 0.79 [0] (0)
where:
- `0.79` → mean performance for that block (per participant)
- `[ ]` → number of **attention-check failures**
- `( )` → number of **false alarms**, i.e., trials in which:
  - the trial was a normal trial (keys 1, 2, or 3 expected), but the participant responded with the attention-check key (`G`)

- **Column 4 (AudReg): Mean block performance (cleaned)**  
Theis column contains only the mean performance values for the block, without additional annotations.

- **Columns 6 & 7: Transposed-interval difference metrics**  
These columns report the mean difference between transposed intervals for **correctly (T)** and **incorrectly (F)** answered trials in each block.

In each sequence trial of the experiment:
- Three stimuli were presented
- One stimulus was deviant, created by **transposing two intervals** within the sequence

Example:
- Standard stimulus: `22314`
- Deviant stimulus: `22134`  
  (intervals `1` and `3` are transposed)


For example:
- `AudRegIntDiff(T)` represents the average of transposed-interval difference for **correct trials** in the auditory beat (regular) block.

---

## AudPreprocessed_NoOutliers_PrePostAdded.csv
**Description:** 
This is the final preprocessed file that were used for final visualization and statistical analysis. 
This file contains the `Name` and `AudReg` columns derived from the source file `PrimaryResults_audtraining.xlsx`. 

**Preprocessing**
The dataset has been further processed by **removing outliers** identified during exploratory data analysis, as documented in `EDA-preprocessing/Proportional results (Pre-Post) + finding outliers.ipynb` leaving us a sample size of **20 participants**. 

In addition, the file includes each participant’s **performance in the auditory beat sequence block for both pre-test and post-test sessions**. These values were extracted from `pre-post_experiment/results/PreprocessedResults_NoOutliers.xlsx` and appended to the `AudReg` column.

--- 

## TrainingMaterials.csv

This file contains the results of the item analysis conducted on the final sample of participants (**N = 64**).  
The analysis was performed using the script `EDA-preprocessing/ItemAnalysis_inPerson.js`.

After completing the item analysis, column names were updated:
- A prefix of `1` was added to columns corresponding to **auditory training group 1** materials.
- A prefix of `2` was added to columns corresponding to **auditory training group 2** materials.

This file is used to visualize performance differences between **trained** and **untrained** trials, as implemented in  
`visualizations/Trained_untrained trial difference.ipynb`.
