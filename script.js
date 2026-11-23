const internships = [
  {
    id: 1,
    title: "Frontend Intern",
    company: "PixelCraft",
    location: "Remote",
    stipend: "$1,000/mo",
    duration: "3 Months",
    description: "Build web pages using HTML, CSS, and JavaScript."
  },
  {
    id: 2,
    title: "UI/UX Intern",
    company: "NovaDesign",
    location: "Hybrid",
    stipend: "$900/mo",
    duration: "4 Months",
    description: "Create wireframes and simple prototypes for apps."
  },
  {
    id: 3,
    title: "Data Intern",
    company: "MetricFlow",
    location: "On-site",
    stipend: "$1,200/mo",
    duration: "6 Months",
    description: "Work with spreadsheets, basic SQL, and charts."
  },
  {
    id: 4,
    title: "Marketing Intern",
    company: "LaunchPad",
    location: "Remote",
    stipend: "$700/mo",
    duration: "3 Months",
    description: "Help manage social posts and track campaign clicks."
  }
];

let applications = [];

function showExplore() {
  document.getElementById("explore-section").classList.remove("hidden");
  document.getElementById("tracker-section").classList.add("hidden");
  document.getElementById("explore-btn").classList.add("active");
  document.getElementById("tracker-btn").classList.remove("active");
}

function showTracker() {
  document.getElementById("explore-section").classList.add("hidden");
  document.getElementById("tracker-section").classList.remove("hidden");
  document.getElementById("explore-btn").classList.remove("active");
  document.getElementById("tracker-btn").classList.add("active");
  renderApplications();
}

function hasApplied(id) {
  for (let i = 0; i < applications.length; i++) {
    if (applications[i].internshipId === id) {
      return true;
    }
  }
  return false;
}

function renderInternships(list) {
  const container = document.getElementById("internship-list");
  container.innerHTML = "";

  if (list.length === 0) {
    container.innerHTML = "<p>No internships found.</p>";
    return;
  }

  for (let i = 0; i < list.length; i++) {
    const item = list[i];
    const applied = hasApplied(item.id);
    const btnText = applied ? "Applied" : "Apply";
    const disabledAttr = applied ? "disabled" : "";

    container.innerHTML += `
      <div class="card">
        <h3>${item.title}</h3>
        <p class="company">${item.company}</p>
        <p class="meta">${item.location} | ${item.stipend} | ${item.duration}</p>
        <p>${item.description}</p>
        <button class="btn secondary" onclick="viewDetails(${item.id})">Details</button>
        <button class="btn" ${disabledAttr} onclick="openApply(${item.id})">${btnText}</button>
      </div>
    `;
  }
}

function filterInternships() {
  const search = document.getElementById("search-box").value.toLowerCase();
  const location = document.getElementById("location-select").value;
  const filtered = [];

  for (let i = 0; i < internships.length; i++) {
    const item = internships[i];
    const matchText =
      item.title.toLowerCase().includes(search) ||
      item.company.toLowerCase().includes(search);
    const matchLocation = location === "All" || item.location === location;

    if (matchText && matchLocation) {
      filtered.push(item);
    }
  }

  renderInternships(filtered);
}

function viewDetails(id) {
  let selected = null;
  for (let i = 0; i < internships.length; i++) {
    if (internships[i].id === id) {
      selected = internships[i];
    }
  }
  if (!selected) return;

  document.getElementById("detail-title").innerText = selected.title;
  document.getElementById("detail-company").innerText = selected.company;
  document.getElementById("detail-info").innerText =
    selected.location + " - " + selected.stipend + " - " + selected.duration;
  document.getElementById("detail-desc").innerText = selected.description;

  const applyBtn = document.getElementById("detail-apply-btn");
  applyBtn.disabled = hasApplied(selected.id);
  applyBtn.innerText = hasApplied(selected.id) ? "Already Applied" : "Apply Now";
  applyBtn.onclick = function () {
    openApply(selected.id);
  };

  document.getElementById("details-box").classList.remove("hidden");
}

function closeDetails() {
  document.getElementById("details-box").classList.add("hidden");
}

function openApply(id) {
  let selected = null;
  for (let i = 0; i < internships.length; i++) {
    if (internships[i].id === id) {
      selected = internships[i];
    }
  }
  if (!selected || hasApplied(id)) return;

  closeDetails();
  document.getElementById("apply-id").value = selected.id;
  document.getElementById("apply-title").innerText = "Apply: " + selected.title;
  document.getElementById("apply-box").classList.remove("hidden");
}

function closeApply() {
  document.getElementById("apply-box").classList.add("hidden");
}

function submitApplication(event) {
  event.preventDefault();

  const id = Number(document.getElementById("apply-id").value);
  const name = document.getElementById("student-name").value;
  const email = document.getElementById("student-email").value;
  const college = document.getElementById("student-college").value;
  const note = document.getElementById("student-note").value;

  let roleTitle = "";
  let companyName = "";
  for (let i = 0; i < internships.length; i++) {
    if (internships[i].id === id) {
      roleTitle = internships[i].title;
      companyName = internships[i].company;
    }
  }

  applications.push({
    internshipId: id,
    role: roleTitle,
    company: companyName,
    studentName: name,
    email: email,
    college: college,
    note: note,
    status: "Applied"
  });

  document.getElementById("app-count").innerText = applications.length;
  event.target.reset();
  closeApply();
  filterInternships();
  renderApplications();
}

function renderApplications() {
  const container = document.getElementById("applications-list");
  container.innerHTML = "";

  if (applications.length === 0) {
    container.innerHTML = "<p>No applications submitted yet.</p>";
    return;
  }

  for (let i = 0; i < applications.length; i++) {
    const app = applications[i];
    container.innerHTML += `
      <div class="app-item">
        <div>
          <h3>${app.role} - ${app.company}</h3>
          <p>Applicant: ${app.studentName} (${app.college})</p>
        </div>
        <div>
          <span class="status">${app.status}</span>
          <button class="btn secondary" onclick="changeStatus(${i})">Next Status</button>
          <button class="btn danger" onclick="removeApplication(${i})">Withdraw</button>
        </div>
      </div>
    `;
  }
}

function changeStatus(index) {
  const statuses = ["Applied", "Under Review", "Interview"];
  const current = applications[index].status;

  if (current === statuses[0]) {
    applications[index].status = statuses[1];
  } else if (current === statuses[1]) {
    applications[index].status = statuses[2];
  } else {
    applications[index].status = statuses[0];
  }

  renderApplications();
}

function removeApplication(index) {
  applications.splice(index, 1);
  document.getElementById("app-count").innerText = applications.length;
  renderApplications();
  filterInternships();
}

renderInternships(internships);
