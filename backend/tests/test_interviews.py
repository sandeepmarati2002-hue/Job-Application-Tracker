def test_add_and_delete_interview(client, auth_headers):
    # Create application
    app_res = client.post(
        "/applications",
        json={"company": "Adobe", "role": "SWE", "status": "Interview"},
        headers=auth_headers,
    )
    app_id = app_res.json()["id"]

    # Add interview round
    iv_payload = {
        "interview_type": "Technical Round 1",
        "interview_date": "2026-10-15T10:00:00Z",
        "interviewer": "John Staff",
        "notes": "System design and concurrency",
        "result": "Passed",
    }
    iv_res = client.post(f"/applications/{app_id}/interviews", json=iv_payload, headers=auth_headers)
    assert iv_res.status_code == 201
    iv_data = iv_res.json()
    assert iv_data["application_id"] == app_id
    assert iv_data["result"] == "Passed"
    interview_id = iv_data["id"]

    # Verify interview is returned inside application details
    app_details = client.get(f"/applications/{app_id}", headers=auth_headers).json()
    assert len(app_details["interviews"]) == 1
    assert app_details["interviews"][0]["id"] == interview_id

    # Update interview
    update_res = client.put(
        f"/interviews/{interview_id}",
        json={"result": "Passed", "notes": "Candidate passed with high score"},
        headers=auth_headers,
    )
    assert update_res.status_code == 200
    assert update_res.json()["notes"] == "Candidate passed with high score"

    # Delete interview
    del_res = client.delete(f"/interviews/{interview_id}", headers=auth_headers)
    assert del_res.status_code == 204

    # Verify interview removed from application
    refreshed_app = client.get(f"/applications/{app_id}", headers=auth_headers).json()
    assert len(refreshed_app["interviews"]) == 0


def test_cascade_delete_application_removes_interviews(client, auth_headers):
    # Create application
    app_res = client.post(
        "/applications",
        json={"company": "Uber", "role": "Backend SDE"},
        headers=auth_headers,
    )
    app_id = app_res.json()["id"]

    # Add interview
    iv_res = client.post(
        f"/applications/{app_id}/interviews",
        json={"interview_type": "HR Screen", "interview_date": "2026-10-12T14:00:00Z"},
        headers=auth_headers,
    )
    interview_id = iv_res.json()["id"]

    # Delete application
    del_app = client.delete(f"/applications/{app_id}", headers=auth_headers)
    assert del_app.status_code == 204

    # Verify interview is also gone
    del_iv = client.delete(f"/interviews/{interview_id}", headers=auth_headers)
    assert del_iv.status_code == 404
