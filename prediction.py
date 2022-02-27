import pandas as pd
import pickle
from sklearn.tree import DecisionTreeClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score
from pandas.core.dtypes.missing import isna

#import csv

dataset = pd.read_excel("inputdata.xlsx")

dataset[dataset.duplicated(["id"])]

dataset = dataset.drop_duplicates()
len(dataset[dataset.duplicated(["id"])])

maindataset=dataset[dataset["delay"].notnull()]
nulldataset=dataset[dataset["delay"].isnull()]
#print(maindataset)
#print(nulldataset)

X = maindataset.drop(columns=["id", "delay"])
y = maindataset["delay"]
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2)

model = DecisionTreeClassifier()
model.fit(X_train, y_train)

nulldataset.keys()

row_keys = nulldataset["id"].keys()
first_key = row_keys[0]

predictions = []
def predictResult(input1, input2):
  output = model.predict([[input1, input2]])[0]
  #print(output)
  return output

input_set1 = nulldataset["bill"]
#print(input_set1)
input_set2 = nulldataset["due"]
#print(input_set2)
limit_value = first_key + len(input_set1)
while(first_key<limit_value):
  input1 = input_set1[first_key]
  #print(input1)
  input2 = input_set2[first_key]
  #print(input2)
  predictions.append(predictResult(input1, input2))
  first_key += 1

#print(predictions)
maindatalist = maindataset.values.tolist()
nulldatalist = nulldataset.values.tolist()
for i in range(len(nulldatalist)):
  if isna(nulldatalist[i][3]):
    nulldatalist[i][3] = predictions[i]
  else:
    pass
finaldatalist = maindatalist + nulldatalist
finaldataset = pd.DataFrame(finaldatalist, columns=['id','bill', 'due', 'delay'])
finaldataset.to_excel('finalprediction.xlsx')
pickle.dump(DecisionTreeClassifier, open('model/model.pkl','wb'))
#score = accuracy_score(y_test, predictions)
#print(score)