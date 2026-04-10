const fadeElements = document.querySelectorAll(".fade");
const menuLinks = document.querySelectorAll(".menu-link");
const sectionLinks = Array.from(menuLinks).filter((link) => {
  const href = link.getAttribute("href") || "";
  return href.startsWith("#");
});

const trackedSections = sectionLinks
  .map((link) => {
    const href = link.getAttribute("href");
    return href ? document.querySelector(href) : null;
  })
  .filter(Boolean);

const syncActiveMenuLink = () => {
  if (!sectionLinks.length || !trackedSections.length) return;

  const scrollPosition = window.scrollY + window.innerHeight * 0.28;
  let activeSection = trackedSections[0];

  trackedSections.forEach((section) => {
    if (section.offsetTop <= scrollPosition) {
      activeSection = section;
    }
  });

  sectionLinks.forEach((link) => {
    const href = link.getAttribute("href");
    const isActive = href === `#${activeSection.id}`;
    link.classList.toggle("is-active", isActive);

    if (isActive) {
      link.setAttribute("aria-current", "page");
    } else {
      link.removeAttribute("aria-current");
    }
  });
};

const revealOnScroll = () => {
  fadeElements.forEach((element) => {
    const { top } = element.getBoundingClientRect();
    if (top < window.innerHeight - 80) {
      element.classList.add("show");
    }
  });

  syncActiveMenuLink();
};

window.addEventListener("scroll", revealOnScroll);
window.addEventListener("load", revealOnScroll);
revealOnScroll();

const canvas = document.getElementById("particles");
const context = canvas.getContext("2d");

let particles = [];

const resizeCanvas = () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
};

const createParticles = () => {
  const amount = window.innerWidth < 768 ? 40 : 75;
  particles = Array.from({ length: amount }, () => ({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    size: Math.random() * 2 + 1,
    speedX: (Math.random() - 0.5) * 0.35,
    speedY: (Math.random() - 0.5) * 0.35,
    alpha: Math.random() * 0.5 + 0.25
  }));
};

const drawParticles = () => {
  context.clearRect(0, 0, canvas.width, canvas.height);

  particles.forEach((particle) => {
    particle.x += particle.speedX;
    particle.y += particle.speedY;

    if (particle.x < -10) particle.x = canvas.width + 10;
    if (particle.x > canvas.width + 10) particle.x = -10;
    if (particle.y < -10) particle.y = canvas.height + 10;
    if (particle.y > canvas.height + 10) particle.y = -10;

    context.beginPath();
    context.fillStyle = `rgba(96, 165, 250, ${particle.alpha})`;
    context.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
    context.fill();
  });

  requestAnimationFrame(drawParticles);
};

resizeCanvas();
createParticles();
drawParticles();

window.addEventListener("resize", () => {
  resizeCanvas();
  createParticles();
  revealOnScroll();
});

function whatsapp() {
  window.open("https://wa.me/5511999302690", "_blank", "noopener,noreferrer");
}

const estimateConfig = {
  site: {
    label: "Site institucional",
    baseMin: 1800,
    baseMax: 3200
  },
  landing: {
    label: "Landing page",
    baseMin: 1200,
    baseMax: 2400
  },
  sistema: {
    label: "Sistema web",
    baseMin: 4500,
    baseMax: 9000
  }
};

const formatCurrency = (value) =>
  new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    maximumFractionDigits: 0
  }).format(value);

const calculateEstimate = () => {
  const type = document.getElementById("estimate-type");
  const pages = document.getElementById("estimate-pages");
  const deadline = document.getElementById("estimate-deadline");
  const brief = document.getElementById("estimate-brief");

  if (!type || !pages || !deadline || !brief) return null;

  const selectedType = estimateConfig[type.value];
  let min = selectedType.baseMin;
  let max = selectedType.baseMax;

  const pagesValue = Number(pages.value);
  if (pagesValue === 3) {
    min += 400;
    max += 700;
  } else if (pagesValue === 5) {
    min += 800;
    max += 1400;
  } else if (pagesValue === 8) {
    min += 1400;
    max += 2400;
  }

  const extras = [];

  if (document.getElementById("estimate-formulario")?.checked) {
    min += 250;
    max += 500;
    extras.push("formulário");
  }

  if (document.getElementById("estimate-copy")?.checked) {
    min += 350;
    max += 800;
    extras.push("apoio com textos");
  }

  if (document.getElementById("estimate-visual")?.checked) {
    min += 450;
    max += 1000;
    extras.push("ajuste visual");
  }

  if (document.getElementById("estimate-admin")?.checked) {
    min += 1200;
    max += 3000;
    extras.push("painel administrativo");
  }

  if (deadline.value === "soon") {
    min += 300;
    max += 700;
  } else if (deadline.value === "urgent") {
    min += 700;
    max += 1500;
  }

  return {
    type: selectedType.label,
    min,
    max,
    pages: pages.options[pages.selectedIndex].text,
    deadline: deadline.options[deadline.selectedIndex].text,
    extras,
    brief: brief.value.trim()
  };
};

const updateEstimateUI = () => {
  const estimate = calculateEstimate();
  if (!estimate) return;

  const range = document.getElementById("estimate-range");
  const summary = document.getElementById("estimate-summary");
  const typeValue = document.getElementById("estimate-type-value");
  const scopeValue = document.getElementById("estimate-scope-value");
  const noteValue = document.getElementById("estimate-note-value");

  range.textContent = `${formatCurrency(estimate.min)} a ${formatCurrency(estimate.max)}`;
  typeValue.textContent = estimate.type;
  scopeValue.textContent = `${estimate.pages} - ${estimate.deadline}`;

  const extrasText = estimate.extras.length
    ? `Inclui: ${estimate.extras.join(", ")}.`
    : "Sem extras selecionados até o momento.";

  summary.textContent = `Estimativa inicial para ${estimate.type.toLowerCase()} com escopo em ${estimate.pages.toLowerCase()}.`;
  noteValue.textContent = `${extrasText} O valor final pode variar conforme integrações, conteúdo e nível de personalização.`;
};

const sendEstimateToWhatsApp = () => {
  const estimate = calculateEstimate();
  if (!estimate) return;

  updateEstimateUI();

  const message = [
    "Olá, TriDev! Fiz a estimativa no site e quero conversar.",
    "",
    `Tipo de projeto: ${estimate.type}`,
    `Quantidade de páginas: ${estimate.pages}`,
    `Prazo: ${estimate.deadline}`,
    `Extras: ${estimate.extras.length ? estimate.extras.join(", ") : "nenhum"}`,
    `Faixa estimada: ${formatCurrency(estimate.min)} a ${formatCurrency(estimate.max)}`,
    `Resumo: ${estimate.brief || "não informado"}`
  ].join("\n");

  const url = `https://wa.me/5511999302690?text=${encodeURIComponent(message)}`;
  window.open(url, "_blank", "noopener,noreferrer");
};

document.getElementById("estimate-calculate")?.addEventListener("click", updateEstimateUI);
document.getElementById("estimate-whatsapp")?.addEventListener("click", sendEstimateToWhatsApp);

document.querySelectorAll("#estimate-form select, #estimate-form input, #estimate-form textarea").forEach((field) => {
  field.addEventListener("change", updateEstimateUI);
  field.addEventListener("input", updateEstimateUI);
});
