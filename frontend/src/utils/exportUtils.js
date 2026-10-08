/**
 * Data Export Utilities for Job Application Tracker
 */

export function exportToCSV(applications, filename = `job_applications_${new Date().toISOString().slice(0, 10)}.csv`) {
  if (!applications || !applications.length) {
    alert('No application records to export.');
    return;
  }

  const headers = [
    'ID',
    'Company',
    'Role',
    'Location',
    'Status',
    'Application Date',
    'Salary',
    'Job URL',
    'Interviews Count',
    'Description',
  ];

  const escapeCSV = (value) => {
    if (value === null || value === undefined) return '""';
    const str = String(value).replace(/"/g, '""');
    return `"${str}"`;
  };

  const rows = applications.map((app) => [
    escapeCSV(app.id),
    escapeCSV(app.company),
    escapeCSV(app.role),
    escapeCSV(app.location || ''),
    escapeCSV(app.status),
    escapeCSV(app.application_date),
    escapeCSV(app.salary || ''),
    escapeCSV(app.job_url || ''),
    escapeCSV((app.interviews && app.interviews.length) || 0),
    escapeCSV(app.description || ''),
  ]);

  const csvContent = [headers.join(','), ...rows.map((row) => row.join(','))].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function exportToJSON(applications, filename = `job_applications_backup_${new Date().toISOString().slice(0, 10)}.json`) {
  if (!applications || !applications.length) {
    alert('No application records to export.');
    return;
  }

  const jsonStr = JSON.stringify(applications, null, 2);
  const blob = new Blob([jsonStr], { type: 'application/json;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
