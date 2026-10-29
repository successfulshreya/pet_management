
import { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

const API_URL = "http://localhost:5000/pets";

function App() {
  const [name, setName] = useState("");
  const [type, setType] = useState("Dog");
  const [age, setAge] = useState("");
  const [pets, setPets] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Backend se pets fetch karna
  async function fetchPets() {
    try {
      setError("");
      const response = await axios.get(API_URL);
      setPets(response.data);
    } catch (err) {
      console.error(err);
      setError("Pets load nahi hue. Backend check karo.");
    }
  }

  // Page open hone par pets load honge
  useEffect(() => {
  let ignore = false;

  async function loadPets() {
    try {
      const response = await axios.get(API_URL);

      if (!ignore) {
        setPets(response.data);
      }
    } catch (err) {
      if (!ignore) {
        setError("Pets load nahi hue. Backend check karo.");
      }

      console.error(err);
    }
  }

  loadPets();

  return () => {
    ignore = true;
  };
}, []);

  // Naya pet add karna
  async function handleAddPet(event) {
    event.preventDefault();

    if (!name.trim() || age === "" || Number(age) < 0) {
      setError("Pet ka valid name aur age enter karo.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      await axios.post(API_URL, {
        name: name.trim(),
        type: type,
        age: Number(age),
      });

      setName("");
      setType("Dog");
      setAge("");

      await fetchPets();
    } catch (err) {
      console.error(err);
      setError("Pet add nahi hua. Backend check karo.");
    } finally {
      setLoading(false);
    }
  }

  // Pet delete karna
  async function handleDeletePet(id) {
    try {
      setError("");

      await axios.delete(`${API_URL}/${id}`);

      setPets((currentPets) =>
        currentPets.filter((pet) => pet._id !== id)
      );
    } catch (err) {
      console.error(err);
      setError("Pet delete nahi hua.");
    }
  }

  return (
    <div className="app">
      <header className="header">
        <h1>🐾 PawCare</h1>
        <p>Your Pet Management System</p>
      </header>

      <main className="container">
        <section className="form-card">
          <h2>Add a New Pet</h2>

          <form onSubmit={handleAddPet}>
            <label htmlFor="name">Pet Name</label>
            <input
              id="name"
              type="text"
              placeholder="Enter pet name"
              value={name}
              onChange={(event) => setName(event.target.value)}
              required
            />

            <label htmlFor="type">Pet Type</label>
            <select
              id="type"
              value={type}
              onChange={(event) => setType(event.target.value)}
            >
              <option value="Dog">Dog</option>
              <option value="Cat">Cat</option>
              <option value="Bird">Bird</option>
              <option value="Other">Other</option>
            </select>

            <label htmlFor="age">Pet Age</label>
            <input
              id="age"
              type="number"
              min="0"
              step="1"
              placeholder="Enter age"
              value={age}
              onChange={(event) => setAge(event.target.value)}
              required
            />

            <button type="submit" disabled={loading}>
              {loading ? "Adding..." : "Add Pet"}
            </button>
          </form>

          {error && <p className="error">{error}</p>}
        </section>

        <section className="pets-section">
          <h2>Our Pets ({pets.length})</h2>

          {pets.length === 0 ? (
            <p className="empty">No pets found. Add your first pet!</p>
          ) : (
            <div className="pet-grid">
              {pets.map((pet) => (
                <article className="pet-card" key={pet._id}>
                  <div className="pet-icon">
                    {pet.type === "Cat"
                      ? "🐱"
                      : pet.type === "Bird"
                      ? "🐦"
                      : "🐶"}
                  </div>

                  <h3>{pet.name}</h3>
                  <p>Type: {pet.type}</p>
                  <p>Age: {pet.age} years</p>

                  <button
                    className="delete-btn"
                    onClick={() => handleDeletePet(pet._id)}
                  >
                    Delete
                  </button>
                </article>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default App;
