import { useEffect, useState } from "react";
import axios from "axios"


function App() {

  const[baslik, setBaslik] =  useState("")
  const[bool, setBool] =  useState(false)
  const[todos, setTodos] =  useState([])
  const[loading, setLoading] = useState(false)
  const[error, setError] = useState("")

  async function newTodo(){
    if (baslik.trim() === "") return;

    try {
      setError("")
      await axios.post("http://192.168.1.50:8000/todos", {
        "title": baslik.trim(),
        "state": bool
      })
      setBaslik("")
      setBool(false)
      getData()
    } catch (requestError) {
      setError("Todo eklenemedi. Baglanti veya CORS ayarini kontrol et.")
      console.log(requestError)
    }
  }

  async function getData(){
    try {
      setLoading(true)
      setError("")
      const res = await axios.get("http://192.168.1.50:8000/todos")
      setTodos(res.data)
    } catch (requestError) {
      setError("Veriler alinamadi. API adresini ve backend durumunu kontrol et.")
      console.log(requestError)
    } finally {
      setLoading(false)
    }
  }

  useEffect(
    () => {getData()} , []
  )

  return (
    <div className="page">
      <div className="orb orb-one"></div>
      <div className="orb orb-two"></div>

      <main className="todo-shell">
        <header className="todo-header">
          <p className="eyebrow">FastAPI + React</p>
          <h1>Todo Studio</h1>
          <p>Gorevlerini hizli ekle, tamamlananlari aninda gor ve listeni temiz bir arayuzde yonet.</p>
        </header>

        <section className="creator-card">
          <label htmlFor="todo-input">Yeni gorev</label>
          <input
            id="todo-input"
            type="text"
            placeholder="Ornek: FastAPI endpoint test et"
            value={baslik}
            onChange={(e)=> setBaslik(e.target.value)}
          ></input>

          <label className="checkbox-row">
            <input
              type="checkbox"
              checked={bool}
              onChange={(e)=> setBool(e.target.checked)}
            ></input>
            <span>Tamamlandi olarak ekle</span>
          </label>

          <button onClick={newTodo}>Olustur</button>
          <p className="preview-text">Anlik deger: {baslik || "-"} / {String(bool)}</p>
        </section>

        {error && <p className="error-text">{error}</p>}

        <section className="list-card">
          <div className="list-head">
            <h2>Gorev Listesi</h2>
            <span className="count-pill">{todos.length} kayit</span>
          </div>

          {loading && <p className="loading-state">Yukleniyor...</p>}

          {!loading && todos.length === 0 && (
            <p className="empty-state">Henuz bir gorev yok. Ilk kaydi olustur.</p>
          )}

          {!loading && todos.length > 0 && (
            <ul className="todo-list">
              {todos.map((item, index) => (
                <li key={item.id ?? `${item.title}-${index}`} className={`todo-item ${item.state ? "done" : ""}`}>
                  <span className="todo-title">{item.title}</span>
                  <span className={`todo-badge ${item.state ? "done" : "open"}`}>
                    {item.state ? "Tamam" : "Acik"}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </section>
      </main>
    </div>

  );
}

export default App;
