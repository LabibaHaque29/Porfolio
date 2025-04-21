document.addEventListener('DOMContentLoaded', function() {
  const skills = {
    languages: [
      { name: "HTML", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg" },
      { name: "CSS", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg" },
      { name: "JavaScript", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg" },
      { name: "TypeScript", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg" },
      { name: "React", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg" },
      { name: "Java", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg" },
      { name: "Python", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg" },
      { name: "C++", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/cplusplus/cplusplus-original.svg" }
    ],
    tools: [
      { name: "Git", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg" },
      { name: "Figma", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/figma/figma-original.svg" },
      { name: "JIRA", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/jira/jira-original.svg" },
      { name: "Visual Studio", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/visualstudio/visualstudio-plain.svg" }
    ]
  };

  // Function to create a skill item
  function createSkillItem(skill) {
    const li = document.createElement('li');
    li.className = 'skill-item';
    
    const img = document.createElement('img');
    img.src = skill.icon;
    img.alt = `${skill.name} logo`;
    img.className = 'skill-icon';
    
    const span = document.createElement('span');
    span.textContent = skill.name;
    
    li.appendChild(img);
    li.appendChild(span);
    
    return li;
  }

  // Find the skills lists by their class names
  const languagesList = document.querySelector('.skill-category:nth-child(1) .skills-list');
  const toolsList = document.querySelector('.skill-category:nth-child(2) .skills-list');
  
  // Clear existing list items
  languagesList.innerHTML = '';
  toolsList.innerHTML = '';
  
  // Add language skills
  skills.languages.forEach(skill => {
    languagesList.appendChild(createSkillItem(skill));
  });
  
  // Add tool skills
  skills.tools.forEach(skill => {
    toolsList.appendChild(createSkillItem(skill));
  });
});