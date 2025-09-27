//Screen
const app = Vue.createApp({
  data() {
    return {
      screenWidth: window.innerWidth
    };
  },
  mounted() {
    window.addEventListener('resize', () => {
      this.screenWidth = window.innerWidth;
    });
  },
});
app.mount('#app');

// Patients
let patients = [];

async function fetchPatients() {
  try {
    const res = await fetch('http://localhost:3000/api/patients');
    const data = await res.json();
    console.log("Fetched patients:", data);
    patients = data;
  } catch (error) {
    console.warn("API fetch failed, using hardcoded patient");

    patients = [
      {
        id: 4,
        name: "Jessica Taylor",
        gender: "Female",
        age: 28,
        dob: "1996-08-23",
        contact: "(415) 555-1234",
        emergency_contact: "(415) 555-5678",
        insurance: "Sunrise Health Assurance",
        image: "assets/Layer 2.png",
        image2: "assets/Layer 2-1@2x.png",
        menu_icon: "assets/more_horiz_FILL0_wght300_GRAD0_opsz24.svg",
        vitals: [
          { type: "Respiratory Rate", value: 20, unit: "bpm", status: "Slightly Elevated" },
          { type: "Temperature", value: 98.6, unit: "°F", status: "Normal" },
          { type: "Heart Rate", value: 78, unit: "bpm", status: "Elevated" }
        ],
        lab_results: [
          { name: "Blood Tests", icon: "assets/download_FILL0_wght300_GRAD0_opsz24 (1).svg", highlighted: false },
          { name: "CT Scans", icon: "assets/download_FILL0_wght300_GRAD0_opsz24 (1).svg", highlighted: true },
          { name: "Radiology Reports", icon: "assets/download_FILL0_wght300_GRAD0_opsz24 (1).svg", highlighted: false },
          { name: "X-Rays", icon: "assets/download_FILL0_wght300_GRAD0_opsz24 (1).svg", highlighted: false },
          { name: "Urine Test", icon: "assets/download_FILL0_wght300_GRAD0_opsz24 (1).svg", highlighted: false },
          { name: "Blood Tests", icon: "assets/download_FILL0_wght300_GRAD0_opsz24 (1).svg", highlighted: false },
          { name: "CT Scans", icon: "assets/download_FILL0_wght300_GRAD0_opsz24 (1).svg", highlighted: true }
        ],
        diagnosis_list: [
          { problem: "Hypertension", description: "Chronic high blood pressure", status: "Under Observation" },
          { problem: "Type 2 Diabetes", description: "Insulin resistance and elevated blood sugar", status: "Cured" },
          { problem: "Asthma", description: "Recurrent episodes of bronchial constriction", status: "Inactive" },
          { problem: "Type 1 Diabetes", description: "Insulin resistance and elevated blood sugar", status: "Under Observation" },
          { problem: "Iron Deficiency", description: "Supplement intake and adjusting the diet", status: "Under Observation" },
          { problem: "Hypertension", description: "Chronic high blood pressure", status: "Under Observation" },
          { problem: "Type 2 Diabetes", description: "Insulin resistance and elevated blood sugar", status: "Cured" },
          { problem: "Asthma", description: "Recurrent episodes of bronchial constriction", status: "Inactive" },
          { problem: "Type 1 Diabetes", description: "Insulin resistance and elevated blood sugar", status: "Under Observation" }
        ]
      }
    ];
  }

  renderPatients();

  if (patients.length > 0) {
    const fullPatient = patients[0];
    renderPatientDetails(fullPatient);
    renderLabResults(fullPatient);
    renderDiagnosisList(fullPatient);
    renderVitals(fullPatient);

    const bpData = [
      { date: "2023-10-01", systolic: 120, diastolic: 80 },
      { date: "2023-11-01", systolic: 130, diastolic: 90 },
      { date: "2023-12-01", systolic: 160, diastolic: 100 },
      { date: "2024-01-01", systolic: 140, diastolic: 80 },
      { date: "2024-02-01", systolic: 160, diastolic: 70 },
      { date: "2024-03-01", systolic: 160, diastolic: 78 }
    ];
    renderBloodPressureChart(bpData);
  }
}

// Patients List
function renderPatients() {
  const container = document.querySelector(".patient-list");
  container.innerHTML = ""; // Clear existing content

  patients.forEach((patient) => {
    const card = document.createElement("div");
    card.className = "patient-card";
    card.innerHTML = `
      <img src="${patient.image}" alt="${patient.name}" class="patient-avatar" />
      <div class="patient-info">
        <span class="patient-name">${patient.name}</span>
        <span class="patient-details">${patient.gender}, ${patient.age}</span>
      </div>
      <img src="assets/more_horiz_FILL0_wght300_GRAD0_opsz24.svg" alt="Options" class="patient-menu" />
    `;

    card.addEventListener("click", async () => {
      console.log("Patient clicked:", patient.id);
      console.log("Rendering patient details");

      const res = await fetch(`http://localhost:3000/api/patient/${patient.id}`);
      const fullPatient = await res.json();

      renderPatientDetails(fullPatient);
      renderLabResults(fullPatient);
      renderDiagnosisList(fullPatient);
      renderVitals(fullPatient);

      const bpRes = await fetch(`http://localhost:3000/api/patient/${patient.id}/blood-pressure`);
      const bpData = await bpRes.json();
      console.log("Blood pressure data:", bpData);
      renderBloodPressureChart(bpData);
    });

    container.appendChild(card);
  });
}

// Call on page load
document.addEventListener("DOMContentLoaded", () => {
  fetchPatients();
  });

document.addEventListener("DOMContentLoaded", () => {
  const canvas = document.getElementById('bpChart');
  console.log("Canvas found:", canvas);
});

// Patients details
function renderPatientDetails(patient) {
  const container = document.querySelector(".right-panel-container");
  
  const dob = new Date(patient.dob).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric"
  });

  container.innerHTML = `
    <div class="patient-details-card">
      <img src="${patient.image2}" alt="${patient.name}" class="details-avatar" />
      <h3 class="details-name">${patient.name}</h3>
      <div class="details-info">
        <div class="info-row">
          <img src="assets/BirthIcon.svg" class="info-icon" />
          <div class="info-text">
            <span class="info-label">Date of Birth</span>
            <span class="info-value">${dob}</span>
          </div>
        </div>
        <div class="info-row">
          <img src="assets/FemaleIcon.svg" class="info-icon" />
          <div class="info-text">
            <span class="info-label">Gender</span>
            <span class="info-value">${patient.gender}</span>
          </div>
        </div>
        <div class="info-row">
          <img src="assets/PhoneIcon.svg" class="info-icon" />
          <div class="info-text">
            <span class="info-label">Contact Info</span>
            <span class="info-value">${patient.contact}</span>
          </div>
        </div>
        <div class="info-row">
          <img src="assets/PhoneIcon.svg" class="info-icon" />
          <div class="info-text">
            <span class="info-label">Emergency Contact</span>
            <span class="info-value">${patient.emergency_contact}</span>
          </div>
        </div>
        <div class="info-row">
          <img src="assets/InsuranceIcon.svg" class="info-icon" />
          <div class="info-text">
            <span class="info-label">Insurance Provider</span>
            <span class="info-value">${patient.insurance}</span>
          </div>
        </div>
      </div>
      <button class="details-button">Show All Information</button>
    </div>
  `;
}

// Lab results details

function renderLabResults(patient) {
  const list = document.querySelector(".lab-results-list");
  list.innerHTML = ""; // Clear previous items

  if (!patient.lab_results) return;

  patient.lab_results.forEach((result) => {
    const item = document.createElement("div");
    item.className = "lab-result-item";
    if (result.highlighted) item.classList.add("highlighted");

    item.innerHTML = `
      <span class="lab-result-name">${result.name}</span>
      <img src="${result.icon}" alt="Download ${result.name}" class="lab-result-icon" />
    `;
    list.appendChild(item);
  });
}

// Diagnosis List
function renderDiagnosisList(patient) {
  const tableBody = document.querySelector(".diagnosis-table tbody");
  if (!tableBody) {
    console.warn("Diagnosis table body not found");
    return;
  }
  

  tableBody.innerHTML = "";

  if (!patient.diagnosis_list || !Array.isArray(patient.diagnosis_list)) {
    console.warn("No diagnosis list found for patient:", patient.name);
    return;
  }

  patient.diagnosis_list.forEach((entry) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${entry.problem}</td>
      <td>${entry.description}</td>
      <td>${entry.status}</td>
    `;
    tableBody.appendChild(row);
  });

  console.log("Diagnosis list injected for:", patient.name);
}

// Diagnosis History

function renderVitals(patient) {
  // document.querySelector(".blood-pressure-container").innerHTML = "";
  document.querySelector(".respiratory-rate-container .vital-data")?.remove();
  document.querySelector(".temperature-container .vital-data")?.remove();
  document.querySelector(".heart-rate-container .vital-data")?.remove();

  if (!patient.vitals || !Array.isArray(patient.vitals)) return;

  const respiratoryRate = patient.vitals.find(v => v.type === "Respiratory Rate");
  const temperature = patient.vitals.find(v => v.type === "Temperature");
  const heartRate = patient.vitals.find(v => v.type === "Heart Rate");

  function injectVital(containerSelector, value, unit, status) {
    const container = document.querySelector(containerSelector);
    if (!container || value === undefined) return;

    const oldData = container.querySelector(".vital-data");
    if (oldData) oldData.remove();

    const dataBlock = document.createElement("div");
    dataBlock.className = "vital-data";
    dataBlock.innerHTML = `
      <p class="vital-value">${value} ${unit}</p>
      <span class="vital-status">${status}</span>
    `;
    container.appendChild(dataBlock);
  }

  injectVital(".respiratory-rate-container", respiratoryRate?.value, respiratoryRate?.unit, respiratoryRate?.status);
  injectVital(".temperature-container", temperature?.value, temperature?.unit, temperature?.status);
  injectVital(".heart-rate-container", heartRate?.value, heartRate?.unit, heartRate?.status);

  console.log("Vitals received:", patient.vitals);
}

//Blood pressure Charts
function renderBloodPressureChart(bpData) {
  const labels = bpData.map(entry =>
    new Date(entry.date).toLocaleString('default', { month: 'short', year: 'numeric' })
  );
  const systolic = bpData.map(entry => entry.systolic);
  const diastolic = bpData.map(entry => entry.diastolic);

  const canvas = document.getElementById('bpChart');
  console.log("Canvas element:", canvas);

  if (!canvas) {
    console.warn("Canvas element not found");
    return;
  }

  const ctx = canvas.getContext('2d');
  if (!ctx) {
    console.warn("Canvas context not found");
    return;
  }

  console.log("Chart function triggered with:", bpData);

  if (window.bpChartInstance) {
    window.bpChartInstance.destroy();
  }

  window.bpChartInstance = new Chart(ctx, {
    type: 'line',
    data: {
      labels,
      datasets: [
        {
          data: systolic,
          borderColor: '#C26EB4',
          pointBackgroundColor: '#E66FD2',
          pointRadius: 6,
          fill: false,
          tension: 0.4
        },
        {
          data: diastolic,
          borderColor: '#7E6CAB',
          pointBackgroundColor: '#8C6FE6',
          pointRadius: 6,
          fill: false,
          tension: 0.4
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: {
          min: 60,
          max: 180,
          title: {
            display: true,
          },
          ticks: {
            stepSize: 20
          }
        },
        x: {
          title: {
            display: true,
          },
          grid: {
            display: false
          }
        }
      },
      plugins: {
        legend: {
          display: false
        }
      }
    }
  });
  // Inject latest values and status
  const latest = bpData[bpData.length - 1];
  const latestSystolic = latest.systolic;
  const latestDiastolic = latest.diastolic;

  const systolicStatus = latestSystolic > 140 ? 'Higher than Average' :
                         latestSystolic < 110 ? 'Lower than Average' : 'Normal';

  const diastolicStatus = latestDiastolic > 90 ? 'Higher than Average' :
                          latestDiastolic < 70 ? 'Lower than Average' : 'Normal';

  // Systolic
  document.getElementById('systolicArrow').textContent =
    latestSystolic > 140 ? '▲' :
    latestSystolic < 110 ? '▼' : '–';

  document.querySelector('#systolicStatus .status-text').textContent = systolicStatus;

  // Diastolic
  document.getElementById('diastolicArrow').textContent =
    latestDiastolic > 90 ? '▲' :
    latestDiastolic < 70 ? '▼' : '–';

  document.querySelector('#diastolicStatus .status-text').textContent = diastolicStatus;

  document.getElementById('systolicValue').textContent = `${latestSystolic}`;
  document.getElementById('diastolicValue').textContent = `${latestDiastolic}`;

  //document.getElementById('systolicStatus').textContent = systolicStatus;
  //document.getElementById('diastolicStatus').textContent = diastolicStatus;

  document.getElementById('systolicStatus').className = 'status ' + (
    latestSystolic > 140 ? 'high' : latestSystolic < 110 ? 'low' : 'normal'
  );

  document.getElementById('diastolicStatus').className = 'status ' + (
    latestDiastolic > 90 ? 'high' : latestDiastolic < 70 ? 'low' : 'normal'
  );

}



