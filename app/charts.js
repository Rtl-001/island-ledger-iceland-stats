// Hand-drawn SVG charts for The Island Ledger. No library, no network:
// each builder returns an SVG string the page drops into its panel.

const CHART_COLORS = ["#14586b", "#5d7a4e", "#c25e3a", "#c9a227", "#7fb6c4", "#41525d"];

function svgOpen(width, height, title) {
  return `<svg viewBox="0 0 ${width} ${height}" role="img" aria-label="${title}"><title>${title}</title>`;
}

function niceCeiling(value) {
  const power = Math.pow(10, Math.floor(Math.log10(value)));
  const scaled = value / power;
  if (scaled <= 1) return power;
  if (scaled <= 2) return 2 * power;
  if (scaled <= 2.5) return 2.5 * power;
  if (scaled <= 5) return 5 * power;
  return 10 * power;
}

// A line chart over {label, value} points, with a soft area fill.
function lineChart(points, options) {
  const width = 640;
  const height = 260;
  const padLeft = 56;
  const padRight = 16;
  const padTop = 18;
  const padBottom = 34;
  const values = points.map((point) => point.value);
  const floor = options.floorZero ? 0 : Math.min(...values) * 0.92;
  const ceiling = niceCeiling(Math.max(...values) * 1.05);
  const innerW = width - padLeft - padRight;
  const innerH = height - padTop - padBottom;
  const xAt = (index) => padLeft + (innerW * index) / Math.max(1, points.length - 1);
  const yAt = (value) => padTop + innerH - ((value - floor) / (ceiling - floor)) * innerH;

  let svg = svgOpen(width, height, options.title);
  for (let step = 0; step <= 4; step += 1) {
    const tickValue = floor + ((ceiling - floor) * step) / 4;
    const y = yAt(tickValue);
    svg += `<line class="grid-line" x1="${padLeft}" y1="${y}" x2="${width - padRight}" y2="${y}"></line>`;
    svg += `<text class="axis-label" x="${padLeft - 8}" y="${y + 4}" text-anchor="end">${options.formatTick(tickValue)}</text>`;
  }
  const path = points.map((point, index) => `${index === 0 ? "M" : "L"}${xAt(index).toFixed(1)},${yAt(point.value).toFixed(1)}`).join(" ");
  const area = `${path} L${xAt(points.length - 1).toFixed(1)},${padTop + innerH} L${padLeft},${padTop + innerH} Z`;
  svg += `<path d="${area}" fill="${options.color}" opacity="0.14"></path>`;
  svg += `<path d="${path}" fill="none" stroke="${options.color}" stroke-width="2.5"></path>`;
  points.forEach((point, index) => {
    svg += `<circle cx="${xAt(index).toFixed(1)}" cy="${yAt(point.value).toFixed(1)}" r="3.5" fill="${options.color}"><title>${point.label}: ${options.formatValue(point.value)}</title></circle>`;
    svg += `<text class="axis-label" x="${xAt(index).toFixed(1)}" y="${height - 12}" text-anchor="middle">${point.label}</text>`;
  });
  const last = points[points.length - 1];
  svg += `<text class="value-label" x="${xAt(points.length - 1).toFixed(1)}" y="${(yAt(last.value) - 10).toFixed(1)}" text-anchor="end">${options.formatValue(last.value)}</text>`;
  svg += "</svg>";
  return svg;
}

// A compact sparkline for the cover dashboard: line, soft fill, end label.
function sparkChart(points, options) {
  const width = 320;
  const height = 96;
  const padLeft = 8;
  const padRight = 8;
  const padTop = 16;
  const padBottom = 20;
  const values = points.map((point) => point.value);
  const floor = options.floorZero ? 0 : Math.min(...values) * 0.94;
  const ceiling = Math.max(...values) * 1.04;
  const innerW = width - padLeft - padRight;
  const innerH = height - padTop - padBottom;
  const xAt = (index) => padLeft + (innerW * index) / Math.max(1, points.length - 1);
  const yAt = (value) => padTop + innerH - ((value - floor) / (ceiling - floor)) * innerH;

  let svg = svgOpen(width, height, options.title);
  const path = points
    .map((point, index) => `${index === 0 ? "M" : "L"}${xAt(index).toFixed(1)},${yAt(point.value).toFixed(1)}`)
    .join(" ");
  svg += `<path d="${path} L${xAt(points.length - 1).toFixed(1)},${padTop + innerH} L${padLeft},${padTop + innerH} Z" fill="${options.color}" opacity="0.16"></path>`;
  svg += `<path d="${path}" fill="none" stroke="${options.color}" stroke-width="2.4"></path>`;
  const last = points[points.length - 1];
  svg += `<circle cx="${xAt(points.length - 1).toFixed(1)}" cy="${yAt(last.value).toFixed(1)}" r="3.4" fill="${options.color}"></circle>`;
  svg += `<text class="value-label" x="${xAt(points.length - 1).toFixed(1)}" y="${(yAt(last.value) - 8).toFixed(1)}" text-anchor="end">${options.formatValue(last.value)}</text>`;
  svg += `<text class="axis-label" x="${padLeft}" y="${height - 5}">${points[0].label}</text>`;
  svg += `<text class="axis-label" x="${width - padRight}" y="${height - 5}" text-anchor="end">${last.label}</text>`;
  svg += "</svg>";
  return svg;
}

// Compact labelled share bars for the cover dashboard.
function shareBars(rows, options) {
  const width = 320;
  const rowH = 20;
  const height = rows.length * rowH + 8;
  const labelW = 118;
  const valueW = 44;
  const innerW = width - labelW - valueW;
  const ceiling = Math.max(...rows.map((row) => row.share));

  let svg = svgOpen(width, height, options.title);
  rows.forEach((row, index) => {
    const y = 6 + index * rowH;
    const w = (row.share / ceiling) * innerW;
    const color = CHART_COLORS[index % CHART_COLORS.length];
    svg += `<text class="axis-label" x="${labelW - 6}" y="${y + 13}" text-anchor="end">${row.label}</text>`;
    svg += `<rect x="${labelW}" y="${y}" width="${w.toFixed(1)}" height="15" rx="3" fill="${color}"><title>${row.label}: ${row.share}%</title></rect>`;
    svg += `<text class="value-label" x="${width - 2}" y="${y + 13}" text-anchor="end">${row.share}%</text>`;
  });
  svg += "</svg>";
  return svg;
}

// One stacked bar for a two-or-more-way split, with a legend line under it.
function stackedBar(slices, options) {
  const width = 320;
  const height = 68;
  const barY = 10;
  const barH = 26;
  const total = slices.reduce((sum, slice) => sum + slice.share, 0);
  let x = 0;

  let svg = svgOpen(width, height, options.title);
  slices.forEach((slice, index) => {
    const w = (slice.share / total) * width;
    const color = CHART_COLORS[index % CHART_COLORS.length];
    svg += `<rect x="${x.toFixed(1)}" y="${barY}" width="${w.toFixed(1)}" height="${barH}" fill="${color}"><title>${slice.label}: ${slice.share}%</title></rect>`;
    svg += `<text class="stack-label" x="${(x + w / 2).toFixed(1)}" y="${barY + 17}" text-anchor="middle">${slice.share}%</text>`;
    svg += `<text class="axis-label" x="${(x + w / 2).toFixed(1)}" y="${barY + barH + 16}" text-anchor="middle">${slice.label}</text>`;
    x += w;
  });
  svg += "</svg>";
  return svg;
}

// Vertical bars for {label, value} rows.
function barChart(rows, options) {
  const width = 640;
  const height = 260;
  const padLeft = 56;
  const padRight = 16;
  const padTop = 26;
  const padBottom = 40;
  const ceiling = niceCeiling(Math.max(...rows.map((row) => row.value)) * 1.08);
  const innerW = width - padLeft - padRight;
  const innerH = height - padTop - padBottom;
  const slot = innerW / rows.length;
  const barW = Math.min(64, slot * 0.58);
  const yAt = (value) => padTop + innerH - (value / ceiling) * innerH;

  let svg = svgOpen(width, height, options.title);
  for (let step = 0; step <= 4; step += 1) {
    const tickValue = (ceiling * step) / 4;
    const y = yAt(tickValue);
    svg += `<line class="grid-line" x1="${padLeft}" y1="${y}" x2="${width - padRight}" y2="${y}"></line>`;
    svg += `<text class="axis-label" x="${padLeft - 8}" y="${y + 4}" text-anchor="end">${options.formatTick(tickValue)}</text>`;
  }
  rows.forEach((row, index) => {
    const x = padLeft + slot * index + (slot - barW) / 2;
    const y = yAt(row.value);
    const color = options.colorAt ? options.colorAt(index) : options.color;
    svg += `<rect x="${x.toFixed(1)}" y="${y.toFixed(1)}" width="${barW.toFixed(1)}" height="${(padTop + innerH - y).toFixed(1)}" rx="4" fill="${color}"><title>${row.label}: ${options.formatValue(row.value)}</title></rect>`;
    svg += `<text class="value-label" x="${(x + barW / 2).toFixed(1)}" y="${(y - 7).toFixed(1)}" text-anchor="middle">${options.formatValue(row.value)}</text>`;
    svg += `<text class="axis-label" x="${(x + barW / 2).toFixed(1)}" y="${height - 16}" text-anchor="middle">${row.label}</text>`;
  });
  svg += "</svg>";
  return svg;
}

// Horizontal bars, for rows whose labels are long.
function hbarChart(rows, options) {
  const width = 640;
  const rowH = 34;
  const height = rows.length * rowH + 24;
  const padLeft = 150;
  const padRight = 70;
  const innerW = width - padLeft - padRight;
  const ceiling = niceCeiling(Math.max(...rows.map((row) => row.value)) * 1.05);

  let svg = svgOpen(width, height, options.title);
  rows.forEach((row, index) => {
    const y = 14 + index * rowH;
    const w = (row.value / ceiling) * innerW;
    const color = options.colorAt ? options.colorAt(index) : options.color;
    svg += `<text class="axis-label" x="${padLeft - 10}" y="${y + 16}" text-anchor="end">${row.label}</text>`;
    svg += `<rect x="${padLeft}" y="${y}" width="${w.toFixed(1)}" height="20" rx="4" fill="${color}"><title>${row.label}: ${options.formatValue(row.value)}</title></rect>`;
    svg += `<text class="value-label" x="${(padLeft + w + 8).toFixed(1)}" y="${y + 16}">${options.formatValue(row.value)}</text>`;
  });
  svg += "</svg>";
  return svg;
}

// A donut for {label, share} slices that sum to 100, with a legend.
function donutChart(slices, options) {
  const width = 640;
  const height = 270;
  const cx = 150;
  const cy = 135;
  const radius = 104;
  const inner = 58;
  const total = slices.reduce((sum, slice) => sum + slice.share, 0);
  let angle = -Math.PI / 2;
  let svg = svgOpen(width, height, options.title);
  slices.forEach((slice, index) => {
    const sweep = (slice.share / total) * Math.PI * 2;
    const x1 = cx + radius * Math.cos(angle);
    const y1 = cy + radius * Math.sin(angle);
    const x2 = cx + radius * Math.cos(angle + sweep);
    const y2 = cy + radius * Math.sin(angle + sweep);
    const xi1 = cx + inner * Math.cos(angle + sweep);
    const yi1 = cy + inner * Math.sin(angle + sweep);
    const xi2 = cx + inner * Math.cos(angle);
    const yi2 = cy + inner * Math.sin(angle);
    const large = sweep > Math.PI ? 1 : 0;
    const color = CHART_COLORS[index % CHART_COLORS.length];
    svg += `<path d="M${x1.toFixed(1)},${y1.toFixed(1)} A${radius},${radius} 0 ${large} 1 ${x2.toFixed(1)},${y2.toFixed(1)} L${xi1.toFixed(1)},${yi1.toFixed(1)} A${inner},${inner} 0 ${large} 0 ${xi2.toFixed(1)},${yi2.toFixed(1)} Z" fill="${color}"><title>${slice.label}: ${slice.share}%</title></path>`;
    angle += sweep;
  });
  svg += `<text class="value-label" x="${cx}" y="${cy - 2}" text-anchor="middle">${options.centerTop}</text>`;
  svg += `<text class="axis-label" x="${cx}" y="${cy + 16}" text-anchor="middle">${options.centerBottom}</text>`;
  slices.forEach((slice, index) => {
    const y = 48 + index * 34;
    const color = CHART_COLORS[index % CHART_COLORS.length];
    svg += `<rect x="300" y="${y - 12}" width="14" height="14" rx="3" fill="${color}"></rect>`;
    svg += `<text class="axis-label" x="324" y="${y}" font-size="13">${slice.label}</text>`;
    svg += `<text class="value-label" x="600" y="${y}" text-anchor="end">${slice.share}%</text>`;
  });
  svg += "</svg>";
  return svg;
}
