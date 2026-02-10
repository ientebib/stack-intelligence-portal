/* eslint-disable @next/next/no-img-element */

import type { TableRow } from "@/lib/data/types";

type NnnPropertyCardProps = {
  category: string;
  title: string;
  subtitle: string;
  image: string;
  imageObjectPosition?: string;
  rows: TableRow[];
};

export function NnnPropertyCard({
  category,
  title,
  subtitle,
  image,
  imageObjectPosition,
  rows
}: NnnPropertyCardProps) {
  return (
    <div className="nnn-property-card">
      <div className="nnn-image-wrap">
        <img
          src={image}
          className="nnn-image"
          style={imageObjectPosition ? { objectPosition: imageObjectPosition } : undefined}
          alt={`${title} NNN Property`}
        />
        <div className="nnn-image-overlay">
          <div className="nnn-category">{category}</div>
          <div className="nnn-title">{title}</div>
          <div className="nnn-subtitle">{subtitle}</div>
        </div>
      </div>
      <div className="nnn-table-wrap">
        <table className="nnn-table">
          <tbody>
            {rows.map((row, index) => (
              <tr key={row.label} className={index < rows.length - 1 ? "with-border" : ""}>
                <td>{row.label}</td>
                <td>{row.value}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
