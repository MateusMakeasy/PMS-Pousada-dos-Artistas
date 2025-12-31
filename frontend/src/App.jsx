import { useEffect, useState } from 'react';
import './App.css'
import { db } from './firebase';
import { 
  collection, 
  addDoc, 
  getDocs, 
  serverTimestamp, 
  query, 
  orderBy 
} from 'firebase/firestore';

function App() {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Estado para o formulário
  const [formData, setFormData] = useState({
    guestName: '',
    checkinDate: '',
    checkoutDate: '',
    numberOfGuests: 1,
    totalValue: '',
    origin: 'balcao',
    status: 'confirmed'
  });

  const fetchReservations = async () => {
    setLoading(true);
    try {
      const q = query(collection(db, "reservations"), orderBy("createdAt", "desc"));
      const querySnapshot = await getDocs(q);
      const resList = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setReservations(resList);
    } catch (e) {
      console.error("Erro ao buscar reservas: ", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReservations();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, "reservations"), {
        ...formData,
        totalValue: Number(formData.totalValue),
        numberOfGuests: Number(formData.numberOfGuests),
        checkinDate: new Date(formData.checkinDate),
        checkoutDate: new Date(formData.checkoutDate),
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      
      // Limpar formulário
      setFormData({
        guestName: '',
        checkinDate: '',
        checkoutDate: '',
        numberOfGuests: 1,
        totalValue: '',
        origin: 'balcao',
        status: 'confirmed'
      });
      
      fetchReservations();
      alert("Reserva criada com sucesso!");
    } catch (e) {
      console.error("Erro ao adicionar reserva: ", e);
      alert("Erro ao criar reserva.");
    }
  };

  return (
    <div className="App">
      <h1>PMS Pousada dos Artistas</h1>
      
      <section>
        <h2>Cadastrar Nova Reserva</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Nome do Hóspede:</label>
            <input 
              type="text" 
              name="guestName" 
              value={formData.guestName} 
              onChange={handleInputChange} 
              required 
            />
          </div>

          <div className="form-group">
            <label>Check-in:</label>
            <input 
              type="date" 
              name="checkinDate" 
              value={formData.checkinDate} 
              onChange={handleInputChange} 
              required 
            />
          </div>

          <div className="form-group">
            <label>Check-out:</label>
            <input 
              type="date" 
              name="checkoutDate" 
              value={formData.checkoutDate} 
              onChange={handleInputChange} 
              required 
            />
          </div>

          <div className="form-group">
            <label>Número de Hóspedes:</label>
            <input 
              type="number" 
              name="numberOfGuests" 
              value={formData.numberOfGuests} 
              onChange={handleInputChange} 
              min="1"
              required 
            />
          </div>

          <div className="form-group">
            <label>Valor Total (R$):</label>
            <input 
              type="number" 
              name="totalValue" 
              value={formData.totalValue} 
              onChange={handleInputChange} 
              step="0.01"
              required 
            />
          </div>

          <div className="form-group">
            <label>Origem:</label>
            <select name="origin" value={formData.origin} onChange={handleInputChange}>
              <option value="balcao">Balcão</option>
              <option value="booking">Booking</option>
              <option value="airbnb">Airbnb</option>
              <option value="hbook">HBook</option>
            </select>
          </div>

          <button type="submit">Salvar Reserva</button>
        </form>
      </section>

      <section>
        <h2>Reservas Recentes</h2>
        {loading ? (
          <p>Carregando...</p>
        ) : (
          <div className="reservation-list">
            {reservations.map(res => (
              <div key={res.id} className="reservation-item">
                <strong>{res.guestName}</strong>
                <span>R$ {res.totalValue}</span> | 
                <span className={`status-badge status-${res.status}`}> {res.status}</span>
                <p>
                  Check-in: {res.checkinDate?.toDate ? res.checkinDate.toDate().toLocaleDateString() : new Date(res.checkinDate).toLocaleDateString()} <br/>
                  Check-out: {res.checkoutDate?.toDate ? res.checkoutDate.toDate().toLocaleDateString() : new Date(res.checkoutDate).toLocaleDateString()}
                </p>
                <small>Origem: {res.origin} | ID: {res.id}</small>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}

export default App
