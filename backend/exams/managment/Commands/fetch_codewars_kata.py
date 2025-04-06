import requests

API_KEY = "YOUR_API_KEY_HERE"  # ← حطي هنا الـ API Key بتاعك

HEADERS = {
    "Authorization": API_KEY
}

# قائمة بعينة من كاتا ID من Codewars
kata_ids = [
    "526571aae218b8ee490006f4",  # Sum of positive
    "514b92a657cdc65150000006",  # Multiples of 3 or 5
    "54ff3102c1bad923760001f3",  # Vowel Count
    "55f2b110f61eb01779000053",  # Return Negative
    "8e63f96e665673a1ed000184",  # Unique Sum
]

def fetch_kata_details(kata_id):
    url = f"https://www.codewars.com/api/v1/code-challenges/{kata_id}"
    try:
        response = requests.get(url, headers=HEADERS)
        response.raise_for_status()
        return response.json()
    except requests.RequestException as e:
        print(f"Error fetching kata {kata_id}: {e}")
        return None

def main():
    print("Fetching 5 Codewars challenges...\n")
    for kata_id in kata_ids:
        data = fetch_kata_details(kata_id)
        if data:
            print(f"Title: {data['name']}")
            print(f"Slug: {data['slug']}")
            print(f"Rank: {data['rank']['name']}")
            print(f"Languages: {', '.join(data['languages'])}")
            print(f"Description:\n{data['description'][:300]}...")  # عرض أول 300 حرف بس
            print("-" * 60)

if __name__ == "__main__":
    main()
