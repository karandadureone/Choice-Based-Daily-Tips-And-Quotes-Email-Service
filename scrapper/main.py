import argparse
from scraper import intercept_and_scroll
from parse2 import parse_json_file
import asyncio

async def main(topic):
    base_url = 'https://www.quotery.com/topics/'
    
    # Construct the URL based on the user input
    url = base_url + topic
    
    # Define the output file name based on the topic input
    output_file = f"{topic}.json"

    # Call the intercept_and_scroll function
    await intercept_and_scroll(url, output_file)

    file_path = output_file

    await parse_json_file(file_path)

if __name__ == "__main__":
    # Create the parser
    parser = argparse.ArgumentParser(description="Scrape and parse quotes based on a given topic.")
    
    # Add the argument
    parser.add_argument('topic', type=str, help="The name of the genre/topic to scrape.")
    
    # Parse the argument
    args = parser.parse_args()
    
    # Run the main function with the provided topic
    asyncio.run(main(args.topic))
