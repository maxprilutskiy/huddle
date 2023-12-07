import os
from flask import Flask, jsonify

app = Flask(__name__)

@app.route('/')
def hello_world():
    # This function will run when the "/" endpoint is hit
    # It returns a JSON response with a greeting
    return jsonify(message='Hello, World!')

if __name__ == '__main__':
    # The application runs on the port provided by Heroku or 3000 if it's not set
    port = int(os.environ.get('PORT', 3000))
    app.run(host='0.0.0.0', port=port)