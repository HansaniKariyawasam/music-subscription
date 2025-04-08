from flask import Flask, request, jsonify
from flask_cors import CORS

# Initialize Flask App
app = Flask(__name__)
CORS(app)  # Enable CORS for the app

# Initialize DynamoDB resource with specific credentials 
testEmail = "test@gmail.com"
testPassword = "123"

# 1. Login Route
@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()  # Get the incoming JSON data from the frontend
    email = data.get('email')
    password = data.get('password')
    
    if not email or not password:
        return jsonify({'message': 'Email and password are required'}), 400
    
    # Check if the user exists in the DynamoDB table
    if (email == testEmail and password == testPassword):
        return jsonify({'message': 'Login successful'}), 200
    else:
        return jsonify({'message': 'Invalid Username or password'}), 401

# 2. Register Route

# 3. Music Route

if __name__ == '__main__':
    app.run(debug=True, host="0.0.0.0", port=5001)
