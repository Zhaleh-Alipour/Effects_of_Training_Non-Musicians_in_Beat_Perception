# preprocessed_to_xlsx

This folder contains code `main_vistraining.js` for converting preprocessed `.xlsx` files into a single spreadsheet file used for subsequent statistical analysis.


## Input / Output
- **Input:** Preprocessed data files located in `data/2_preprocessed_data`
- **Output:**: JSON files (`data/3_json_files`) and final results of the experiment (`results/PrimaryResults_vistraining.xlsx`)

## Usage
Conversion process involves two functions at the end of the code: 

1. `makeJsonFromXlsx()`
    Converts `.xlsx` files from the `data/2_preprocessed_data` folder into separate JSON files and put them in the `data/3_json_files` folder. 
    This function should be run first after commenting out `makeFinalExcelFromJsons()`

> **Note:**
- `3_json_files` folder should be created inside `data` folder before running this function.

2. `makeFinalExcelFromJsons()`
    Converts JSON fils from the `data/3_json_files` folder into a single Excel file (`PrimaryResults_vistraining.xlsx`). 
    This function should be run after commenting out `makeJsonFromXlsx()`
