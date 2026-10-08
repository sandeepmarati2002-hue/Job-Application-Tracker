def test_create_and_get_application(client, auth_headers):
    # 1. Create application
    payload = {
        "company": "Stripe",
        "role": "Software Engineer",
        "location": "Remote",
        "job_url": "https://stripe.com/jobs",
        "status": "Applied",
        "application_date": "2026-10-01",
        "salary": "$150,000",
        "description": "Backend infrastructure role.",
    }
    create_res = client.post("/applications", json=payload, headers=auth_headers)
    assert create_res.status_code == 201
    created_data = create_res.json()
    app_id = created_data["id"]
    assert created_data["company"] == "Stripe"
    assert created_data["status"] == "Applied"

    # 2. Get application by ID
    get_res = client.get(f"/applications/{app_id}", headers=auth_headers)
    assert get_res.status_code == 200
    assert get_res.json()["company"] == "Stripe"


def test_update_application(client, auth_headers):
    # Create application
    payload = {
        "company": "Netflix",
        "role": "Full Stack Engineer",
        "status": "Applied",
    }
    create_res = client.post("/applications", json=payload, headers=auth_headers)
    app_id = create_res.json()["id"]

    # Update status to Interview and add salary
    update_res = client.put(
        f"/applications/{app_id}",
        json={"status": "Interview", "salary": "$180,000"},
        headers=auth_headers,
    )
    assert update_res.status_code == 200
    updated_data = update_res.json()
    assert updated_data["status"] == "Interview"
    assert updated_data["salary"] == "$180,000"


def test_delete_application(client, auth_headers):
    # Create application
    create_res = client.post(
        "/applications",
        json={"company": "Spotify", "role": "Data Engineer"},
        headers=auth_headers,
    )
    app_id = create_res.json()["id"]

    # Delete
    del_res = client.delete(f"/applications/{app_id}", headers=auth_headers)
    assert del_res.status_code == 204

    # Verify not found
    get_res = client.get(f"/applications/{app_id}", headers=auth_headers)
    assert get_res.status_code == 404


def test_list_applications_filtering_and_sorting(client, auth_headers):
    # Seed 3 distinct applications
    client.post(
        "/applications",
        json={"company": "Alpha Corp", "role": "Frontend Dev", "status": "Applied", "application_date": "2026-09-01"},
        headers=auth_headers,
    )
    client.post(
        "/applications",
        json={"company": "Beta Labs", "role": "Backend Dev", "status": "Offer", "application_date": "2026-09-10"},
        headers=auth_headers,
    )
    client.post(
        "/applications",
        json={"company": "Gamma Inc", "role": "DevOps", "status": "Applied", "application_date": "2026-09-05"},
        headers=auth_headers,
    )

    # Filter by status
    res_status = client.get("/applications?status=Offer", headers=auth_headers)
    assert res_status.status_code == 200
    apps = res_status.json()
    assert len(apps) == 1
    assert apps[0]["company"] == "Beta Labs"

    # Search by keyword
    res_search = client.get("/applications?search=Frontend", headers=auth_headers)
    assert res_search.status_code == 200
    search_apps = res_search.json()
    assert len(search_apps) == 1
    assert search_apps[0]["company"] == "Alpha Corp"

    # Sort company A-Z
    res_sort = client.get("/applications?sort_by=company-asc", headers=auth_headers)
    assert res_sort.status_code == 200
    sorted_apps = res_sort.json()
    companies = [a["company"] for a in sorted_apps]
    assert companies == sorted(companies)


def test_export_applications_csv(client, auth_headers):
    client.post(
        "/applications",
        json={"company": "Databricks", "role": "Solutions Architect", "status": "Interview", "salary": "$200,000"},
        headers=auth_headers,
    )
    res = client.get("/applications/export/csv", headers=auth_headers)
    assert res.status_code == 200
    assert "text/csv" in res.headers["content-type"]
    content = res.text
    assert "Company,Role,Location,Status" in content
    assert "Databricks" in content
    assert "Solutions Architect" in content

