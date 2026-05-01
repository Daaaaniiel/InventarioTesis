import { useEffect } from "react";
import { useParams } from "react-router-dom";

export default function Verify() {
  const { token } = useParams();

  useEffect(() => {
    fetch(`http://localhost:3000/api/auth/verify/${token}`)
      .then(res => res.json())
      .then(data => {
        alert(data.message || data.error);
      });
  }, []);

  return <h2>Verificando cuenta...</h2>;
}