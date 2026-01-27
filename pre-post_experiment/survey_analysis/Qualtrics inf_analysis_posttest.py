
import pandas as pd
import numpy as np

participants = []
def isNaN(num): #Check if Variable has a value
    return num != num
def getInt(str): #Get numbers from a string, Example: From "3 yeas" Returns 3.
   s = ''.join(x for x in str if x.isdigit())
   if(s == ""):
      return 0
   return int(s)

ex = pd.read_excel('../data/EndofStudyQuestionnaire_Posttest_64participants.xlsx')
for index,row in ex.iterrows():
   if(index == 0):
      continue
   uniqueId = row[17]
   # age = row[64] #63
   # yearsOfPlaying = 0
   # yearsOfIns = 0
   # YOI = [82,84,86,88]
   # YOP = [83,85,87,89]
   # for I in YOP:
   #    if(isNaN(row[I]) == False):
   #       yearsOfPlaying += getInt(row[I])
   # for I in YOI:
   #    if(isNaN(row[I]) == False):
   #       yearsOfIns += getInt(row[I])
   # if row[67] == 'Right':
   #    LRHand = 1
   # elif row[67] == 'Left':
   #    LRHand = 2
   # else:
   #    LRHand = np.nan
   # if row[65] == 'Female':
   #    Gender = 1
   # elif row[65] == 'Male':
   #    Gender = 2
   # else:
   #    Gender = np.nan
   # if yearsOfIns >= 2:
   #    YOI = 2
   # else:
   #    YOI = 1
   # if yearsOfPlaying >= 2:
   #    YOP = 2
   # else:
   #    YOP = 1
   tmp = {          # Create a dictionary per person!
      'Unique id': uniqueId,
      # 'Age': age, #pd.to_numeric(age), # we use pd.to_numeric to convert strings to numbers. Notice that if there are NaN cells it doesn't give error and just returns NaN
      # 'Gender [1:F, 2:M]': Gender,
      # 'Musician_years of playing ( >= 2 -> 2 )': YOP,
      # 'Musician_years of instruction ( >= 2 -> 2 )': YOI,
      # 'L/R Hand [1:R, 2:L]': LRHand,
      'Vis seq': row[27],
      'Vis SD': row[28],
      'Aud seq': row[29],
      'Aud SD': row[30],
      'vib seq': row[31],
      'vib SD': row[32]
   }
   participants.append(tmp)
print(participants)

df = pd.DataFrame(participants) # converts the list into data frame
writer = pd.ExcelWriter('../results/end_of_study_questionnaire_posttest.xlsx', engine='xlsxwriter') # creates an excel file
df.to_excel(writer, sheet_name='sheet1', index=False)  # puts the dataframe into the excel file
writer.save()
# print(df.groupby('L/R Hand [1:R, 2:L]').size())
# print(df.groupby('Gender [1:F, 2:M]').size())
# a=df['Age'].mean()
# print(f'average of age is {a}')
# print(df.groupby('Musician_years of instruction ( >= 2 -> 2 )').size())
# print(df.groupby('Musician_years of playing ( >= 2 -> 2 )').size())
print(df.groupby('Vis seq').size())
print(df.groupby('Vis SD').size())
print(df.groupby('Aud seq').size())
print(df.groupby('Aud SD').size())
print(df.groupby('vib seq').size())
print(df.groupby('vib SD').size())
