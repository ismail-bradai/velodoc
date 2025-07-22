# This is a flask server that serves all AI related endpoints
from flask import Flask, request, jsonify

app = Flask(__name__)

@app.route('/generate_medical_report', methods=['POST'])
def generate_medical_report():
    """
    Generate a medical report based on the provided patient data, EHR data, medical history, and the template.
    """
    pass


    

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
    