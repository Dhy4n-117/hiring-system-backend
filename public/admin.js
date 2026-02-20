/**
 * admin.js — HR Admin Dashboard API Utility
 * All requests go through the backend API. No direct DB access.
 * Backend base: http://localhost:5000
 * API prefix:   /api/admin
 */

const BASE_URL = 'http://localhost:5000';
const API = `${BASE_URL}/api/admin`; // http://localhost:5000/api/admin

// ─── TASK 2: JWT Token Management ────────────────────────────────────────────

/**
 * Retrieve the admin JWT from localStorage.
 * @returns {string|null} token or null
 */
function getToken() {
    return localStorage.getItem('adminToken');
}

// ─── TASK 8: Security — Redirect if no token ─────────────────────────────────

/**
 * Guard for protected pages. Call at the top of dashboard scripts.
 * Redirects to login.html if no token is found.
 */
function requireAuth() {
    if (!getToken()) {
        window.location.href = 'login.html';
    }
}

/**
 * Logout: clear token and redirect to login.
 */
function logout() {
    localStorage.removeItem('adminToken');
    window.location.href = 'login.html';
}

// ─── TASK 3: Protected API Request Helper ────────────────────────────────────

/**
 * Send an authenticated fetch request with Bearer token.
 * Automatically handles 401 Unauthorized by redirecting to login.
 *
 * @param {string} url     - Full URL to request
 * @param {string} method  - HTTP method (GET, POST, PUT, PATCH, DELETE)
 * @param {object|null} body - Request body (will be JSON-serialized), or null
 * @returns {Promise<object>} Parsed JSON response
 */
async function authFetch(url, method = 'GET', body = null) {
    const token = getToken();
    if (!token) {
        window.location.href = 'login.html';
        throw new Error('No auth token found.');
    }

    const options = {
        method,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
    };

    if (body && method !== 'GET') {
        options.body = JSON.stringify(body);
    }

    const response = await fetch(url, options);

    // Handle 401 Unauthorized — token expired or invalid
    if (response.status === 401) {
        localStorage.removeItem('adminToken');
        window.location.href = 'login.html';
        throw new Error('Session expired. Please log in again.');
    }

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || `Request failed with status ${response.status}`);
    }

    return data;
}

// ─── TASK 1: Admin Login ──────────────────────────────────────────────────────

/**
 * Log in the admin. Stores JWT in localStorage on success.
 * @param {string} email
 * @param {string} password
 * @returns {Promise<object>} Response data (includes token)
 */
async function loginAdmin(email, password) {
    // POST /api/admin/login  (public — no auth header needed)
    const response = await fetch(`${API}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (response.status === 401) {
        throw new Error('Invalid email or password.');
    }
    if (!response.ok) {
        throw new Error(data.message || `Login failed (${response.status}).`);
    }

    // Store JWT — backend may return field named 'token' or 'accessToken'
    const token = data.token || data.accessToken;
    if (!token) {
        throw new Error('No token received from server.');
    }

    localStorage.setItem('adminToken', token);
    return data;
}

// ─── TASK 4 & 5: Job Management ───────────────────────────────────────────────

/**
 * Create a new job posting.
 * POST /api/admin/jobs
 * @param {object} jobData - { title, department, location, description, requirements, employmentType, salary }
 */
async function createJob(jobData) {
    return authFetch(`${API}/jobs`, 'POST', jobData);
}

/**
 * Fetch all jobs.
 * GET /api/admin/jobs
 */
async function fetchJobs() {
    return authFetch(`${API}/jobs`, 'GET');
}

/**
 * Fetch a single job by ID.
 * GET /api/admin/jobs/:id
 */
async function fetchJobById(id) {
    return authFetch(`${API}/jobs/${id}`, 'GET');
}

// ─── TASK 6: Delete Job ────────────────────────────────────────────────────────

/**
 * Delete a job by ID.
 * DELETE /api/admin/jobs/:id
 * @param {string} id - Job MongoDB _id
 */
async function deleteJob(id) {
    return authFetch(`${API}/jobs/${id}`, 'DELETE');
}

// ─── TASK 7: Update Job Status ────────────────────────────────────────────────

/**
 * Update job status (open | closed).
 * PATCH /api/admin/jobs/:id/status
 * @param {string} id     - Job _id
 * @param {string} status - "open" or "closed"
 */
async function updateJobStatus(id, status) {
    return authFetch(`${API}/jobs/${id}/status`, 'PATCH', { status });
}

/**
 * Update all job fields.
 * PUT /api/admin/jobs/:id
 */
async function updateJob(id, jobData) {
    return authFetch(`${API}/jobs/${id}`, 'PUT', jobData);
}

// ─── Dashboard Stats ──────────────────────────────────────────────────────────

/**
 * Fetch admin dashboard statistics.
 * GET /api/admin/stats
 */
async function fetchStats() {
    return authFetch(`${API}/stats`, 'GET');
}

// ─── Applications ─────────────────────────────────────────────────────────────

/**
 * Fetch all applications (with optional filters).
 * GET /applications?status=...&jobId=...
 * @param {object} filters - { status, jobId } (optional)
 */
async function fetchApplications(filters = {}) {
    const params = new URLSearchParams();
    if (filters.status) params.append('status', filters.status);
    if (filters.jobId) params.append('jobId', filters.jobId);
    const query = params.toString() ? `?${params.toString()}` : '';
    return authFetch(`${API}/applications${query}`, 'GET');
}

/**
 * Update application status.
 * PATCH /api/admin/applications/:id/status
 * @param {string} id     - Application _id
 * @param {string} status - New status
 * @param {string} [interviewDate]
 * @param {string} [notes]
 */
async function updateApplicationStatus(id, status, interviewDate, notes) {
    const body = { status };
    if (interviewDate !== undefined) body.interviewDate = interviewDate;
    if (notes !== undefined) body.notes = notes;
    return authFetch(`${API}/applications/${id}/status`, 'PATCH', body);
}
