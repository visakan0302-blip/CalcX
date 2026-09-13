import React from 'react';
import { HelpCircle, BookOpen, ArrowRight, Sparkles } from 'lucide-react';
import { Card } from './Card';
import { TOOLS, getToolUrl } from '../Navigation/toolsConfig';
import { getSeoForTool } from '../../data/seoConfig';

export function SeoSection({ toolId, onSelectTool }) {
  const seoData = getSeoForTool(toolId);
  if (!seoData || !seoData.slug) return null;

  const relatedTools = (seoData.relatedToolIds || [])
    .map((id) => TOOLS.find((t) => t.id === id))
    .filter(Boolean);

  const baseUrl = import.meta.env?.BASE_URL || '/CalcX/';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24, marginTop: 12 }}>
      {/* Educational Guide & Formula Section */}
      <Card title="How It Works & Mathematical Formula" icon={BookOpen}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <p style={{ fontSize: '0.94rem', color: 'var(--text-secondary)', lineHeight: 1.65 }}>
            {seoData.overview}
          </p>

          {seoData.formula && (
            <div
              style={{
                backgroundColor: 'var(--bg-card-subtle)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-md)',
                padding: '16px 20px',
                display: 'flex',
                flexDirection: 'column',
                gap: 8,
              }}
            >
              <div
                style={{
                  fontSize: '0.78rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  fontWeight: 700,
                  color: 'var(--text-muted)',
                }}
              >
                Core Formula
              </div>
              <div
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '1rem',
                  fontWeight: 600,
                  color: 'var(--text-primary)',
                  padding: '4px 0',
                  overflowX: 'auto',
                }}
              >
                {seoData.formula.metric}
              </div>
              {seoData.formula.imperial && (
                <div
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.9rem',
                    color: 'var(--text-secondary)',
                    padding: '2px 0',
                    overflowX: 'auto',
                  }}
                >
                  {seoData.formula.imperial}
                </div>
              )}
              {seoData.formula.explanation && (
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.5, margin: 0, marginTop: 4 }}>
                  {seoData.formula.explanation}
                </p>
              )}
            </div>
          )}
        </div>
      </Card>

      {/* Frequently Asked Questions (FAQ) */}
      {seoData.faqs && seoData.faqs.length > 0 && (
        <Card title="Frequently Asked Questions" icon={HelpCircle}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {seoData.faqs.map((faq, index) => (
              <div
                key={index}
                style={{
                  paddingBottom: index === seoData.faqs.length - 1 ? 0 : 16,
                  borderBottom: index === seoData.faqs.length - 1 ? 'none' : '1px solid var(--border-subtle)',
                }}
              >
                <h3
                  style={{
                    fontSize: '0.98rem',
                    fontWeight: 600,
                    marginBottom: 6,
                    color: 'var(--text-primary)',
                  }}
                >
                  {faq.question}
                </h3>
                <p
                  style={{
                    fontSize: '0.9rem',
                    color: 'var(--text-secondary)',
                    lineHeight: 1.6,
                    margin: 0,
                  }}
                >
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Internal Links: Related Calculators */}
      {relatedTools.length > 0 && (
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
            <Sparkles size={18} color="var(--primary)" />
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', fontWeight: 700 }}>
              Related Calculators & Tools
            </h2>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
              gap: 14,
            }}
          >
            {relatedTools.map((tool) => {
              const Icon = tool.icon;
              const toolHref = getToolUrl(tool.id, baseUrl);

              return (
                <a
                  key={tool.id}
                  href={toolHref}
                  onClick={(e) => {
                    if (onSelectTool) {
                      e.preventDefault();
                      onSelectTool(tool.id);
                    }
                  }}
                  className="tool-card"
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    textDecoration: 'none',
                    color: 'inherit',
                    padding: 16,
                    cursor: 'pointer',
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10 }}>
                      <div
                        className="tool-card-icon"
                        style={{
                          width: 36,
                          height: 36,
                          background: `linear-gradient(135deg, ${tool.color} 0%, #6366f1 100%)`,
                        }}
                      >
                        <Icon size={18} />
                      </div>
                      <h3
                        style={{
                          fontSize: '0.95rem',
                          fontWeight: 700,
                          margin: 0,
                          color: 'var(--text-primary)',
                        }}
                      >
                        {tool.name}
                      </h3>
                    </div>
                    <p
                      style={{
                        fontSize: '0.84rem',
                        color: 'var(--text-secondary)',
                        lineHeight: 1.45,
                        margin: 0,
                        marginBottom: 12,
                      }}
                    >
                      {tool.description}
                    </p>
                  </div>

                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      fontSize: '0.82rem',
                      fontWeight: 600,
                      color: 'var(--primary)',
                      paddingTop: 8,
                      borderTop: '1px solid var(--border-subtle)',
                    }}
                  >
                    <span>Use Calculator</span>
                    <ArrowRight size={14} />
                  </div>
                </a>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
