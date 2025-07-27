import { useEffect, useState } from "react";
import axios from "axios";
import ZakazCard from "../components/ZakazCard";



const BugungiZakazlar = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");

    axios
      .get("api/scheduled-orders/today", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        setOrders(res.data);
      })
      .catch((err) => {
        console.error("Bugungi zakazlarni olishda xatolik:", err);
      });
  }, []);

  return (
    
     
      <div>
        <h2>📅 Bugungi Zakazlar</h2>
        {orders.map((zakaz) => (
          <ZakazCard key={zakaz.id} zakaz={zakaz} />
        ))}
      </div>
    
  );
};

export default BugungiZakazlar;
