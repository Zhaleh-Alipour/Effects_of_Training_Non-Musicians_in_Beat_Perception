
# this code is for getting raw data files that are in the directory `data/1_raw_data`, keeping necessary columns, renaming them, and removing the rest.
# At the end it saves files in a new directory `data/2_preprocessed_data`. We need to create this folder ourselves before running the code.
from pathlib import Path
import pandas as pd
# b is the columns of the raw data file we wanna keep. On the left side of : sign is the name of column and on the right side is the name we want to assign to it.
b={'participant':'participant', 'date':'date', 'expName':'expName',
   'RegAudSequence':'AudReg', 'diff-reg':'AudRegDiff', 'key_resp_7.keys':'AudRegResp', 'key_resp_6.keys':'AudRegAttentionCh', 'RegDeviantPitch':'RegDeviantPitch'}
c={'participant':'participant', 'date':'date', 'expName':'expName',
   'RegAudSequence':'AudReg', 'diff-reg':'AudRegDiff', 'key_resp_7.keys':'AudRegResp', 'key_resp_8.keys':'AudRegAttentionCh', 'RegDeviantPitch':'RegDeviantPitch'}


def getParticipantNumber(name):
    parts = name.split('_')
    return f"{parts[0]}_{parts[1]}_{parts[3]}"

BASE_DIR = Path(__file__).resolve().parent.parent
DATA_DIR = BASE_DIR/'data'/'1_raw_data'
OUTPUT_DIR = BASE_DIR / "data" / "2_preprocessed_data"

for csv in DATA_DIR.rglob('*.csv'):
    print(csv.name) # example: data_audtraining\train10_audtrain2_AudTraining2_2023-11-11_18h51.31.615.csv
    df = pd.read_csv(csv)
    if csv.name.split('_')[1] == 'audtrain1':
        result = df[['participant', 'date', 'expName', 'RegAudSequence', 'diff-reg', 'key_resp_7.keys', 'key_resp_6.keys', 'RegDeviantPitch']]
        result.rename(columns=b,inplace=True)
        result.to_excel(OUTPUT_DIR / f'Preprocessed{getParticipantNumber(csv.name)}.xlsx', index=None)
    elif csv.name.split('_')[1] == 'audtrain2':
        result = df[['participant', 'date', 'expName', 'RegAudSequence', 'diff-reg', 'key_resp_7.keys', 'key_resp_8.keys', 'RegDeviantPitch']]
        result.rename(columns=c, inplace=True)
        result.to_excel(OUTPUT_DIR / f'Preprocessed{getParticipantNumber(csv.name)}.xlsx', index=None)