import os
from flask import Flask, jsonify, request

app = Flask(__name__)

@app.route('/create-embeddings', methods=['POST'])
def create_embeddings():
    data = request.get_json()
    input_text = data.get('text', None)
    if input_text is None:
        return jsonify({'error': 'No input field provided'}), 400
    # TODO: Process the input_text to generate embeddings
    embeddings_id = '123'
    return jsonify({'embeddings_id': embeddings_id})

@app.route('/get-similar', methods=['POST'])
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
    app.run(host='0.0.0.0', port=port)
