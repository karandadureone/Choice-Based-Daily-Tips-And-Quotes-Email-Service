from database import get_email_content, get_count
import random
import json
from database import get_quote_author
from send import send_email


def get_email_topic():
    count = get_count()
    print(count)
    # Check if count retrieval was successful
    if count is None:
        print("Failed to retrieve count from database")
        return
    
    # Loop over the range of counts (assuming count is the total number of rows)
    for i in range(count):
        email_contain = get_email_content(i+1)
        print(email_contain)
        
        # Check if email content retrieval was successful
        if email_contain is None:
            print(f"Failed to retrieve email content for id {i+1}")
            continue
        
        for record in email_contain:
            email = record['email']
            raw_topics_list = json.loads(record['topics'])
            # topics_list = [word.strip() for word in raw_topics_list]
            # topic = random.choice(topics_list)
            topic = random.choice(raw_topics_list)
            print(email, topic)
            quote_data = get_quote_author(topic)
            send_email(email,quote_data)

            

if __name__ == "__main__":
    get_email_topic()
