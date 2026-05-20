"use client";

/**
 * Joins optional resume fields into one printable line.
 *
 * Called by:
 * - ContactLine() for contact methods.
 * - Experience()/Education()/Projects() for date/location lines.
 * - ResumeTemplate() when turning certification objects into display strings.
 *
 * The filter(Boolean) step is important for ATS-friendly output because it
 * avoids dangling separators when the parser did not find a field.
 */
const join = (items = [], fallback = "") => (items || []).filter(Boolean).join(" | ") || fallback;

/**
 * Renders the candidate contact row.
 *
 * Props:
 * - info: resume.personalInfo from the structured resume JSON stored by the
 *   backend in covgen-server/models/resume.js or optimizedResume from
 *   covgen-server/models/generated-resume.js.
 *
 * Called by:
 * - ResumeTemplate() below.
 */
function ContactLine({ info = {} }) {
  return (
    <div className="resume-contact">
      {[info.email, info.phone, info.location, info.linkedin, info.portfolio, info.github].filter(Boolean).map((item, index) => (
        <span key={`${item}-${index}`}>{item}</span>
      ))}
    </div>
  );
}

/**
 * Generic printable resume section wrapper.
 *
 * Props:
 * - title: visible section heading.
 * - children: section body supplied by the specific section component.
 * - className: optional CSS hook for future template-specific layout tweaks.
 *
 * Called by:
 * - ResumeTemplate() for Summary.
 * - Experience(), Education(), Projects(), and SimpleList().
 *
 * Returning null when children is absent prevents empty headings from appearing
 * in final PDF output, which is important for ATS cleanliness and professional
 * print exports.
 */
function Section({ title, children, className = "" }) {
  if (!children) return null;
  return (
    <section className={`resume-section ${className}`}>
      <h2>{title}</h2>
      {children}
    </section>
  );
}

/**
 * Renders work history from resume.experience.
 *
 * Props:
 * - items: array created by the backend AI parser in
 *   covgen-server/services/resume-ai-service.js.
 *
 * Called by:
 * - ResumeTemplate().
 *
 * Data expectations:
 * - company, role, location, startDate, endDate, bullets.
 * - Bullets are rendered as normal <li> text so the browser PDF remains
 *   selectable and ATS-readable.
 */
function Experience({ items = [] }) {
  if (!items.length) return null;
  return (
    <Section title="Experience">
      {items.map((item, index) => (
        <article className="resume-item" key={`${item.company}-${item.role}-${index}`}>
          <div className="resume-row">
            <h3>{item.role}</h3>
            <span>{join([item.startDate, item.endDate])}</span>
          </div>
          <p className="resume-subline">{join([item.company, item.location])}</p>
          <ul>
            {(item.bullets || []).map((bullet, bulletIndex) => (
              <li key={`${bullet}-${bulletIndex}`}>{bullet}</li>
            ))}
          </ul>
        </article>
      ))}
    </Section>
  );
}

/**
 * Renders education entries from resume.education.
 *
 * Props:
 * - items: normalized education array from parsed or optimized resume JSON.
 *
 * Called by:
 * - ResumeTemplate().
 */
function Education({ items = [] }) {
  if (!items.length) return null;
  return (
    <Section title="Education">
      {items.map((item, index) => (
        <article className="resume-item" key={`${item.institution}-${index}`}>
          <div className="resume-row">
            <h3>{join([item.degree, item.field]) || item.institution}</h3>
            <span>{join([item.startDate, item.endDate])}</span>
          </div>
          <p className="resume-subline">{join([item.institution, item.location])}</p>
          {!!item.details?.length && <p>{item.details.join(" | ")}</p>}
        </article>
      ))}
    </Section>
  );
}

/**
 * Renders portfolio/project entries from resume.projects.
 *
 * Props:
 * - items: project objects from structured resume JSON.
 *
 * Called by:
 * - ResumeTemplate().
 *
 * Note:
 * - This component renders content only. It does not decide page layout,
 *   pagination, or AI wording; those responsibilities stay in CSS and backend
 *   AI services respectively.
 */
function Projects({ title = "Projects", items = [] }) {
  if (!items.length) return null;
  return (
    <Section title={title}>
      {items.map((item, index) => (
        <article className="resume-item" key={`${item.name}-${index}`}>
          <div className="resume-row">
            <h3>{item.name}</h3>
            <span>{item.date}</span>
          </div>
          {item.description && <p className="resume-subline">{item.description}</p>}
          <ul>
            {(item.bullets || []).map((bullet, bulletIndex) => (
              <li key={`${bullet}-${bulletIndex}`}>{bullet}</li>
            ))}
          </ul>
        </article>
      ))}
    </Section>
  );
}

/**
 * Renders compact pipe-separated sections such as Skills, Certifications,
 * and Achievements.
 *
 * Props:
 * - title: section heading.
 * - items: array of strings already normalized by the caller.
 * - template: optional template ID for custom rendering.
 *
 * Called by:
 * - ResumeTemplate().
 */
function SimpleList({ title, items = [], template }) {
  if (!items.length) return null;

  if (template === "designer-ux" && title === "Skills") {
    return (
      <Section title={title} className="designer-ux-skills">
        <div className="resume-skills-list">
          {items.map((item, idx) => (
            <span key={`${item}-${idx}`}>{item}</span>
          ))}
        </div>
      </Section>
    );
  }

  return (
    <Section title={title}>
      <p className="resume-list-text">{items.join(" | ")}</p>
    </Section>
  );
}

/**
 * Controlled resume renderer: JSON -> HTML template.
 *
 * Called by:
 * - app/resumes/[id]/templates/page.js for live template selection preview.
 * - app/resumes/preview/[id]/page.js for final preview and browser PDF export.
 *
 * Props flowing in:
 * - resume: generatedResume.optimizedResume from
 *   GET /api/resumes/generated/:id, or a temporary empty object before data
 *   loads on the template page.
 * - template: generatedResume.template or local selected state from the
 *   template selection page.
 * - isEditing: boolean to enable inline editing mode.
 * - onFieldChange: callback function for inline edits (field, value, path?).
 *
 * Cross-file CSS dependency:
 * - The class resume-template-${template} is styled in app/globals.css.
 *
 * Product boundary:
 * - AI never generates layout. This component accepts content JSON only and
 *   chooses from prebuilt CSS template classes.
 */
export default function ResumeTemplate({ resume = {}, template = "ats-classic", isEditing = false, onFieldChange }) {
  const info = resume.personalInfo || {};
  const certifications = (resume.certifications || []).map((cert) => join([cert.name, cert.issuer, cert.date]));

  // Inline editable text component
  const EditableText = ({ value, field, path, as = "span" }) => {
    if (!isEditing) {
      const Component = as;
      return <Component>{value || "Click to edit"}</Component>;
    }

    const Component = as;
    return (
      <Component
        contentEditable
        suppressContentEditableWarning
        onBlur={(e) => {
          const newValue = e.currentTarget.textContent;
          onFieldChange?.(field, newValue, path);
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter" && e.ctrlKey) {
            e.currentTarget.blur();
          }
        }}
        className="outline-2 outline-orange-400 hover:outline"
        style={{
          outline: "1px dashed rgba(249, 115, 22, 0.3)",
          paddingLeft: "2px",
          paddingRight: "2px",
          cursor: "text",
        }}
      >
        {value}
      </Component>
    );
  };

  return (
    <article className={`resume-paper resume-template-${template}`} style={isEditing ? { opacity: 0.95 } : {}}>
      <header className="resume-header">
        <h1>
          <EditableText value={info.name || "Your Name"} field="name" as="span" />
        </h1>
        <ContactLine info={info} />
      </header>

      {resume.summary && (
        <Section title={template === "executive-minimal" ? "Executive Profile" : "Summary"} className={template === "designer-ux" ? "designer-ux-summary" : ""}>
          {isEditing ? (
            <textarea
              value={resume.summary}
              onChange={(e) => onFieldChange?.("summary", e.target.value)}
              className="w-full min-h-[60px] rounded border border-orange-300 p-2 text-sm"
              style={{ fontSize: "inherit", fontFamily: "inherit" }}
            />
          ) : (
            <p>{resume.summary}</p>
          )}
        </Section>
      )}

      {isEditing ? (
        <>
          <Section title="Skills" className={template === "designer-ux" ? "designer-ux-skills" : ""}>
            <textarea
              value={(resume.skills || []).join("\n")}
              onChange={(e) => onFieldChange?.("skills", e.target.value.split("\n").filter(Boolean))}
              className="w-full min-h-[80px] rounded border border-orange-300 p-2 text-sm"
              placeholder="One skill per line"
              style={{ fontSize: "inherit", fontFamily: "inherit" }}
            />
          </Section>
          <Section title="Experience" className={template === "designer-ux" ? "designer-ux-experience" : ""}>
            {(resume.experience || []).map((item, idx) => (
              <div key={`${item.company}-${idx}`} className="rounded border border-orange-200 bg-orange-50 p-2 mb-2">
                <input
                  type="text"
                  value={item.role || ""}
                  onChange={(e) => onFieldChange?.("experience", e.target.value, `${idx}.role`)}
                  className="w-full mb-1 rounded border border-orange-300 p-1 text-sm font-semibold"
                  placeholder="Role"
                />
                <input
                  type="text"
                  value={item.company || ""}
                  onChange={(e) => onFieldChange?.("experience", e.target.value, `${idx}.company`)}
                  className="w-full mb-1 rounded border border-orange-300 p-1 text-sm"
                  placeholder="Company"
                />
                <textarea
                  value={(item.bullets || []).join("\n")}
                  onChange={(e) => onFieldChange?.("experience", e.target.value.split("\n").filter(Boolean), `${idx}.bullets`)}
                  className="w-full min-h-[60px] rounded border border-orange-300 p-1 text-sm"
                  placeholder="One bullet per line"
                  style={{ fontSize: "inherit", fontFamily: "inherit" }}
                />
              </div>
            ))}
          </Section>

          <Section title="Selected Work" className={template === "designer-ux" ? "designer-ux-work" : ""}>
            {(resume.projects || []).map((item, idx) => (
              <div key={`${item.name}-${idx}`} className="rounded border border-orange-200 bg-orange-50 p-2 mb-2">
                <input
                  type="text"
                  value={item.name || ""}
                  onChange={(e) => onFieldChange?.("projects", e.target.value, `${idx}.name`)}
                  className="w-full mb-1 rounded border border-orange-300 p-1 text-sm font-semibold"
                  placeholder="Project Name"
                />
                <input
                  type="text"
                  value={item.date || ""}
                  onChange={(e) => onFieldChange?.("projects", e.target.value, `${idx}.date`)}
                  className="w-full mb-1 rounded border border-orange-300 p-1 text-sm"
                  placeholder="Date"
                />
                <textarea
                  value={item.description || ""}
                  onChange={(e) => onFieldChange?.("projects", e.target.value, `${idx}.description`)}
                  className="w-full min-h-[30px] rounded border border-orange-300 p-1 text-sm"
                  placeholder="Description"
                  style={{ fontSize: "inherit", fontFamily: "inherit" }}
                />
                <textarea
                  value={(item.bullets || []).join("\n")}
                  onChange={(e) => onFieldChange?.("projects", e.target.value.split("\n").filter(Boolean), `${idx}.bullets`)}
                  className="w-full min-h-[60px] rounded border border-orange-300 p-1 text-sm"
                  placeholder="One bullet per line"
                  style={{ fontSize: "inherit", fontFamily: "inherit" }}
                />
              </div>
            ))}
          </Section>

          <Section title="Education" className={template === "designer-ux" ? "designer-ux-education" : ""}>
            {(resume.education || []).map((item, idx) => (
              <div key={`${item.institution}-${idx}`} className="rounded border border-orange-200 bg-orange-50 p-2 mb-2">
                <input
                  type="text"
                  value={item.degree || ""}
                  onChange={(e) => onFieldChange?.("education", e.target.value, `${idx}.degree`)}
                  className="w-full mb-1 rounded border border-orange-300 p-1 text-sm font-semibold"
                  placeholder="Degree"
                />
                <input
                  type="text"
                  value={item.field || ""}
                  onChange={(e) => onFieldChange?.("education", e.target.value, `${idx}.field`)}
                  className="w-full mb-1 rounded border border-orange-300 p-1 text-sm"
                  placeholder="Field of Study"
                />
                <input
                  type="text"
                  value={item.institution || ""}
                  onChange={(e) => onFieldChange?.("education", e.target.value, `${idx}.institution`)}
                  className="w-full mb-1 rounded border border-orange-300 p-1 text-sm"
                  placeholder="Institution"
                />
                <div className="mb-1 grid gap-2 sm:grid-cols-2">
                  <input
                    type="text"
                    value={item.startDate || ""}
                    onChange={(e) => onFieldChange?.("education", e.target.value, `${idx}.startDate`)}
                    className="rounded border border-orange-300 p-1 text-sm"
                    placeholder="Start Date"
                  />
                  <input
                    type="text"
                    value={item.endDate || ""}
                    onChange={(e) => onFieldChange?.("education", e.target.value, `${idx}.endDate`)}
                    className="rounded border border-orange-300 p-1 text-sm"
                    placeholder="End Date"
                  />
                </div>
              </div>
            ))}
          </Section>

          <Section title="Achievements" className={template === "designer-ux" ? "designer-ux-achievements" : ""}>
            <textarea
              value={(resume.achievements || []).join("\n")}
              onChange={(e) => onFieldChange?.("achievements", e.target.value.split("\n").filter(Boolean))}
              className="w-full min-h-[80px] rounded border border-orange-300 p-2 text-sm"
              placeholder="One achievement per line"
              style={{ fontSize: "inherit", fontFamily: "inherit" }}
            />
          </Section>
        </>
      ) : (
        <>
          <SimpleList title="Skills" items={resume.skills} template={template} />
          <Experience items={resume.experience} />
          <Projects title={template === "designer-ux" ? "Selected Work" : "Projects"} items={resume.projects} />
          <Education items={resume.education} />
          <SimpleList title="Achievements" items={resume.achievements} template={template} />
        </>
      )}

      <SimpleList title="Certifications" items={certifications} template={template} />
    </article>
  );
}
