import re
with open("app/globals.css", "r") as f:
    content = f.read()

# find the start and end of regime-dashboard CSS
start_idx = content.find(".regime-dashboard {")
# find the start of the next section
end_idx = content.find("/* ── Slide 09 · Section Divider ──────────────────────────── */")

new_css = """
/* ── Slide 08 · Regime Transition Matrix ────────────────────────── */

.regime-dashboard {
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: 4px;
  overflow: visible;
  position: relative;
}

.regime-dashboard--multipolar {
  background: color-mix(in srgb, var(--caution) 5%, transparent);
}

.regime-dashboard-inner {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  gap: 12px;
  height: 100%;
}

/* ── YOU ARE HERE MARKER (Global Vertical Line) ── */
.regime-global-marker {
  position: absolute;
  top: 0;
  bottom: -20px;
  width: 1px;
  background: var(--primary);
  z-index: 0;
  pointer-events: none;
  border-right: 1px dashed color-mix(in srgb, var(--bg) 50%, transparent);
}
.regime-global-marker::after {
  content: '';
  position: absolute;
  top: 0;
  left: -3px;
  width: 7px;
  height: 7px;
  background: var(--primary);
  border-radius: 50%;
}

/* ── ZONE A: Master Controls ── */
.regime-controls {
  display: flex;
  gap: 16px;
  align-items: stretch;
  border: 1px solid var(--border);
  background: var(--surface-1);
  padding: 12px 16px;
}

.regime-slider-section {
  flex: 1;
  position: relative;
}

.regime-slider-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: 12px;
}

.regime-slider-title {
  font-family: var(--font-body);
  font-size: 11px;
  font-weight: 500;
  text-transform: uppercase;
  color: var(--text-primary);
  letter-spacing: 0.5px;
}

.regime-velocity-readout {
  display: flex;
  align-items: baseline;
  gap: 4px;
}

.regime-velocity-value {
  font-family: var(--font-display);
  font-size: 28px;
  color: var(--text-primary);
  line-height: 1;
}
.regime-velocity-value[data-regime="1"] { color: var(--primary); }
.regime-velocity-value[data-regime="2"] { color: var(--negative); }

.regime-slider-track-container {
  position: relative;
  height: 24px;
  display: flex;
  align-items: stretch;
  border: 1px solid var(--border);
  background: var(--surface-2);
}

.regime-slider-zone {
  display: flex;
  align-items: center;
  padding: 0 8px;
  font-family: var(--font-data);
  font-size: 9px;
  color: var(--text-muted);
  text-transform: uppercase;
  border-right: 1px solid var(--border);
}
.regime-slider-zone:last-child {
  border-right: none;
}
.regime-slider-zone--active {
  color: var(--text-primary);
  background: color-mix(in srgb, var(--primary) 10%, transparent);
}
.regime-slider-zone--active[data-zone="2"] {
  background: color-mix(in srgb, var(--negative) 10%, transparent);
  color: var(--negative);
}

.regime-slider-input {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
  cursor: ew-resize;
  z-index: 10;
}

.regime-toggle-section {
  width: 200px;
  border-left: 1px solid var(--border);
  padding-left: 16px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.regime-toggle-label {
  font-family: var(--font-data);
  font-size: 9px;
  text-transform: uppercase;
  color: var(--text-tertiary);
  letter-spacing: 1px;
}

.regime-toggle-btn {
  display: flex;
  border: 1px solid var(--border);
  background: var(--surface-2);
  cursor: pointer;
  padding: 0;
}
.regime-toggle-btn span {
  flex: 1;
  text-align: center;
  font-family: var(--font-data);
  font-size: 10px;
  padding: 6px 0;
  color: var(--text-muted);
  text-transform: uppercase;
}
.regime-toggle-btn span.active {
  background: var(--text-primary);
  color: var(--bg);
}
.regime-toggle-btn.is-fractured span.active {
  background: var(--caution);
  color: #fff;
}

/* ── ZONE B & C: Main Split ── */
.regime-split {
  display: flex;
  gap: 16px;
  flex: 1;
  min-height: 0;
}

/* ZONE B: Gauges */
.regime-gauges {
  flex: 2;
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-auto-rows: minmax(0, 1fr);
  gap: 8px;
}

.regime-gauge {
  background: var(--surface-1);
  border: 1px solid var(--border);
  padding: 12px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.regime-gauge-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.regime-gauge-title {
  font-family: var(--font-body);
  font-size: 11px;
  font-weight: 500;
  text-transform: uppercase;
  color: var(--text-secondary);
}

.regime-gauge-unit-label {
  font-family: var(--font-data);
  font-size: 9px;
  color: var(--text-tertiary);
  text-align: right;
  max-width: 80px;
  line-height: 1.2;
}

.regime-gauge-body {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.regime-gauge-value {
  font-family: var(--font-display);
  font-size: 26px;
  color: var(--text-primary);
  line-height: 1;
}

.regime-gauge-bar-bg {
  height: 4px;
  background: var(--surface-3);
  width: 100%;
  position: relative;
}

.regime-gauge-bar-fill {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  background: var(--primary);
  transition: width 0.3s ease, background 0.3s ease;
}
.regime-gauge--alert .regime-gauge-bar-fill {
  background: var(--negative);
}

/* ZONE C: Narrative */
.regime-narrative {
  flex: 1;
  background: var(--surface-1);
  border: 1px solid var(--border);
  padding: 16px;
  display: flex;
  flex-direction: column;
  position: relative;
}

.regime-narrative--r0 { border-top: 3px solid var(--text-muted); }
.regime-narrative--r1 { border-top: 3px solid var(--primary); }
.regime-narrative--r2 { border-top: 3px solid var(--negative); }

.regime-narrative-eyebrow {
  font-family: var(--font-data);
  font-size: 9px;
  text-transform: uppercase;
  color: var(--text-tertiary);
  letter-spacing: 1px;
  margin-bottom: 12px;
}

.regime-narrative-title {
  font-family: var(--font-display);
  font-size: 20px;
  color: var(--text-primary);
  line-height: 1.2;
  margin-bottom: 12px;
}

.regime-narrative-body {
  font-family: var(--font-body);
  font-size: 11px;
  line-height: 1.6;
  color: var(--text-secondary);
}

.regime-narrative-warning {
  margin-top: auto;
  background: color-mix(in srgb, var(--caution) 10%, transparent);
  border: 1px solid color-mix(in srgb, var(--caution) 30%, transparent);
  padding: 10px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.regime-warning-badge {
  font-family: var(--font-data);
  font-size: 9px;
  color: var(--caution);
  font-weight: 500;
  text-transform: uppercase;
}
.regime-warning-text {
  font-family: var(--font-body);
  font-size: 11px;
  color: var(--text-primary);
  line-height: 1.4;
}

/* ── ZONE D: Portfolio ── */
.regime-portfolio {
  background: var(--surface-1);
  border: 1px solid var(--border);
  padding: 12px 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.regime-portfolio-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.regime-portfolio-title {
  font-family: var(--font-body);
  font-size: 11px;
  font-weight: 500;
  text-transform: uppercase;
  color: var(--text-secondary);
}

.regime-alloc-table {
  width: 100%;
  border-collapse: collapse;
}

.regime-alloc-table th {
  font-family: var(--font-data);
  font-size: 9px;
  text-transform: uppercase;
  color: var(--text-tertiary);
  text-align: left;
  padding-bottom: 6px;
  border-bottom: 1px solid var(--border);
}

.regime-alloc-table td {
  padding: 6px 0;
  border-bottom: 1px solid var(--border-light);
  font-family: var(--font-body);
  font-size: 11px;
  color: var(--text-secondary);
}
.regime-alloc-table tr:last-child td {
  border-bottom: none;
}

.regime-alloc-asset {
  display: flex;
  align-items: center;
  gap: 8px;
}

.regime-alloc-color {
  width: 8px;
  height: 8px;
  background: var(--asset-color);
}

.regime-alloc-pct {
  font-family: var(--font-data);
  font-size: 11px;
  color: var(--text-primary);
  text-align: right;
  width: 40px;
}

.regime-alloc-bar-wrap {
  width: 100%;
  padding-left: 16px;
}

.regime-alloc-bar-bg {
  width: 100%;
  height: 12px;
  background: var(--surface-3);
  position: relative;
  display: flex;
}

.regime-alloc-segment {
  height: 100%;
  background: var(--asset-color);
  transition: width 0.3s ease;
  border-right: 1px solid var(--surface-1);
}

"""

if start_idx != -1 and end_idx != -1:
    content = content[:start_idx] + new_css + content[end_idx:]
    with open("app/globals.css", "w") as f:
        f.write(content)
    print("CSS replaced successfully.")
else:
    print("Could not find start or end index.")
