import aiomysql

async def execute_query(query, params=None, fetch=False):
    try:
        conn = await aiomysql.connect(
            user='karan',         # replace with your MySQL username
            password='Karan@123',     # replace with your MySQL password
            host='localhost',             # replace with your MySQL host
            db='scrapped'      # replace with your MySQL database name
        )
        async with conn.cursor() as cursor:
            await cursor.execute(query, params)

            if fetch:
                results = await cursor.fetchall()
                return results
            else:
                await conn.commit()
                return None

    except aiomysql.MySQLError as err:
        print(err)
    finally:
        conn.close()

# Example usage
# if __name__ == "__main__":
#     # Example INSERT query
#     insert_query = "INSERT INTO quotes (author_name, quote, genre) VALUES (%s, %s, %s)"
#     insert_params = ()
#     execute_query(insert_query, insert_params)

#     # Example SELECT query
#     select_query = "SELECT * FROM quotes"
#     results = execute_query(select_query, fetch=True)
#     for row in results:
#         print(row)
