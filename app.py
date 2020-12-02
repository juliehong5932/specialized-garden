from flask import Flask, jsonify, render_template
from flask_cors import CORS
import numpy as np
import pickle

app=Flask(__name__)
CORS(app)

@app.route('/')
def index():
	return render_template('index.html')
@app.route('/Data')
def Data():
	return render_template('Data.html')
@app.route('/State')
def State():
	return render_template('State.html')
@app.route('/PlantType_chart')
def PlantType_chart():
	return render_template('PlantType_chart.html')
@app.route('/about')
def about():
	return render_template('about.html')

@app.route('/predict/')
@app.route('/predict/<query_string>')
def predict(query_string=''): 
	with open("model/clf.sav", "rb") as ml: 
		clf=pickle.load(ml)
	# rf=pickle.load(open("model/rf.sav", "rb"))
	input_ary=str_to_input(query_string).tolist()
	print(f'input: {input_ary}')
	[results_ary]=clf.predict_proba([input_ary])
	# [results_ary]=rf.predict_proba([input_ary])
	recs_list=[rec for rec in list(zip(clf.classes_, results_ary)) if rec[1]!=0]
	# recs_list=[rec for rec in list(zip(rf.classes_, results_ary)) if rec[1]!=0]
	recs=sorted(recs_list, key=lambda x: x[1], reverse=True)
	return jsonify(recs)

def str_to_input(query_string):
	with open('data/input_template.txt', 'r') as f: 
	    input_template=f.read()
	    input_template_list=input_template.split(",\n")
	template_dict={input_template_list[i]: i for i in range(0, len(input_template_list))}
	# input_dict={input_template_list[i]: i for i in range(0, len(input_template_list))}
	input_list=query_string.split('&')
	input_ary=np.zeros(len(input_template_list))
	for each_input in input_list: 
		if each_input in template_dict: 
			input_ary[template_dict[each_input]]=1
	# print([each_input for each_input in list(zip(input_template_list, input_ary)) if each_input[1]!=0])
	return input_ary

if __name__ == '__main__':
    app.run()