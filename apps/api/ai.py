from dotenv import load_dotenv
from llama_index.embeddings import GooglePaLMEmbedding
import requests
import json
import os

# Load the .env file
load_dotenv()

# Now you can access the variables defined in .env
database = 'data.json'
input_data = 'input.json'
input_vector = 'embedding_1.json'


google_cloud_api_key = os.getenv('GOOGLE_CLOUD_API_KEY')

zilliz_public_endpoint = os.getenv('ZILLIZ_ENDPOINT')
zilliz_token = os.getenv('ZILLIZ_TOKEN')

model_name = "models/embedding-gecko-001"
embed_model = GooglePaLMEmbedding(model_name=model_name, api_key=google_cloud_api_key)

# URL and headers
url = f'https://{zilliz_public_endpoint}/v1/vector/search'
headers = {
    'Content-Type': 'application/json',
    'Authorization': f'Bearer {zilliz_token}'
}

# function that accepts an arbitrary json object and returns embeddings as a list of floats
def get_embeddings(filename):
    with open(filename, 'r') as json_file:
        data = json.load(json_file)
    
    # Initialize a counter for file naming
    file_counter = 1
    
    # Extract text data and generate embeddings
    for entry in data:
        location = entry.get('location', '')
        company_description = entry.get('company_description', '')
        latest_achievement = entry.get('latest_achievement', '')
        current_challenge = entry.get('current_challenge', '')
        
        # Concatenate text data
        text_to_embed = f"{location} {company_description} {latest_achievement} {current_challenge}"
        #Generate embeddings for the concatenated text
        embeddings = embed_model.get_text_embedding(text_to_embed)
        
        # Create the dictionary matching the required format
        output_dict = {"rows": [{"vector": embeddings}]}
        
        # Define the output file path and name
        output_file = f'embedding_{file_counter}.json'
        
        # Save the output to a new JSON file
        with open(output_file, 'w') as output_json_file:
            json.dump(output_dict, output_json_file)
        
        print(f"Embedding {file_counter} exported to {output_file}")
        file_counter += 1
    
# function that accepts an embedding and returns a list of similar embeddings
def get_similar(filename):
    with open(filename, 'r') as json_file:
        data = json.load(json_file)
        
    print(data["rows"][0]["vector"])
    json_payload = json.dumps({"collectionName": "UserProfile",'vector':data["rows"][0]["vector"]})
    response = requests.post(url, headers=headers, data=json_payload)
    # Check the response
    if response.status_code == 200:
        print("Request successful")
        print(response.json())  # This will display the response data
    else:
        print("Request failed with status code:", response.status_code)
        print(response.text)  # This will show the error message or details

get_embeddings(database)
# get_similar(input_vector)


