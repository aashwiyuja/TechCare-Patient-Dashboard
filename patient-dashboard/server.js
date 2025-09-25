const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();
app.use(cors());

const pool = new Pool({
  connectionString: 'postgres://postgres:postgres@localhost:5432/health_dashboard'
});

// Route to get all patients (basic info for sidebar)
app.get('/api/patients', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT id, name, gender, age, image FROM patients
    `);
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching patient list:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Route to get full patient profile by ID
app.get('/api/patient/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(`
      SELECT 
        p.id AS patient_id,
        p.name,
        p.gender,
        p.age,
        p.dob,
        p.contact,
        p.emergency_contact,
        p.insurance,
        p.image,
        p.image2,
        p.menu_icon,
        (
          SELECT json_agg(v) FROM (
            SELECT type, value, unit, status FROM vitals WHERE patient_id = p.id
          ) v
        ) AS vitals,
        (
          SELECT json_agg(l) FROM (
            SELECT name, icon, highlighted FROM lab_results WHERE patient_id = p.id
          ) l
        ) AS lab_results,
        (
          SELECT json_agg(d) FROM (
            SELECT problem, description, status FROM diagnosis_list WHERE patient_id = p.id
          ) d
        ) AS diagnosis_list
      FROM patients p
      WHERE p.id = $1
    `, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Patient not found' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error fetching patient data:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

//Route to get the patients blood pressure details
app.get('/api/patient/:id/blood-pressure', async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(`
      SELECT month, systolic, diastolic
      FROM blood_pressure
      WHERE patient_id = $1
      ORDER BY month ASC
    `, [id]);

    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching blood pressure data:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.listen(3000, () => {
  console.log('API server running at http://localhost:3000');
});