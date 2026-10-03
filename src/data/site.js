import { FaGithub, FaLinkedin } from "react-icons/fa";

export const site = {
  name: "Pratham Chatke",
  initials: "PC",
  role: "DevOps Engineer",
  email: "prathamchatke@gmail.com",
  location: "India",
  homeTitle: "Pratham Chatke | DevOps Engineer",
  reposTitle: "All GitHub Repositories | Pratham",
  tagline: "DevOps engineer building reliable cloud infrastructure and automated delivery pipelines.",
};

// TODO: confirm the LinkedIn profile URL before launch.
export const socialLinks = [
  { id: "github", label: "GitHub", href: "https://github.com/PrathamChatke", icon: FaGithub },
  { id: "linkedin", label: "LinkedIn", href: "https://www.linkedin.com/in/prathamchatke", icon: FaLinkedin },
];

// Sections tracked by the navbar scroll-spy (in page order).
export const spySections = ["home", "about", "skills", "projects", "devopsdashboard", "cloudarchitecture", "contact"];

export const navItems = [
  { id: "about", label: "About" },
  { id: "skills", label: "Stack" },
  { id: "projects", label: "Projects" },
  { id: "devopsdashboard", label: "Mission Control" },
  { id: "cloudarchitecture", label: "Architecture" },
];

export const navCta = { id: "contact", label: "Contact" };

export const footerLinks = [
  { id: "about", label: "About" },
  { id: "skills", label: "Stack" },
  { id: "projects", label: "Projects" },
  { id: "devopsdashboard", label: "Mission Control" },
  { id: "cloudarchitecture", label: "Architecture" },
  { id: "contact", label: "Contact" },
];
