from flask import Flask, request, jsonify
from flask_cors import CORS
import boto3
import pandas as pd
import os

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
        user_name = user_item.get('user_name', {}).get('S', None)  # Extract 'user_name'
        
        # Check if the user exists in the DynamoDB table
        if (email == user_email and password == uesr_password):
            return jsonify({'message': 'Login successful', 'user_name': user_name}), 200
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
        TableName='login',  # Name of your table
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
        TableName='login',
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

# Load the JSON file from the data folder
def load_json_data():
    # Define the path to the JSON file
    json_file_path = os.path.join("data", "2025a1.json")
    
    # Check if the file exists before trying to read it
    if os.path.exists(json_file_path):
        # Read the JSON file into a pandas DataFrame
        df = pd.read_json(json_file_path)
        
        # Normalize the 'songs' column if needed
        df = pd.json_normalize(df['songs'])  # Flatten the 'songs' data
        # Add an auto-incrementing 'id' column starting from 1
        df.insert(0, 'id', range(1, len(df) + 1))  # Insert 'id' as the first column
        return df
    else:
        raise FileNotFoundError(f"The file {json_file_path} was not found.")
    
# Function to check and create the table if it doesn't exist
def create_music_table():
    try:
        # List existing tables
        response = dynamodb.list_tables()
        table_names = response.get('TableNames', [])

        if 'music' not in table_names:
            print("Creating the 'music' table...")

            # Only define attributes used in the KeySchema
            dynamodb.create_table(
                TableName='music',
                KeySchema=[
                    {
                        'AttributeName': 'songid',
                        'KeyType': 'HASH'  # Partition key
                    }
                ],
                AttributeDefinitions=[
                    {
                        'AttributeName': 'songid',
                        'AttributeType': 'N'
                    }
                ],
                ProvisionedThroughput={
                    'ReadCapacityUnits': 5,
                    'WriteCapacityUnits': 5
                }
            )
            print("Table 'music' created successfully.")
        else:
            print("Table 'music' already exists.")
    except Exception as e:
        print(f"Error checking or creating table: {e}")

# Function to insert songs into DynamoDB
def insert_songs_into_dynamodb(df):
    try:
        for index, row in df.iterrows():
            dynamodb.put_item(
                TableName='music',
                Item={
                    'songid': {'N': str(row['id'])},
                    'title': {'S': row['title']},
                    'artist': {'S': row['artist']},
                    'year': {'S': str(row['year'])},
                    'album': {'S': row['album']},
                    'image_url': {'S': row['img_url']}
                }
            )
        print(f"{len(df)} songs inserted into the 'music' table.")
    except Exception as e:
        print(f"Error inserting songs into table: {e}")

# Main function to check table existence, insert data if necessary
def add_data_into_music_table():
    try:
        # Check if the 'music' table exists
        response = dynamodb.list_tables()
        table_names = response.get('TableNames', [])

        if 'music' in table_names:
            print("The 'music' table exists. Checking if it is empty...")

            # Check if the table is empty
            response = dynamodb.scan(TableName='music')
            items = response.get('Items', [])

            if len(items) == 0:
                print("The 'music' table is empty. Loading data and inserting...")
                # Load the data from the JSON file
                df = load_json_data()
                insert_songs_into_dynamodb(df)
            else:
                print("The 'music' table already has data.")
        else:
            print("The 'music' table does not exist. Creating the table...")
            create_music_table()
            # After creating the table, load the data and insert it
            df = load_json_data()
            insert_songs_into_dynamodb(df)
    except Exception as e:
        print(f"Error in add_data_music_table: {e}")

@app.route('/subscriptions/<email>', methods=['GET'])
def get_user_subscribed_songs(email):
    try:
        # 1. Get song IDs from subscriptions table
        sub_response = dynamodb.query(
            TableName='subscriptions',
            KeyConditionExpression='email = :email',
            ExpressionAttributeValues={':email': {'S': email}}
        )
        subscribed_items = sub_response.get('Items', [])

        if not subscribed_items:
            return jsonify([]), 200

        songs = []

        # 2. Get song details from music table
        for item in subscribed_items:
            songid = int(item['songid']['N'])

            music_response = dynamodb.get_item(
                TableName='music',
                Key={'songid': {'N': str(songid)}}
            )

            music_item = music_response.get('Item', None)

            if music_item:
                songs.append({
                    'id': songid,
                    'title': music_item['title']['S'],
                    'artist': music_item['artist']['S'],
                    'album': music_item['album']['S'],
                    'year': int(music_item['year']['S']),
                    'image_url': music_item['image_url']['S']
                })

        return jsonify(songs), 200

    except Exception as e:
        print(f"Error fetching subscriptions: {e}")
        return jsonify({'message': 'Error fetching subscriptions'}), 500

@app.route('/unsubscribe', methods=['POST'])
def unsubscribe_song():
    try:
        data = request.get_json()
        email = data.get('email')
        songid = str(data.get('songid'))

        dynamodb.delete_item(
            TableName='subscriptions',
            Key={
                'email': {'S': email},
                'songid': {'N': songid}
            }
        )
        return jsonify({'message': 'Unsubscribed'}), 200

    except Exception as e:
        print(f"Error in unsubscribe: {e}")
        return jsonify({'message': 'Failed to unsubscribe'}), 500

@app.route('/query', methods=['POST'])
def query_music():
    try:
        data = request.get_json()
        print("Received query:", data)

        filters = []
        expression_values = {}
        expression_names = {}

        if data.get('title'):
            filters.append("title = :title")
            expression_values[":title"] = {"S": data['title']}
        if data.get('year'):
            filters.append("#yr = :year")
            expression_values[":year"] = {"S": str(data['year'])}
            expression_names["#yr"] = "year"
        if data.get('artist'):
            filters.append("artist = :artist")
            expression_values[":artist"] = {"S": data['artist']}
        if data.get('album'):
            filters.append("album = :album")
            expression_values[":album"] = {"S": data['album']}

        if not filters:
            return jsonify([]), 400

        filter_expression = " AND ".join(filters)

        scan_kwargs = {
            "TableName": "music",
            "FilterExpression": filter_expression,
            "ExpressionAttributeValues": expression_values
        }

        if expression_names:
            scan_kwargs["ExpressionAttributeNames"] = expression_names

        response = dynamodb.scan(**scan_kwargs)

        items = response.get('Items', [])
        results = []
        for item in items:
            results.append({
                'id': int(item['songid']['N']),
                'title': item['title']['S'],
                'artist': item['artist']['S'],
                'year': int(item['year']['S']),
                'album': item['album']['S'],
                'image_url': item['image_url']['S']
            })

        return jsonify(results), 200

    except Exception as e:
        print(f"Error in /query route: {e}")
        return jsonify([]), 500

@app.route('/subscribe', methods=['POST'])
def subscribe_song():
    try:
        data = request.get_json()
        email = data['email']
        song = data['song']
        songid = str(song['id'])

        dynamodb.put_item(
            TableName='subscriptions',
            Item={
                'email': {'S': email},
                'songid': {'N': songid}
            }
        )

        return jsonify({'message': 'Subscribed successfully'}), 200

    except Exception as e:
        print(f"Error in /subscribe: {e}")
        return jsonify({'message': 'Failed to subscribe'}), 500


if __name__ == '__main__':
    # Call the function to check if the 'music' table exists, and create it if not
    create_music_table()
    add_data_into_music_table()
    app.run(debug=True, host="0.0.0.0", port=5001)
