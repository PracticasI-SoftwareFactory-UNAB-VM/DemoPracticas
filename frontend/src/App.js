import React, { useEffect, useState } from "react";
import {
  createUserStory,
  deleteUserStory,
  getUserStories,
  updateUserStory,
} from "./api";
import "./App.css";

const MOSCOW_OPTIONS = [
  { value: "MUST", label: "Must (imprescindible)" },
  { value: "SHOULD", label: "Should (importante)" },
  { value: "COULD", label: "Could (deseable)" },
  { value: "WONT", label: "Won't (no por ahora)" },
];

function App() {
  const [stories, setStories] = useState([]);
  const [role, setRole] = useState("");
  const [want, setWant] = useState("");
  const [benefit, setBenefit] = useState("");
  const [criteriaText, setCriteriaText] = useState("");
  const [moscow, setMoscow] = useState("MUST");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const loadStories = async () => {
    try {
      const data = await getUserStories();
      setStories(data);
      setError("");
    } catch (err) {
      setError(
        "No se pudo conectar con el backend. ¿Está corriendo docker compose?"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStories();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!role.trim() || !want.trim() || !benefit.trim()) return;

    const acceptance_criteria = criteriaText
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean);

    await createUserStory({ role, want, benefit, acceptance_criteria, moscow });
    setRole("");
    setWant("");
    setBenefit("");
    setCriteriaText("");
    setMoscow("MUST");
    loadStories();
  };

  const toggleCompleted = async (story) => {
    await updateUserStory(story.id, { completed: !story.completed });
    loadStories();
  };

  const handleDelete = async (id) => {
    await deleteUserStory(id);
    loadStories();
  };

  return (
    <div className="app">
      <header>
        <h1>📝 Historias de Usuario</h1>
        <p className="stack">React &bull; FastAPI &bull; MySQL &bull; Docker</p>
      </header>

      <form className="story-form" onSubmit={handleSubmit}>
        <label>
          Como
          <input
            type="text"
            placeholder="ej. estudiante"
            value={role}
            onChange={(e) => setRole(e.target.value)}
          />
        </label>
        <label>
          Quiero
          <input
            type="text"
            placeholder="ej. ver mis calificaciones"
            value={want}
            onChange={(e) => setWant(e.target.value)}
          />
        </label>
        <label>
          Para qué
          <input
            type="text"
            placeholder="ej. hacer seguimiento a mi progreso"
            value={benefit}
            onChange={(e) => setBenefit(e.target.value)}
          />
        </label>
        <label>
          Criterios de aceptación (uno por línea)
          <textarea
            rows={3}
            placeholder={"Dado que...\nCuando...\nEntonces..."}
            value={criteriaText}
            onChange={(e) => setCriteriaText(e.target.value)}
          />
        </label>
        <label>
          Prioridad MoSCoW
          <select value={moscow} onChange={(e) => setMoscow(e.target.value)}>
            {MOSCOW_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </label>
        <button type="submit">Agregar historia</button>
      </form>

      {error && <p className="error">{error}</p>}
      {loading && <p>Cargando historias...</p>}

      <ul className="story-list">
        {stories.map((story) => (
          <li key={story.id} className={story.completed ? "done" : ""}>
            <div className="story-header">
              <label className="story-checkbox">
                <input
                  type="checkbox"
                  checked={story.completed}
                  onChange={() => toggleCompleted(story)}
                />
                <span className={`badge badge-${story.moscow.toLowerCase()}`}>
                  {story.moscow}
                </span>
              </label>
              <button
                className="delete-btn"
                onClick={() => handleDelete(story.id)}
              >
                Eliminar
              </button>
            </div>

            <p className="story-sentence">
              <strong>Como</strong> {story.role}, <strong>quiero</strong>{" "}
              {story.want} <strong>para</strong> {story.benefit}.
            </p>

            {story.acceptance_criteria.length > 0 && (
              <div className="criteria">
                <span className="criteria-label">
                  Criterios de aceptación:
                </span>
                <ul>
                  {story.acceptance_criteria.map((criterion, idx) => (
                    <li key={idx}>{criterion}</li>
                  ))}
                </ul>
              </div>
            )}
          </li>
        ))}
      </ul>

      {!loading && !error && stories.length === 0 && (
        <p className="empty">No hay historias todavía. ¡Agrega la primera!</p>
      )}
    </div>
  );
}

export default App;
