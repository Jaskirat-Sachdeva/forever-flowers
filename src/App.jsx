import { useEffect, useRef, useState } from "react";
import "./App.css";

const messages = [
  "I was going to just buy flowers, then I remembered I’m a nerd.",
  "You’ve become my favourite notification.",
  "Talking to you has genuinely made my days better.",
  "I like how easy it is to smile when I’m talking to you.",
  "You’re the kind of person who makes effort feel worth it.",
  "I’m really glad I met you.",
  "I can’t wait to make so many memories with you.",
  "I wanted you to have something that was yours, made just for you.",
];

const flowerField = [
  { type: "tulip", left: 7, scale: 0.78, delay: 0.1 },
  { type: "lily", left: 16, scale: 0.9, delay: 0.35 },
  { type: "tulip", left: 27, scale: 1.08, delay: 0.55 },
  { type: "lily", left: 38, scale: 0.82, delay: 0.75 },
  { type: "tulip", left: 50, scale: 1.16, delay: 0.95 },
  { type: "lily", left: 61, scale: 0.98, delay: 1.15 },
  { type: "tulip", left: 72, scale: 0.86, delay: 1.35 },
  { type: "lily", left: 83, scale: 1.05, delay: 1.55 },
  { type: "tulip", left: 92, scale: 0.74, delay: 1.75 },
];

function seededValue(seed, min, max) {
  const value = Math.sin(seed * 999) * 10000;
  const fraction = value - Math.floor(value);
  return min + fraction * (max - min);
}

const sparkles = Array.from({ length: 52 }, (_, index) => ({
  id: index,
  left: seededValue(index + 1, 2, 98),
  top: seededValue(index + 9, 3, 92),
  size: seededValue(index + 20, 2, 5),
  delay: seededValue(index + 40, 0, 6),
  duration: seededValue(index + 70, 4, 9),
}));

const floatingPetals = Array.from({ length: 18 }, (_, index) => ({
  id: index,
  left: seededValue(index + 4, 0, 100),
  delay: seededValue(index + 18, 0, 9),
  duration: seededValue(index + 31, 8, 15),
  size: seededValue(index + 44, 10, 18),
}));

function AmbientBackground() {
  return (
    <div className="ambient" aria-hidden="true">
      <div className="orb orb-one" />
      <div className="orb orb-two" />
      <div className="orb orb-three" />

      {sparkles.map((sparkle) => (
        <span
          key={sparkle.id}
          className="sparkle"
          style={{
            left: `${sparkle.left}%`,
            top: `${sparkle.top}%`,
            width: `${sparkle.size}px`,
            height: `${sparkle.size}px`,
            animationDelay: `${sparkle.delay}s`,
            animationDuration: `${sparkle.duration}s`,
          }}
        />
      ))}

      {floatingPetals.map((petal) => (
        <span
          key={petal.id}
          className="floating-petal"
          style={{
            left: `${petal.left}%`,
            width: `${petal.size}px`,
            height: `${petal.size * 1.4}px`,
            animationDelay: `${petal.delay}s`,
            animationDuration: `${petal.duration}s`,
          }}
        />
      ))}
    </div>
  );
}

function Bunny({ className = "" }) {
  return (
    <div className={`bunny ${className}`} aria-hidden="true">
      <span className="bunny-heart bunny-heart-one">♡</span>
      <span className="bunny-heart bunny-heart-two">♡</span>
      <span className="bunny-ear bunny-ear-left" />
      <span className="bunny-ear bunny-ear-right" />
      <span className="bunny-head">
        <span className="bunny-eye bunny-eye-left" />
        <span className="bunny-eye bunny-eye-right" />
        <span className="bunny-nose" />
      </span>
      <span className="bunny-body" />
      <span className="bunny-tail" />
    </div>
  );
}

function Flower({ type, left, scale = 1, delay = 0 }) {
  return (
    <div
      className={`flower flower-${type}`}
      style={{
        left: `${left}%`,
        "--flower-scale": scale,
        "--flower-delay": `${delay}s`,
      }}
      aria-hidden="true"
    >
      <span className="stem" />
      <span className="leaf leaf-left" />
      <span className="leaf leaf-right" />

      <span className="flower-head">
        {type === "tulip" ? (
          <>
            <span className="bloom-petal tulip-left" />
            <span className="bloom-petal tulip-centre" />
            <span className="bloom-petal tulip-right" />
          </>
        ) : (
          <>
            <span className="bloom-petal lily-one" />
            <span className="bloom-petal lily-two" />
            <span className="bloom-petal lily-three" />
            <span className="bloom-petal lily-four" />
            <span className="lily-centre" />
          </>
        )}
      </span>
    </div>
  );
}

function Reveal({ children, className = "" }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const element = ref.current;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.22 }
    );

    if (element) observer.observe(element);

    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className={`reveal ${visible ? "visible" : ""} ${className}`}>
      {children}
    </div>
  );
}

function MessageCard({ message, index }) {
  const [open, setOpen] = useState(false);

  return (
    <button
      className={`note-card ${open ? "note-card-open" : ""}`}
      onClick={() => setOpen(true)}
      aria-label={open ? message : "Open a message"}
    >
      <span className="note-number">{String(index + 1).padStart(2, "0")}</span>
      {!open ? (
        <span className="note-front">
          click me <span>🌷</span>
        </span>
      ) : (
        <span className="note-back">{message}</span>
      )}
    </button>
  );
}

export default function App() {
  const [opened, setOpened] = useState(false);
  const gardenRef = useRef(null);

  const openGarden = () => {
    setOpened(true);

    setTimeout(() => {
      gardenRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 160);
  };

  return (
    <main>
      <AmbientBackground />

      <section className="hero-section">
        <Bunny className="hero-bunny-left" />
        <Bunny className="hero-bunny-right" />

        <div className="hero-card">
          <p className="tiny-text">a little something for my Suhavi 🐰</p>

          <h1>
            I know I said I’d get you flowers…
            <span>but I thought I’d make you some that never die.</span>
          </h1>

          <p className="hero-subtitle">
            Tulips, lilies, bunnies, and a few tiny messages for you my cutieee
          </p>

          <button className="open-button" onClick={openGarden}>
            Open your garden 🌷
          </button>
        </div>
      </section>

      <section
        ref={gardenRef}
        className={`garden-section ${opened ? "garden-open" : ""}`}
      >
        <div className="section-heading">
          <p className="tiny-text">your garden</p>
          <h2>A little garden of your favourite flowers, just for you.</h2>
          <p>
            Here are some flowers you can view any time, any day…

            so whenever you need a little smile, you’ll always have these to look at.
          </p>
        </div>

        <div className="flower-bed">
          <div className="moon" aria-hidden="true" />

          {flowerField.map((flower, index) => (
            <Flower key={index} {...flower} />
          ))}

          <div className="garden-bunny-track" aria-hidden="true">
            <Bunny className="garden-hopping-bunny" />
          </div>

          <div className="ground" />
        </div>

        <p className="scroll-cue">scroll down, there’s more ↓</p>
      </section>

      <section className="notes-section">
        <div className="section-heading">
          <h2>Some flowers have messages too.</h2>
          <p>Tap the cards as you scroll.</p>
        </div>

        <div className="notes-grid">
          {messages.map((message, index) => (
            <div key={message}>
              <Reveal>
                <MessageCard message={message} index={index} />
              </Reveal>

              {index === 2 && (
                <Reveal className="bunny-break">
                  <div className="bunny-message">
                    <Bunny className="middle-bunny" />
                    <div>
                      <p>keep scrolling</p>
                      <span>there are still more flowers for you 🐰</span>
                    </div>
                  </div>
                </Reveal>
              )}
            </div>
          ))}
        </div>
      </section>

      <section className="final-section">
        <Reveal>
          <div className="final-card">
            <div className="mini-bouquet" aria-hidden="true">
              <Flower type="tulip" left={20} scale={0.78} delay={0} />
              <Flower type="lily" left={38} scale={0.82} delay={0.1} />
              <Flower type="tulip" left={55} scale={0.9} delay={0.2} />
              <Flower type="lily" left={72} scale={0.74} delay={0.3} />
            </div>

            <p className="tiny-text">one last thing</p>
            <h2>I hope this made you smile, even a little.</h2>
            <p>
              Real flowers are still pending… but for now, these ones are yours.
            </p>
            <span className="final-emojis">🌷 ♡ 🐰</span>
          </div>
        </Reveal>
      </section>
    </main>
  );
}