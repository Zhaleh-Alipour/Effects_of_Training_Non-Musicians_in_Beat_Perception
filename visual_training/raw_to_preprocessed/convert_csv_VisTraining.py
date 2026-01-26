
# This code is for getting raw data files that are stored in the directory `data/1_raw_data`, keeping necessary columns, renaming them, and removing the rest.
# At the end it saves files in a new directory `data/2_preprocessed_data`. We need to create this folder ourselves before running the code.
from pathlib import Path
import pandas as pd
# b is the columns of the raw data file we wanna keep. At the left side of : sign is the name of column and the right of : sign is the name we want to  assign to it.
b={'participant':'participant', 'date':'date', 'expName':'expName',
   'NumberOfIntervals':'VisReg', 'Speed':'VisRegSpeed', 'Diff':'VisRegDiff', 'key_resp_5.keys':'VisRegResp', 'Color':'VisRegColor'}


def getParticipantNumber(name):
    parts = name.split('_')
    return f"{parts[0]}_{parts[1]}_{parts[3]}"

BASE_DIR = Path(__file__).resolve().parent.parent
DATA_DIR = BASE_DIR/'data'/'1_raw_data'
OUTPUT_DIR = BASE_DIR / "data" / "2_preprocessed_data"

for csv in DATA_DIR.rglob('*.csv'):
    print(csv)
    df = pd.read_csv(csv)
    result = df[['participant', 'date', 'expName', 'NumberOfIntervals', 'Speed', 'Diff', 'key_resp_5.keys', 'Color']]
    result.rename(columns=b,inplace=True)
    result.to_excel(OUTPUT_DIR / f'Preprocessed{getParticipantNumber(csv.name)}.xlsx', index=None)

