import os
from dotenv import load_dotenv
from flask import Flask, jsonify, request
from llama_index.embeddings import GooglePaLMEmbedding
import requests
import json

load_dotenv()

google_cloud_api_key = os.getenv('GOOGLE_CLOUD_API_KEY')
model_name = "models/embedding-gecko-001"
embed_model = GooglePaLMEmbedding(model_name=model_name, api_key=google_cloud_api_key)

app = Flask(__name__)

def get_embeddings_by_id(embeddings_id):
    zilliz_public_endpoint = os.getenv('ZILLIZ_ENDPOINT')
    zilliz_token = os.getenv('ZILLIZ_TOKEN')
    collection_name = 'UserProfile'
    url = f'https://{zilliz_public_endpoint}/v1/vector/get'
    headers = {
        'Content-Type': 'application/json',
        'Authorization': f'Bearer {zilliz_token}'
    }
    
    data = {
        "collectionName": collection_name,
        #"filter": f"id in ({embeddings_id})",
         "id": [embeddings_id],
        "outputFields": ["id", "vector"]
    }
    
    json_data = json.dumps(data)
    
    # Make the POST request
    return requests.post(url, headers=headers, data=json_data)

def search_embeddings(embeddings):
    zilliz_public_endpoint = os.getenv('ZILLIZ_ENDPOINT')
    zilliz_token = os.getenv('ZILLIZ_TOKEN')
    collection_name = 'UserProfile'
    url = f'https://{zilliz_public_endpoint}/v1/vector/search'
    headers = {
        'Content-Type': 'application/json',
        'Authorization': f'Bearer {zilliz_token}'
    }
    
    data = {
        "collectionName": collection_name,
        "vector":embeddings
    }
    
    json_payload = json.dumps(data)
    response = requests.post(url, headers=headers, data=json_payload)
    
    json_data = json.dumps(data)
    
    # Make the POST request
    return requests.post(url, headers=headers, data=json_data)

def insert_embeddings(embeddings):
    zilliz_public_endpoint = os.getenv('ZILLIZ_ENDPOINT')
    zilliz_token = os.getenv('ZILLIZ_TOKEN')
    collection_name = 'UserProfile'
    url = f'https://{zilliz_public_endpoint}/v1/vector/insert'
    headers = {
        'Content-Type': 'application/json',
        'Authorization': f'Bearer {zilliz_token}'
    }
    
    data = {
        "collectionName": collection_name,
        "data": [
            {
                "vector": embeddings
            }
        ]
    }
    
    json_data = json.dumps(data)
    
    # Make the POST request
    return requests.post(url, headers=headers, data=json_data)

@app.route('/create-embeddings', methods=['POST'])
def create_embeddings():
    data = request.get_json()
    input_text = data.get('text', None)
    #input_text = "Revolutionizing financial services through different computing solutions.Secured $15 million in funding for innovative algorithms."
    if input_text is None:
        return jsonify({'error': 'No input field provided'}), 400
    
    embeddings = embed_model.get_text_embedding(input_text)
    response = insert_embeddings(embeddings)
    
    # Check the response
    if response.status_code == 200:
        print("Request successful")
        print(response.json()['data']['insertIds'][0])
        return jsonify({'embeddings_id': response.json()['data']['insertIds'][0]})
    else:
        print("Request failed with status code:", response.status_code)
        print(response.text)  # This will show the error message or details
        return jsonify(response.text)

@app.route('/get-similar', methods=['GET'])
def get_similar():
    #data = request.get_json()
    #embeddings_id = data.get('embeddings_id', None)
    embeddings_id = '446160555542072221'
    if embeddings_id is None or not isinstance(embeddings_id, str):
        return jsonify({'error': 'No input field provided or input is not a string'}), 400
    embedding_res = get_embeddings_by_id(embeddings_id)
    # Check the response
    if embedding_res.status_code == 200:
        print("Request successful")
        print(embedding_res.json()['data'][0]['vector'])
        search_res = search_embeddings(embedding_res.json()['data'][0]['vector'])
        if search_res.status_code == 200:
            print("Request successful")
            print(search_res.json()['data'])
            converted_results = [
                {'embeddings_id': str(item['id']), 'score': item['distance']}
                for item in search_res.json()['data']
            ]
            print(converted_results)
            return converted_results
        else:
            print("Request failed with status code:", search_res.status_code)
            print(search_res.text)  # This will show the error message or details
            return search_res
    else:
        print("Request failed with status code:", embedding_res.status_code)
        print(embedding_res.text)  # This will show the error message or details
        return embedding_res

@app.route('/', methods=['GET'])
def index():
    return jsonify({'message': 'Hello world'})

if __name__ == '__main__':
    # The application runs on the port provided by Heroku or 3000 if it's not set
    port = int(os.environ.get('PORT', 3000))
    app.run(host='0.0.0.0', port=port)
