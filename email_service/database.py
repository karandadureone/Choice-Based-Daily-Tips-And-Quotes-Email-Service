import mysql.connector
from mysql.connector import Error

DB_HOST = 'localhost'
DB_USER = 'karan'
DB_PASSWORD = 'Karan@123'
DB_NAME = 'scrapped'

def create_connection():
    """Create a connection to the MySQL database."""
    try:
        conn = mysql.connector.connect(
            host=DB_HOST,
            user=DB_USER,
            password=DB_PASSWORD,
            database=DB_NAME
        )
        return conn
    except mysql.connector.Error as e:
        print(f"Error connecting to MySQL: {e}")
        return None

def get_email_content(id):
    """Retrieve email content and topics from the database."""
    conn = create_connection()
    if conn is None:
        return None
    
    try:
        cursor = conn.cursor(dictionary=True)
        query = "SELECT email, topics FROM user_master WHERE id = %s"
        cursor.execute(query, (id,))
        email_data = cursor.fetchall()
        return email_data
    except mysql.connector.Error as e:
        print(f"Error executing query: {e}")
        return None
    finally:
        if conn.is_connected():
            cursor.close()
            conn.close()

def get_count():
    """Get the count of records in user_master table."""
    conn = create_connection()
    if conn is None:
        return None
    
    try:
        cursor = conn.cursor(dictionary=True)
        query = "SELECT COUNT(*) as count FROM user_master"
        cursor.execute(query)
        email_count = cursor.fetchone()['count']
        return email_count  # Return the count directly
    except mysql.connector.Error as e:
        print(f"Error executing query: {e}")
        return None
    finally:
        if conn.is_connected():
            cursor.close()
            conn.close()

def get_quote_author(topic):
    """Retrieve a random quote and author for a given topic."""
    conn = create_connection()
    if conn is None:
        return None
    
    try:
        cursor = conn.cursor(dictionary=True)
        query = "SELECT quote, author_name FROM quotes WHERE genre = %s ORDER BY RAND() LIMIT 1"
        cursor.execute(query, (topic,))
        quote_data = cursor.fetchone()  # Using fetchone() as we expect only one row
        print(quote_data)
        return quote_data
    except mysql.connector.Error as e:
        print(f"Error executing query: {e}")
        return None
    finally:
        if conn.is_connected():
            cursor.close()
            conn.close()
