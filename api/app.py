from flask import Flask, jsonify

app = Flask(__name__)

@app.route('/')
def hello_world():
    # This function will run when the "/" endpoint is hit
    # It returns a JSON response with a greeting
    return jsonify(message='Hello, World!')

if __name__ == '__main__':
    # The application runs on port 3000 and is accessible publicly
    app.run(host='0.0.0.0', port=3000)