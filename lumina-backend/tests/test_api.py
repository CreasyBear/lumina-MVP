import requests

BASE_URL = "http://localhost:8000/api/consulting"

def test_create_problem():
  problem_data = {
      "title": "API Test Problem",
      "description": "This problem was created via API test",
      "client": "API Tester",
      "status": "New"
  }
  response = requests.post(f"{BASE_URL}/problems/", json=problem_data)
  print(f"Create Problem Status Code: {response.status_code}")
  if response.status_code != 200:
      print(f"Create Problem Response Content: {response.content}")
  try:
      response_data = response.json()
      print(f"Created Problem: {response_data}")
  except ValueError:
      print("Response content is not valid JSON")

def test_get_problems():
  response = requests.get(f"{BASE_URL}/problems/")
  print(f"Get Problems Status Code: {response.status_code}")
  if response.status_code != 200:
      print(f"Get Problems Response Content: {response.content}")
  try:
      response_data = response.json()
      print(f"Problems: {response_data}")
  except ValueError:
      print("Response content is not valid JSON")

if __name__ == "__main__":
  test_create_problem()
  test_get_problems()