from dotenv import load_dotenv
import os

# Load the .env file
load_dotenv()

# Now you can access the variables defined in .env
test_env_var = os.getenv('GOOGLE_VERTEX_AUTH')

# log the value of the variable
print(test_env_var)

# function that accepts an arbitrary json object and returns embeddings as a list of floats
def get_embeddings(json_object):
    return [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

# function that accepts an embedding and returns a list of similar embeddings
def get_similar(embedding):
    return [[1, 2, 3, 4, 5, 6, 7, 8, 9, 10], [10, 9, 8, 7, 6, 5, 4, 3, 2, 1]]