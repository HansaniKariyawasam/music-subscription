from flask import Flask, request, jsonify
from flask_cors import CORS
import boto3

# Initialize Flask App
app = Flask(__name__)
CORS(app)  # Enable CORS for the app

# Initialize DynamoDB resource with specific credentials 
# add here

# 1. Login Route
@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()  # Get the incoming JSON data from the frontend
    email = data.get('email')
    password = data.get('password')
    
    if not email or not password:
        return jsonify({'message': 'Email and password are required'}), 400

    search_user = search_user_by_email(email)
    print(search_user)

    if len(search_user) > 0:
        user_item = search_user[0]  # Access the first item in the list
        user_email = user_item.get('email', {}).get('S', None)  # Extract 'email' value
        uesr_password = user_item.get('password', {}).get('S', None)  # Extract 'password' value

        # Check if the user exists in the DynamoDB table
        if (email == user_email and password == uesr_password):
            return jsonify({'message': 'Login successful'}), 200
    return jsonify({'message': 'Invalid Username or password'}), 401

# 2. Register Route
@app.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    email = data.get('email')
    username = data.get('username')
    password = data.get('password')

    search_user = search_user_by_email(email)
    print(search_user)
    # Check if the user exists in the DynamoDB table
    if len(search_user) > 0:    # If there's at least one item, the user already exists
        print(f"User already exists with email: {email}")
        return jsonify({'message': 'The email already exists'}), 409

    # Create the new user
    response = add_new_user(email, username, password)
    return jsonify(response[0]), response[1]

# Search the user exists in the DynamoDB login table
def search_user_by_email(email):
    # Query for items with a specific email
    response = dynamodb.query(
        TableName='user_info_muc',  # Name of your table
        KeyConditionExpression='email = :email',  # Query on the 'email' partition key
        ExpressionAttributeValues={
            ':email': {'S': email}  # Replace with the email you're searching for
        }
    )

    # Extract the items from the response
    items = response.get('Items', [])
    return items

def add_new_user(email, user_name, password):
    response = dynamodb.put_item(
        TableName='user_info_muc',
        Item={
            'email': {'S': email},
            'user_name': {'S': user_name},
            'password': {'S': password}
        }
    )
    # Check if the response indicates success
    if response['ResponseMetadata']['HTTPStatusCode'] == 200:
        print(f"User {email} successfully added to the database.")
        return {'message': 'User registered successfully'}, 200
    else:
        print(f"Failed to add user {email} to the database.")
        return {'message': 'Failed to register user'}, 500

# 3. Music Route

if __name__ == '__main__':
    app.run(debug=True, host="0.0.0.0", port=5001)
