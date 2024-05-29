import { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [solarSavings, setSolarSavings] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const username = "pvserver";
    const password = "pvwr";
    const url = process.env.REACT_APP_SER_NR;
    console.log(url);

    const fetchData = async () => {
      try {
        const response = await axios({
          method: "get",
          url: `http://${url}/`, // Replace with the actual API endpoint
          auth: {
            username: username,
            password: password,
          },
          withCredentials: true, // If you need to send cookies or other credentials
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        });
        console.log(response);
        const parser = new DOMParser();
        const doc = parser.parseFromString(response.data, "text/html");
        const aktuellTd = Array.from(doc.querySelectorAll("td")).find(
          (td) => td.textContent.trim() === "aktuell"
        );
        if (aktuellTd) {
          const valueTd = aktuellTd.nextElementSibling;
          const value = valueTd.textContent.trim();
          setSolarSavings(value);
        } else {
          setError("Could not find the 'aktuell' value in the response.");
        }
      } catch (error) {
        console.error("There was an error fetching the data!", error);
        setError("Could not fetch data.");
      }
    };

    fetchData();
  }, []);

  return (
    <div className="App">
      <h1>Datenübersicht Haus Hall</h1>
      <h3>Aktuelle Solareinsparung:</h3>
      {error ? (
        <p>{error}</p>
      ) : (
        <p>{solarSavings !== null ? `${solarSavings} W` : "Loading..."}</p>
      )}
    </div>
  );
}

export default App;
