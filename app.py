import numpy as np
from flask import Flask, render_template,request
import pickle

app = Flask(__name__, template_folder="templates", static_folder='/')
model = pickle.load(open('model/model.pkl', 'rb'))

#default page of our web-app
@app.route('/')
def home():
    return render_template('index.html')

#To use the predict button in our web-app
# @app.route('/predict', methods=['POST'])
# def predict():
#     #For rendering results on HTML GUI
#     return render_template('index.html', excel_data='finalprediction.xlsx')

if __name__ == "__main__":
    app.run(debug=True)