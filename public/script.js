// public/script.js
const jobContainer = document.getElementById('job-list');

async function fetchJobs() {
    try {
        const response = await fetch('/api/jobs'); // Hits your Role 1 backend
        const jobs = await response.json();

        if (jobs.length === 0) {
            jobContainer.innerHTML = "<p>No open positions at the moment. Check back soon!</p>";
            return;
        }

        // Render the jobs dynamically
        jobContainer.innerHTML = jobs.map(job => `
            <div class="job-card">
                <h3>${job.title}</h3>
                <p>${job.department} | ${job.location}</p>
                <button onclick="viewJob('${job._id}')">View Details</button>
            </div>
        `).join('');

    } catch (error) {
        console.error("Fetch error:", error);
        jobContainer.innerHTML = "<p style='color: red;'>Unable to connect to the server.</p>";
    }
}

fetchJobs();