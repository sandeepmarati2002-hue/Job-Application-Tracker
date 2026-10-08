def test_dashboard_summary_metrics(client, auth_headers):
    # Seed known distribution:
    # 2 Applied, 1 Interview, 1 Offer, 1 Rejected = 5 total
    client.post("/applications", json={"company": "App1", "role": "Role1", "status": "Applied"}, headers=auth_headers)
    client.post("/applications", json={"company": "App2", "role": "Role2", "status": "Applied"}, headers=auth_headers)
    client.post("/applications", json={"company": "App3", "role": "Role3", "status": "Interview"}, headers=auth_headers)
    client.post("/applications", json={"company": "App4", "role": "Role4", "status": "Offer"}, headers=auth_headers)
    client.post("/applications", json={"company": "App5", "role": "Role5", "status": "Rejected"}, headers=auth_headers)

    res = client.get("/dashboard/summary", headers=auth_headers)
    assert res.status_code == 200
    data = res.json()

    assert data["total"] == 5
    assert data["applied"] == 2
    assert data["interview"] == 1
    assert data["offer"] == 1
    assert data["rejected"] == 1
    assert data["withdrawn"] == 0

    # Interview count = interview + offer = 2. Rate = (2 / 5) * 100 = 40.0%
    assert data["interview_rate"] == 40.0
    # Offer rate = 1 / 5 = 20.0%
    assert data["offer_rate"] == 20.0
    # Rejection rate = 1 / 5 = 20.0%
    assert data["rejection_rate"] == 20.0
