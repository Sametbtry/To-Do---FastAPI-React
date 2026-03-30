import { useEffect, useState } from "react";
import axios from "axios"

// Backend API temel adresi.
const API_BASE = "http://localhost:8000";

function App() {

  // Form, liste, guncelleme ve hata durum state'leri.
  const[baslik, setBaslik] =  useState("")
  const[bool, setBool] =  useState(false)
  const[todos, setTodos] =  useState([])
  const[duzenleState, setDuzenleState] = useState({})
  const[hata, setHata] = useState("")

  // Yeni todo kaydi olusturur.
  async function newTodo(){
    if (baslik.trim() === "") return;
    try {
      await axios.post(`${API_BASE}/todos`, {
        "title": baslik.trim(),
        "state": bool
      });
      setBaslik("");
      setBool(false);
      setHata("");
      await getData();
    } catch {
      setHata("Todo olusturulamadi");
    }
  }

  // Tum todo verilerini backend'den alir.
  async function getData(){
    try {
      const res = await axios.get(`${API_BASE}/todos`);
      setTodos(res.data);

      const stateMap = {};

      res.data.forEach((item) => {
        if (item.id !== undefined && item.id !== null) {
          stateMap[item.id] = item.state;
        }
      });

      setDuzenleState(stateMap);
      setHata("");
    } catch {
      setHata("Todo listesi alinamadi");
    }
  }

  // Secilen todo kaydinin durum bilgisini gunceller.
  async function updateTodo(itemId, mevcutBaslik){
    if (itemId === undefined || itemId === null) return;

    const guncelState = duzenleState[itemId] ?? false;

    if ((mevcutBaslik ?? "").toString().trim() === "") {
      setHata("Baslik bos olamaz");
      return;
    }

    try {
      await axios.put(`${API_BASE}/todo-update/${itemId}`, {
        "title": mevcutBaslik,
        "state": guncelState
      });
      setHata("");
      await getData();
    } catch {
      setHata("Todo guncellenemedi");
    }
  }

  // Secilen todo kaydini siler.
  async function deleteTodo(itemId){
    if (itemId === undefined || itemId === null) return;

    try {
      await axios.delete(`${API_BASE}/todo-delete/${itemId}`);
      setHata("");
      await getData();
    } catch {
      setHata("Todo silinemedi");
    }
  }

  // Tum todo kayitlarini tek istekte siler.
  async function deleteAllTodos(){
    try {
      await axios.delete(`${API_BASE}/delete-all-data`);
      setHata("");
      await getData();
    } catch {
      setHata("Tum todolar silinemedi");
    }
  }

  // Component ilk acildiginda listeyi yukler.
  useEffect(
    () => {getData()} , []
  )

  // Tabloda gorunmesi icin kayitlari basliga gore siralar.
  const siraliTodos = [...todos].sort((a, b) => {
    const aTitle = (a.title ?? "").toString();
    const bTitle = (b.title ?? "").toString();

    return aTitle.localeCompare(bTitle, "tr");
  });

  return (
    <div className="App">
        {/* Todo olusturma alani */}
        <h1>Todo APP</h1>
        <label>todo olusuturucu</label>
        <input type="text" value={baslik} onChange={(e)=> setBaslik(e.target.value)}></input>
        <div className="create-actions">
          <input type="checkbox" checked={bool} onChange={(e)=> setBool(e.target.checked)}></input>
          <button onClick={newTodo}>olustur</button>
          <button className="delete-all-btn" onClick={deleteAllTodos}>tumunu sil</button>
        </div>

        {hata && <p>{hata}</p>}
        
        {/* Todo liste ve islem tablosu */}
        <div className="todo-table-wrap">
          <table className="todo-table">
            <thead>
              <tr>
                <th>sira</th>
                <th>baslik</th>
                <th>durum</th>
                <th>yeni durum</th>
                <th>islemler</th>
              </tr>
            </thead>
            <tbody>
              {todos.length === 0 ? (
                <tr>
                  <td colSpan="5">Kayit yok</td>
                </tr>
              ) : (
                siraliTodos.map((item, index) => (
                  <tr key={item.id ?? index}>
                    <td>{index + 1}</td>
                    <td>{item.title}</td>
                    <td>{String(item.state)}</td>
                    <td>
                      <input
                        type="checkbox"
                        checked={duzenleState[item.id] ?? false}
                        onChange={(e) => setDuzenleState((prev) => ({
                          ...prev,
                          [item.id]: e.target.checked
                        }))}
                      />
                    </td>
                    <td className="todo-actions">
                      <button onClick={() => updateTodo(item.id, item.title)}>guncelle</button>
                      <button onClick={() => deleteTodo(item.id)}>sil</button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
    </div>

  );
}

export default App;
