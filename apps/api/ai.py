from dotenv import load_dotenv
from llama_index.llms.vertex import Vertex
from llama_index.embeddings import GooglePaLMEmbedding
import json
import os

# Load the .env file
load_dotenv()

# Now you can access the variables defined in .env
test_env_var = os.getenv('GOOGLE_VERTEX_AUTH')
filename = 'data.json'
model_name = "models/embedding-gecko-001"
google_cloud_api_key = os.getenv('GOOGLE_CLOUD_API_KEY')
embed_model = GooglePaLMEmbedding(model_name=model_name, api_key=google_cloud_api_key)

# log the value of the variable
print(test_env_var)

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
def get_similar(embedding):
    return [[1, 2, 3, 4, 5, 6, 7, 8, 9, 10], [10, 9, 8, 7, 6, 5, 4, 3, 2, 1]]

get_embeddings('data.json')
