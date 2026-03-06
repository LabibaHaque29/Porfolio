document.addEventListener('DOMContentLoaded', function() {
  const skills = {
    languages: [
      { name: "HTML", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg" },
      { name: "CSS", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg" },
      { name: "JavaScript", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg" },
      { name: "TypeScript", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg" },
      { name: "React", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg" },
      { name: "NextJS", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg" },
      { name: "Firebase", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/firebase/firebase-plain.svg" },
      { name: "Java", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg" },
      { name: "Python", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg" },
      { name: "C++", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/cplusplus/cplusplus-original.svg" },
      { name: "SQL", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg" },
      { name: "AWS", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/amazonwebservices/amazonwebservices-plain-wordmark.svg" },
  
    ],
    tools: [
      { name: "Git", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg" },
      { name: "Figma", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/figma/figma-original.svg" },
      { name: "JIRA", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/jira/jira-original.svg" },
      { name: "Visual Studio", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/visualstudio/visualstudio-plain.svg" },
      { name: "GitHub Actions", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg" },
      { name: "VS Code", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vscode/vscode-original.svg" },
      { name: "Sketch", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/sketch/sketch-original.svg" },
      { name: "Chart.js", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/chartjs/chartjs-original.svg" },
      { name: "Claude", icon: null },
      { name: "Lovable", icon: null },
      { name: "Replit", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/replit/replit-original.svg" },
      { name: "V0.dev", icon: null },
      { name: "Lucidchart", icon: null },
    ],
    product: [
      "Roadmap Definition",
      "User Story Writing",
      "Backlog Management",
      "Sprint Planning",
      "Feature Prioritization",
      "Stakeholder Management",
      "Usability Testing",
      "User Research",
      "Competitive Analysis",
      "Go-to-Market Strategy",
      "Agile/Scrum",
      "AI/ML"
    ]
  };

  function createSkillItem(skill) {
    const li = document.createElement('li');
    li.className = 'skill-item';

    if (skill.icon) {
      const img = document.createElement('img');
      img.src = skill.icon;
      img.alt = `${skill.name} logo`;
      img.className = 'skill-icon';
      img.width = 32;
      img.height = 32;
      img.loading = 'lazy';
      img.decoding = 'async';
      li.appendChild(img);
    }

    const span = document.createElement('span');
    span.textContent = skill.name;
    li.appendChild(span);

    return li;
  }

  function createProductSkillItem(name) {
    const li = document.createElement('li');
    li.className = 'skill-item product-skill-item';
    li.textContent = name;
    return li;
  }

  const languagesList = document.querySelector('.skill-category:nth-child(1) .skills-list');
  const toolsList = document.querySelector('.skill-category:nth-child(2) .skills-list');
  const productList = document.querySelector('.product-skills-list');

  languagesList.innerHTML = '';
  toolsList.innerHTML = '';
  productList.innerHTML = '';

  skills.languages.forEach(skill => languagesList.appendChild(createSkillItem(skill)));
  skills.tools.forEach(skill => toolsList.appendChild(createSkillItem(skill)));
  skills.product.forEach(name => productList.appendChild(createProductSkillItem(name)));
});
