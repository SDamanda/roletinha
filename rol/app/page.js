"use client";
import { useState, useRef, useEffect } from "react";
import styles from "./globals.module.css";

export default function Home() {
  const [opcao, setOpcao] = useState("");
  const [opcoes, setOpcoes] = useState([]);
  const [resultado, setResultado] = useState("");
  const canvasRef = useRef(null);

  const getColor = (i, total) => {
    const hue = (i * 360) / total; 
    return `hsl(${hue}, 70%, 50%)`;
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const numOpcoes = opcoes.length;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (numOpcoes === 0) return;

    const anguloPorOpcao = (2 * Math.PI) / numOpcoes;

    for (let i = 0; i < numOpcoes; i++) {
      ctx.beginPath();
      ctx.moveTo(150, 150);
      ctx.fillStyle = getColor(i, numOpcoes);
      ctx.arc(150, 150, 150, i * anguloPorOpcao, (i + 1) * anguloPorOpcao);
      ctx.fill();

      ctx.save();
      ctx.translate(150, 150);
      ctx.rotate(i * anguloPorOpcao + anguloPorOpcao / 2);
      ctx.textAlign = "right";
      ctx.fillStyle = "#fff";
      ctx.font = "16px Arial";
      ctx.fillText(opcoes[i], 140, 5);
      ctx.restore();
    }
  }, [opcoes]);

  const adicionarOpcao = () => {
    if (opcao.trim()) {
      setOpcoes([...opcoes, opcao.trim()]);
      setOpcao("");
    }
  };

  const girarRoleta = () => {
    if (opcoes.length === 0) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const numOpcoes = opcoes.length;
    const anguloPorOpcao = (2 * Math.PI) / numOpcoes;

    let anguloAtual = 0;
    let velocidade = Math.random() * 0.3 + 0.25;
    let desaceleracao = 0.002 + Math.random() * 0.003;

    function animar() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (let i = 0; i < numOpcoes; i++) {
        ctx.beginPath();
        ctx.moveTo(150, 150);
        ctx.fillStyle = getColor(i, numOpcoes);
        ctx.arc(150, 150, 150, anguloAtual + i * anguloPorOpcao, anguloAtual + (i + 1) * anguloPorOpcao);
        ctx.fill();

        ctx.save();
        ctx.translate(150, 150);
        ctx.rotate(anguloAtual + i * anguloPorOpcao + anguloPorOpcao / 2);
        ctx.textAlign = "right";
        ctx.fillStyle = "#fff";
        ctx.font = "16px Arial";
        ctx.fillText(opcoes[i], 140, 5);
        ctx.restore();
      }

      anguloAtual += velocidade;
      velocidade = Math.max(velocidade - desaceleracao, 0);

      if (velocidade > 0) {
        requestAnimationFrame(animar);
      } else {
        const index = Math.floor(((2 * Math.PI - (anguloAtual % (2 * Math.PI))) / anguloPorOpcao) % numOpcoes);
        setResultado(opcoes[index]);
      }
    }

    animar();
  };

  return (
    <div className={styles.container}>
      <h1>Roleta da Sorte</h1>
      <p>Adicione opções e gire a roleta</p>

      <div className={styles.inputGroup}>
        <input
          value={opcao}
          onChange={(e) => setOpcao(e.target.value)}
          placeholder="Digite uma opção"
        />
        <button className={styles.add} onClick={adicionarOpcao} >Adicionar</button>
      </div>

      <button className={styles.girar} onClick={girarRoleta}>
        Girar
      </button>

      <canvas ref={canvasRef} width={300} height={300} className={styles.canvas}></canvas>

      {resultado && <h2 className={styles.resultado}>🎉 {resultado}</h2>}
    </div>
  );
}
