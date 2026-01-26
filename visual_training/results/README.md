# results

## PrimaryResults_vistraining.xlsx
- **Description:**  
  This file contains the results of training participants in `visual beat sequence` timing from all participants in the visual training group (**N = 25**).

- **Column 2 (VisReg): Block-wise performance with detailed annotations**  
  The columns report participant performance across the visual beat sequence block.

  Block labels: 
  - **VisReg** = Visual Regular (beat)

  Data are presented in the following format: 0.79 [0] (0)
where:
- `0.79` → mean performance for the block (per participant)
- `[ ]` → number of **attention-check failures**
- `( )` → number of **false alarms**, i.e., trials in which:
  - the trial was a normal trial (keys 1, 2, or 3 expected), but the participant responded with the attention-check key (`G`)

- **Column 4 (VisReg): Mean block performance (cleaned)**  
This column contains only the mean performance values for the block, without additional annotations.

- **Columns 6 & 7: Transposed-interval difference metrics**  
These columns report the mean difference between transposed intervals for **correctly (T)** and **incorrectly (F)** answered trials in the block.

In each sequence trial of the experiment:
- Three stimuli were presented
- One stimulus was deviant, created by **transposing two intervals** within the sequence

Example:
- Standard stimulus: `22314`
- Deviant stimulus: `22134`  
  (intervals `1` and `3` are transposed)


For example:
- `VisRegIntDiff(T)` represents the average of transposed-interval difference for **correct trials** in the visual beat (regular) block.

---

## VisPreprocessed_NoOutliers_PrePostAdded.csv
**Description:** 
This is the final preprocessed file that were used for final visualization and statistical analysis. 
This file contains the `Name` and `VisReg` columns derived from the source file `PrimaryResults_vistraining.xlsx`. 

**Preprocessing**
The dataset has been further processed by **removing outliers** identified during exploratory data analysis, as documented in `EDA-preprocessing/Proportional results (Pre-Post) + finding outliers.ipynb` leaving us a sample size of **24 participants**. 

In addition, the file includes each participant’s **performance in the visual beat sequence block for both pre-test and post-test sessions**. These values were extracted from `pre-post_experiment/results/PreprocessedResults_NoOutliers.xlsx` and appended to the `VisReg` column.

