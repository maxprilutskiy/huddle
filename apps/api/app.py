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

def zilliz_insert(embeddings):
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
    response = zilliz_insert(embeddings)
    
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
    data = request.get_json()
    embeddings_id = data.get('embeddings_id', None)
    if embeddings_id is None or not isinstance(embeddings_id, str):
        return jsonify({'error': 'No input field provided or input is not a string'}), 400
    # TODO: Process the input_numbers to find similar items
    embeddings = [{ 'embeddings_id': '123', 'score': 0.9 }, { 'embeddings_id': '234', 'score': 0.85 }]
    return jsonify({'embeddings': embeddings})

if __name__ == '__main__':
    # The application runs on the port provided by Heroku or 3000 if it's not set
    port = int(os.environ.get('PORT', 3000))
    #app.run(host='0.0.0.0', port=port)
    print('Here')
    create_embeddings()
    
