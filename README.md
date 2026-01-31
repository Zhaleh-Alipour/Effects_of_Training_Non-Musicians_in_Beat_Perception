
# Effects of Training Non-Musicians in Beat Perception on Timing Across Three Modalitie

This repository contains the code, sample and derived data, and analysis pipelines used in the PhD project **Effects of Training Non-Musicians in Beat Perception on Timing Across Three Modalitie**.  
The project investigates whether training in auditory and visual beat sequence timing transfers to other sensory modalities or to different timing tasks. To address this question, non-musicians (defined as individuals with less than two years of formal musical training) were trained in auditory or visual beat perception tasks. Timing performance was assessed across three modalities (auditory, visual, tactile) and three levels (beat sequence, non-beat sequence, single interval) before and after training.

## Repository structure

- `pre-post_experiment/`
A comprehensive assessment of participants’ timing abilities across three sensory modalities and three timing levels.
This experiment was conducted twice: once before training (baseline) and once after training, to evaluate training-related improvements.
This folder contains materials, data, preprocessing and analysis code, and results for these subgroups.

- `auditory_training/`
Participants randomly assigned to the auditory training group completed training in auditory beat sequence timing.
We had two auditory training subgroups with slightly different training materials. 
This folder contains materials, data, preprocessing and analysis code, and results for these subgroups.

- `visual_training/`
Participants randomly assigned to the visual training group completed training in visual beat sequence timing.
We had two visual training subgroups with slightly different training materials. 
This folder contains materials, data, preprocessing and analysis code, and results for these subgroups.

**Common Subfolders**
The following subfolders are present in each of the three directories listed above:

    - `Experiment/`
    PsychoPy experiment code, stimuli, and supporting files used to run the experiments.

    - `data/`
     Raw, sample, and derived datasets, along with documentation describing data availability and data generation procedures.
     See data/README.md for details.

     **Note**: Full raw experimental and questionnaire data are not publicly shared due to participant privacy considerations. Sample data and all preprocessing and analysis scripts are provided to support reproducibility.

    - `raw_to_preprocessed/`  
    Scripts used to preprocess raw data files into preprocessed formats suitable for analysis.
    See `raw_to_preprocessed/README.md` for details.

    - `preprocessed_to_xlsx/`  
    Scripts for converting preprocessed data into structured results used in downstream analyses.
    See `preprocessed_to_xlsx/README.md` for details.

    - `results/`
    xlsx files containing group-level and questionnaire results.
    See `results/README.md` for details.

    - `survey_analysis/` (pre-post_experiment only)
    Scripts for deriving information of interest from the pre-test and post-test questionnaire responses.


- `EDA-preprocessing/`  
  Scripts for exploratory data analysis, including proportional analyses and outlier detection.

- `visualization/`  
  Code for generating figures and visualizations.

- `plots/`  
  Generated plots and figures used in analyses and manuscripts.




## License

This project is released under the MIT License.


## Contact
**Zhaleh Mohammad Alipour**  
📧 zhaleh.m.alipour@gmail.com