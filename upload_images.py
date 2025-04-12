import boto3
import pandas as pd
import os
import json
import requests
from dotenv import load_dotenv
load_dotenv()

# AWS credentials and region
aws_access_key_id = os.getenv("aws_access_key_id")
aws_secret_access_key = os.getenv("aws_secret_access_key")
aws_session_token = os.getenv("aws_session_token")
region_name = os.getenv("AWS_REGION")
dynamodb = boto3.client('dynamodb',aws_access_key_id = aws_access_key_id, 
                      aws_secret_access_key = aws_secret_access_key,
                      aws_session_token = aws_session_token,
                        region_name = region_name)
BUCKET_NAME = "group-78-a1"

# Initialize AWS clients
dynamodb = boto3.client(
    'dynamodb',
    aws_access_key_id=aws_access_key_id,
    aws_secret_access_key=aws_secret_access_key,
    aws_session_token=aws_session_token,
    region_name=region_name
)

s3 = boto3.client(
    's3',
    aws_access_key_id=aws_access_key_id,
    aws_secret_access_key=aws_secret_access_key,
    aws_session_token=aws_session_token,
    region_name=region_name
)

#generate consistent S3 object key
def get_s3_key(artist_name):
    return f"album_img/{artist_name.replace(' ', '_').replace('/', '-')}.jpg"

# Check if image exists in S3
def image_exists_in_s3(artist_name):
    key = get_s3_key(artist_name)
    try:
        s3.head_object(Bucket=BUCKET_NAME, Key=key)
        print(f"Image already exists for artist: {artist_name}")
        return True
    except s3.exceptions.ClientError:
        print(f"Image does not exist yet for artist: {artist_name}")
        return False

# Upload (or overwrite) image to S3
def upload_image_to_s3(artist_name, image_data):
    key = get_s3_key(artist_name)
    s3.put_object(
        Bucket=BUCKET_NAME,
        Key=key,
        Body=image_data,
        ContentType='image/jpeg'
    )
    print(f" Uploaded/Updated image for: {artist_name}")


def download_and_upload_images(data_directory, json_filename):
    json_file_path = os.path.join(data_directory, json_filename)

    if not os.path.exists(json_file_path):
        print(f" JSON file '{json_filename}' not found in directory '{data_directory}'.")
        return

    print(f"Reading JSON file...")
    with open(json_file_path, 'r') as f:
        data = json.load(f)

    df = pd.DataFrame(data['songs'])
    uploaded_artists = []
    failed_artists = []

    print(f"\n Processing {len(df)} songs...\n")
    print("\n Starting image upload process. This may take a moment... Please wait.\n")
    for _, row in df.iterrows():
        artist_name = row['artist']
        image_url = row['img_url']

        if image_exists_in_s3(artist_name):
            continue  # Skip if already uploaded

        try:
            # Download image from URL
            image_data = requests.get(image_url).content
            upload_image_to_s3(artist_name, image_data)
            uploaded_artists.append(artist_name)

        except Exception as e:
            failed_artists.append((artist_name, str(e)))

    print(f"\n Uploaded {len(uploaded_artists)} new images.")
    if failed_artists:
        print(f"\n Failed to upload {len(failed_artists)} images:")
        for artist, error in failed_artists:
            print(f"- {artist}: {error}")

if __name__ == '__main__':
    download_and_upload_images("data", "2025a1.json")
