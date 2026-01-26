# This code is for getting raw data files that are stored in the directory `data/1_raw_data`, keeping necessary columns, renaming them, and removing the rest.
# At the end it saves files in a new directory `data/2_preprocessed_data`.  We need to create this folder ourselves before running the code.
# We will end up having 45 columns.
from pathlib import Path
import pandas as pd
# b is the columns of the raw data file we wanna keep. At the left side of : sign is the name of column and the right of : sign is the name we want to  assign to it.
# Each timing level of each modality is written in a separate column.
b={'participant':'participant', 'date':'date', 'expName':'expName',
   'SDaud':'AudSD', 'diff_sd':'AudSDdiff', 'main_key_resp_audSD.keys':'AudSDresp', 'key_resp_16.keys':'AudSDAttentionCh', 'SDdeviantPitch':'SDdeviantPitch',
   'IrregAudSequence':'AudIrreg', 'diff_irreg':'AudIrregDiff', 'main_key_resp_audIrreg.keys':'AudIrregResp', 'key_resp_6.keys':'AudIrregAttentionCh', 'IrregDeviantPitch':'IrregDeviantPitch',
   'RegAudSequence':'AudReg', 'diff_reg':'AudRegDiff', 'main_key_resp_audReg.keys':'AudRegResp', 'keyACaudreg.keys':'AudRegAttentionCh', 'RegDeviantPitch':'RegDeviantPitch',
   'SDinterval':'VisSD','SDspeed':'VisSDspeed', 'SDDiff':'VisSDdiff', 'main_key_resp_visSD.keys':'VisSDresp', 'SDColor':'VisSDcolor',
   'irregNumberOfIntervals':'VisIrreg', 'irregSpeed':'VisIrregspeed', 'irregDiff':'VisIrregDiff', 'main_key_resp_visIrreg.keys':'VisIrregResp', 'irregColor':'VisIrregColor',
   'NumberOfIntervals':'VisReg', 'Speed':'VisRegSpeed', 'Diff':'VisRegDiff', 'main_key_resp_visReg.keys':'VisRegResp', 'Color':'VisRegColor',
   'TactSD1':'TactSD', 'TactSD-Speed': 'TactSDspeed', 'TactSD_Diff':'TactSDdiff', 'key_resp_34.keys':'TactSDresp',
   'TactIrreg_NumberOfIntervals': 'TactIrreg', 'SpeedTactIrreg3':'TactIrregSpeed', 'Tact_irreg_Diff':'TactIrregDiff', 'key_resp_30.keys':'TactIrregResp',
   'Tact-NumberOfIntervals':'TactReg', 'tact_Speed':'TactRegSpeed', 'Tact_Diff':'TactRegDiff', 'key_resp_26.keys':'TactRegResp'}

def getParticipantNumber(name):
    parts = name.split('_')
    if 'post' in name:
        return f"{parts[0]}_{parts[1]}_{parts[2]}_{parts[4]}"
    else:
        return f"{parts[0]}_{parts[1]}_{parts[3]}"
    
BASE_DIR = Path(__file__).resolve().parent.parent
DATA_DIR = BASE_DIR/'data'/'1_raw_data'
OUTPUT_DIR = BASE_DIR / "data" / "2_preprocessed_data"


for csv in DATA_DIR.rglob('*.csv'):
    print(csv)
    df = pd.read_csv(csv)
    result = df[['participant', 'date', 'expName',
                 'SDaud', 'diff_sd', 'main_key_resp_audSD.keys', 'key_resp_16.keys', 'SDdeviantPitch',
                 'IrregAudSequence', 'diff_irreg', 'main_key_resp_audIrreg.keys', 'key_resp_6.keys', 'IrregDeviantPitch',
                 'RegAudSequence','diff_reg', 'main_key_resp_audReg.keys', 'keyACaudreg.keys', 'RegDeviantPitch',
                 'SDinterval', 'SDspeed', 'SDDiff', 'main_key_resp_visSD.keys', 'SDColor',
                 'irregNumberOfIntervals', 'irregSpeed', 'irregDiff', 'main_key_resp_visIrreg.keys', 'irregColor',
                 'NumberOfIntervals', 'Speed', 'Diff', 'main_key_resp_visReg.keys', 'Color',
                 'TactSD1', 'TactSD-Speed', 'TactSD_Diff', 'key_resp_34.keys',
                 'TactIrreg_NumberOfIntervals','SpeedTactIrreg3', 'Tact_irreg_Diff', 'key_resp_30.keys',
                 'Tact-NumberOfIntervals', 'tact_Speed', 'Tact_Diff', 'key_resp_26.keys']]
    result.rename(columns=b,inplace=True)
    #print(result['AudSD'])
    result.to_excel(OUTPUT_DIR/f'Preprocessed{getParticipantNumber(csv.name)}.xlsx',index=None)
