import requests
def weatherStation(keyword):
    base_url = "https://jsonmock.hackerrank.com/api/weather/search?name={}".format(keyword)
    results = []

    # First request to get total pages
    response = requests.get(base_url + "&page=1").json()
    total_pages = response["total_pages"]

    # Loop through all pages
    for page in range(1, total_pages + 1):
        response = requests.get(base_url + f"&page={page}").json()
        for record in response["data"]:
            city = record["name"]
            temperature = record["weather"].replace(" degree", " ").strip()
            wind = record["status"][0].replace("Wind: ", " ").replace("Kmph", " ").strip()
            humidity = (
                record["status"][1].replace("Humidity: ", "").replace("%", " ").strip()
            )

            formatted = "{} , {}, {}, {}".format(city, temperature, wind, humidity)
            results.append(formatted)

    # Sort by city name
    results.sort()
    return results


def main():
    keyword = input().strip()  # Take input from user
    output = weatherStation(keyword)
    for record in output:
        print(record)


if __name__ == "__main__":
    main()
