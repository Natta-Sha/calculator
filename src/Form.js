import React, { useState } from "react";

function Form() {
  const [word, setWord] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("/add-word", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ word }),
      });

      if (response.ok) {
        alert("Слово успешно добавлено в таблицу!");
        setWord("");
      } else {
        alert("Ошибка при добавлении слова!");
      }
    } catch (error) {
      console.error("Ошибка при отправке:", error);
      alert("Ошибка сети!");
    }
  };

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4">Введите слово</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <input
            type="text"
            className="form-control"
            value={word}
            onChange={(e) => setWord(e.target.value)}
            placeholder="Введите слово"
          />
        </div>
        <div className="text-center">
          <button type="submit" className="btn btn-primary">
            Отправить
          </button>
        </div>
      </form>
    </div>
  );
}

export default Form;
