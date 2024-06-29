import asyncio
import json
from playwright.async_api import async_playwright

async def intercept_and_scroll(url, output_file):
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=False)  # Set headless=True to run without a browser UI
        page = await browser.new_page()

        responses = []

        async def log_response(response):
            if response.ok and 'application/json' in response.headers.get('content-type', ''):
                try:
                    json_data = await response.json()
                    responses.append(json_data)
                    print(json_data)  # Print the response data
                except Exception as e:
                    print(f"Failed to parse response: {e}")

        page.on('response', log_response)

        await page.goto(url, timeout=60000)
        
        previous_height = await page.evaluate('document.body.scrollHeight')
        while True:
            await page.evaluate('window.scrollTo(0, document.body.scrollHeight)')
            await page.wait_for_timeout(2000)  # Adjust the delay based on the website's loading speed
            new_height = await page.evaluate('document.body.scrollHeight')
            if new_height == previous_height:
                break
            previous_height = new_height

        await browser.close()

        # Save responses to JSON file with utf-8 encoding
        with open(output_file, 'w', encoding='utf-8') as f:
            json.dump(responses, f, ensure_ascii=False, indent=4)

        print(f"Data saved to {output_file}")
