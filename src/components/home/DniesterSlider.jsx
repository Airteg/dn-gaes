"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const slides = [
  {
    title: "Найпотужніша в Європі",
    text: "Дністровська ГАЕС — найбільша гідроакумулююча електростанція Європи. Забезпечує балансування енергосистеми України.",
  },
  {
    title: "Інноваційна енергетика",
    text: "Станція накопичує енергію вночі, видає вдень. Цикл ефективний та економічний.",
  },
  {
    title: "Масштабна інфраструктура",
    text: "Греблі, тунелі, машинні зали — реалізовано в складних умовах Поділля. Інженерний прорив.",
  },
  {
    title: "Екологічна відповідальність",
    text: "Мінімізує викиди, сприяє зеленій енергетиці. Служить природі.",
  },
  {
    title: "Вклад у майбутнє",
    text: "Енергія, розвиток регіону, інфраструктура. Символ української незалежності.",
  },
];

export default function DniesterSlider() {
  const [index, setIndex] = useState(0);
  const [showTitle, setShowTitle] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShowTitle(false), 6000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!showTitle) {
      const timeout = setTimeout(() => {
        setIndex((prev) => (prev + 1) % slides.length);
      }, 6000);
      return () => clearTimeout(timeout);
    }
  }, [index, showTitle]);

  return (
    <div className="w-screen h-[100vh] flex items-center justify-center relative overflow-hidden">
      <AnimatePresence>
        {showTitle ? (
          <motion.h1
            key="main-title"
            initial={{ x: "-100%", opacity: 0, scale: 1 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: "-42vw", y: "-44vh", scale: 0.6, opacity: 0.0 }}
            transition={{ duration: 1.2 }}
            className="absolute text-4xl font-bold title"
            style={{ color: "var(--t-color)" }}
          >
            <div className="flex bg-transparent max-w-[800px] min-w-[360px] px-6 py-4">
              <span className="title" style={{ textAlign: "center" }}>
                Нижньодністровська ГЕС
              </span>
            </div>
          </motion.h1>
        ) : (
          <motion.div
            key={index}
            initial={{ x: "-100%", opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: "100%", opacity: 0 }}
            transition={{ duration: 1 }}
            className="absolute w-full h-full flex items-center justify-center"
          >
            <div
              className="bg-transparent max-w-[600px] min-w-[360px] px-6 py-4"
              style={{ color: "var(--p-color)" }}
            >
              <h1
                className="text-2xl font-bold mb-2"
                style={{ color: "var(--t-color)" }}
              >
                {slides[index].title}
              </h1>
              <h5 className="text-base leading-relaxed">
                {slides[index].text}
              </h5>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
