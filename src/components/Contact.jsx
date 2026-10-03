import { useEffect, useRef, useState } from "react";
import { FaCopy, FaCheck, FaEnvelope, FaPaperPlane, FaMapMarkerAlt } from "react-icons/fa";
import { site, socialLinks } from "../data/site";
import { sectionCopy } from "../data/sections";
import { contactCopy, COPIED_RESET_MS, DEFAULT_SUBJECT, subjectOptions, SUCCESS_RESET_MS } from "../data/contact";
import { sendContactEmail } from "../utils/email";
import { playClickSound, playSuccessChime } from "../utils/audio";
import SectionHeader from "./SectionHeader";

const emptyForm = { name: "", email: "", subject: DEFAULT_SUBJECT, message: "", website: "" };

function selectText(el) {
  if (!el) return;
  const range = document.createRange();
  range.selectNodeContents(el);
  const selection = window.getSelection();
  selection.removeAllRanges();
  selection.addRange(range);
}

function CopyEmail() {
  const [copied, setCopied] = useState(false);
  const emailRef = useRef(null);

  useEffect(() => {
    if (!copied) return undefined;
    const id = setTimeout(() => setCopied(false), COPIED_RESET_MS);
    return () => clearTimeout(id);
  }, [copied]);

  const copy = async () => {
    playClickSound();
    try {
      await navigator.clipboard.writeText(site.email);
      setCopied(true);
    } catch {
      selectText(emailRef.current); // Let the user copy manually.
    }
  };

  return (
    <div className="contact-row">
      <span className="icon-tile" aria-hidden="true">
        <FaEnvelope />
      </span>
      <div className="contact-row__body">
        <span className="contact-row__label">Email</span>
        <a ref={emailRef} href={`mailto:${site.email}`} className="contact-row__value">
          {site.email}
        </a>
      </div>
      <button type="button" className="btn btn--secondary btn--sm" onClick={copy} aria-label={copied ? "Email copied" : `Copy ${site.email}`}>
        {copied ? <FaCheck aria-hidden="true" /> : <FaCopy aria-hidden="true" />}
        <span aria-live="polite">{copied ? contactCopy.copiedLabel : contactCopy.copyLabel}</span>
      </button>
    </div>
  );
}

export default function Contact() {
  const [form, setForm] = useState(emptyForm);
  const [status, setStatus] = useState("idle"); // idle | sending | success | error
  const resetTimer = useRef(null);

  useEffect(() => () => clearTimeout(resetTimer.current), []);

  const update = (field) => (e) => {
    setForm((f) => ({ ...f, [field]: e.target.value }));
    if (status === "error") setStatus("idle");
  };

  const succeed = () => {
    playSuccessChime();
    setStatus("success");
    resetTimer.current = setTimeout(() => {
      setForm(emptyForm);
      setStatus("idle");
    }, SUCCESS_RESET_MS);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (status === "sending") return;
    playClickSound();

    // Honeypot: bots fill hidden fields. Pretend it worked, send nothing.
    if (form.website) {
      succeed();
      return;
    }

    setStatus("sending");
    try {
      await sendContactEmail(form);
      succeed();
    } catch (err) {
      if (import.meta.env.DEV) console.error("[Contact] send failed", err);
      setStatus("error");
    }
  };

  const mailto = `mailto:${site.email}?subject=${encodeURIComponent(form.subject)}&body=${encodeURIComponent(
    `${form.message}\n\n${form.name}${form.email ? ` <${form.email}>` : ""}`
  )}`;

  return (
    <section id="contact" className="section contact" aria-labelledby="contact-heading">
      <div className="container contact__grid">
        <div className="contact__info">
          <SectionHeader id="contact-heading" {...sectionCopy.contact} />
          <p className="contact__intro">{contactCopy.intro}</p>

          <div className="card contact__card">
            <CopyEmail />
            <div className="contact-row">
              <span className="icon-tile" aria-hidden="true">
                <FaMapMarkerAlt />
              </span>
              <div className="contact-row__body">
                <span className="contact-row__label">Location</span>
                <span className="contact-row__value">{site.location}</span>
              </div>
            </div>
          </div>

          <ul className="contact__social">
            {socialLinks.map(({ id, label, href, icon: Icon }) => (
              <li key={id}>
                <a href={href} target="_blank" rel="noreferrer" className="btn btn--secondary" onClick={playClickSound}>
                  <Icon aria-hidden="true" /> {label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div className="card contact__form-wrap">
          {status === "success" ? (
            <div className="form-status" data-status="success" role="status">
              <FaCheck aria-hidden="true" className="form-status__icon" />
              <p className="form-status__title">{contactCopy.successTitle}</p>
              <p className="form-status__text">{contactCopy.successText}</p>
            </div>
          ) : (
            <form className="contact-form" onSubmit={onSubmit} aria-busy={status === "sending"}>
              <div className="contact-form__row">
                <div className="field">
                  <label htmlFor="contact-name">Name</label>
                  <input id="contact-name" name="name" required autoComplete="name" value={form.name} onChange={update("name")} />
                </div>
                <div className="field">
                  <label htmlFor="contact-email">Email</label>
                  <input
                    id="contact-email"
                    name="email"
                    type="email"
                    required
                    autoComplete="email"
                    value={form.email}
                    onChange={update("email")}
                  />
                </div>
              </div>
              <div className="field">
                <label htmlFor="contact-subject">Subject</label>
                <select id="contact-subject" name="subject" value={form.subject} onChange={update("subject")}>
                  {subjectOptions.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              </div>
              <div className="field">
                <label htmlFor="contact-message">Message</label>
                <textarea id="contact-message" name="message" rows={6} required value={form.message} onChange={update("message")} />
              </div>

              {/* Honeypot: hidden from people and assistive tech, tempting to bots. */}
              <div className="hp-field" aria-hidden="true">
                <label htmlFor="contact-website">Website</label>
                <input id="contact-website" name="website" tabIndex={-1} autoComplete="off" value={form.website} onChange={update("website")} />
              </div>

              {status === "error" && (
                <div className="form-status" data-status="error" role="alert">
                  <p>{contactCopy.errorText}</p>
                  <a href={mailto} className="link-arrow">
                    <FaEnvelope aria-hidden="true" /> Email {site.email} directly
                  </a>
                </div>
              )}

              <button type="submit" className="btn btn--primary btn--lg" disabled={status === "sending"} data-state={status}>
                <FaPaperPlane aria-hidden="true" /> {status === "sending" ? "Sending…" : "Send Message"}
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
