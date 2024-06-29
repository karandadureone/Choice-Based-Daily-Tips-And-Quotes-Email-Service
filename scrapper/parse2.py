import json
from database import execute_query
import sys

# Set default encoding to utf-8
sys.stdout.reconfigure(encoding='utf-8')

# Define the global variable
genre = ''

async def parse_json_file(file_path):
    global genre
    # Extract genre from the file path
    genre = file_path.split('.')[0]
    print("This is the genre: ", genre)
    
    # Open and load the JSON file with utf-8 encoding
    with open(file_path, 'r', encoding='utf-8') as f:
        json_data = json.load(f)
        
        # Check if json_data is a list or a single item
        if isinstance(json_data, list):
            for item in json_data:
                await parse_item(item)
        else:
            await parse_item(json_data)

async def parse_item(item):
    if isinstance(item, list):
        for sub_item in item:
            await parse_item(sub_item)
    else:
        quotes = item.get('quotes', [])
        for quote in quotes:
            author_name = quote.get('author', {}).get('name')
            body = quote.get('body')
            print(f"Author: {author_name}")
            print(f"Quote: {body}")
            print("----------------------------")
            query = 'INSERT INTO quotes (author_name, quote, genre) VALUES (%s, %s, %s)'
            params = (author_name, body, genre)
            print("Genre: ", genre)
            await execute_query(query, params)  # Assuming execute_query is an async function
